import path from 'path'
import webpack from 'webpack'
import karmaWebpack from 'karma-webpack'
import * as utils from 'common/services/utils'
import * as Env from 'common/constants/Env'
import * as Paths from 'common/constants/paths'
import nodeCleanup from 'node-cleanup'
import rimraf from 'rimraf'

const Globals = {
  'process.env.NODE_ENV': JSON.stringify(Env.DEVELOPMENT),
  __DEV__: true,
  __TEST__: true
}
const testTmpPath = 'test-setup'

module.exports = (config) => {
  const options = global.optionsTransport
  const {application, coverage} = options
  const WebpackConfig = getWebpackConfig({
    ...options,
    useOutput: false,
    useEntries: false
  })

  const pathToApp = options.blob || path.join(Paths.SOURCE, application)
  const testEntries = getFiles(pathToApp)

  const files = [
    path.join(utils.findModule('babel-polyfill'), 'dist/polyfill.js'),
    path.join(utils.findModule('whatwg-fetch'), 'fetch.js')
  ].concat(testEntries)

  clearOnExit(testEntries)

  config.set({
    autoWatch: false,
    singleRun: true,
    frameworks: ['jasmine'],
    files,
    plugins: [
      karmaWebpack,
      'karma-phantomjs-launcher',
      'karma-coverage',
      'karma-jasmine',
      'karma-spec-reporter',
      'karma-sourcemap-loader',
      'karma-junit-reporter'
    ],
    browsers: ['PhantomJS'],
    preprocessors: {
      [`{${Paths.SOURCE_DIR},${Paths.TMP_DIR}}/**/*.js`]: ['webpack', 'sourcemap']
    },

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_ERROR,

    reporters: !coverage ? ['spec', 'junit'] : ['dots', 'coverage', 'junit'],
    coverageReporter: {
      type: 'text'
    },
    specReporter: {
      suppressPassed: true,
      suppressSkipped: true
    },
    junitReporter: {
      outputFile: getSuiteName(options) + '.xml',
      outputDir: path.join(Paths.TMP, 'test-reports'),
      useBrowserName: false
    },
    webpack: WebpackConfig,
    webpackMiddleware: {
      stats: WebpackConfig.stats,
      noInfo: true,
      watchOptions: WebpackConfig.watchOptions
    }
  })
}

Object.assign(module.exports, {
  getWebpackConfig,
  getRequiredGlob,
  generateEntriesFrom
})

function getWebpackConfig (options) {
  const generalWebpackConfig = require('build/webpack/webpack.config')(options)
  const webpackConfig = {
    entry: {nil: `${__dirname}/nil.js`},
    stats: generalWebpackConfig.stats,
    target: generalWebpackConfig.target,
    watchOptions: generalWebpackConfig.watchOptions,
    module: generalWebpackConfig.module,
    resolveLoader: generalWebpackConfig.resolveLoader,
    externals: {
      // cheerio: 'window',
      'react/addons': true,
      'react/lib/ExecutionEnvironment': true,
      'react/lib/ReactContext': true
    },
    resolve: generalWebpackConfig.resolve,
    plugins: [
      new webpack.DefinePlugin(Globals)
    ],
    devtool: 'inline-source-map',
    output: {
      devtoolModuleFilenameTemplate: '[resource-path]?[hash]'
    }
  }

  if (options.coverage) {
    webpackConfig.module.preLoaders = [
      // transpile all files except testing sources with babel as usual
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel'
      },
      // transpile and instrument only testing sources with babel-istanbul
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components|_spec\.js|src\/common|src\/core)/,
        loader: 'babel-istanbul',
        query: {
          cacheDirectory: true
          // see below for possible options
        }
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components|_spec\.js)/,
        loader: 'strip-code',
        query: utils.getStripConfig()
      }
    ]
  }

  return webpackConfig
}

function getFiles (path) {
  return generateEntriesFrom(getRequiredGlob(path))
}

function getRequiredGlob (appPath) {
  if (appPath !== undefined) {
    if (!utils.isJsFile(appPath)) {
      appPath = [
        // appPath + '/index.js',
        appPath + '/**/*_spec.js'
      ]
    }
    appPath = [].concat(appPath)
  } else {
    appPath = []
  }

  return appPath
}

function generateEntriesFrom (globs) {
  const fs = require('fs')
  const path = require('path')

  try {
    fs.mkdirSync(Paths.TMP)
  } catch (e) {
  }

  try {
    fs.mkdirSync(path.join(Paths.TMP, testTmpPath))
  } catch (e) {
  }

  const template = readTestSetup()
  const files = globs.reduce(function (files, glob) {
    return files.concat(require('fast-glob').sync(glob, {
      ignore: '**/node_modules/**',
      bashNative: []
    }))
  }, [])

  return files.map((file) => {
    const tmpTestSetup = template + '\r\n' + `require("${file}")`
    const fileName = path.join(Paths.TMP, testTmpPath, getMD5(file).substr(0, 8) + '.js')
    fs.writeFileSync(fileName, tmpTestSetup)
    return fileName
  })
}

function readTestSetup () {
  const fs = require('fs')
  const path = require('path')
  return fs.readFileSync(path.resolve(__dirname, 'testSetup.js')).toString()
}

function getMD5 (text) {
  return require('crypto').createHash('md5').update(text).digest('hex')
}

function clearOnExit (files) {
  nodeCleanup(() => {
    files.forEach(fileName => {
      rimraf.sync(path.join(fileName))
    })
  })
}

function getSuiteName ({application, blob}) {
  let suitName = application

  if (blob) {
    suitName = path.dirname(blob).trim()
    for (let entry of ['src', 'tests', '**', new RegExp(`(^${path.sep})|(${path.sep}$)`, 'g')]) {
      suitName = suitName.replace(entry, '')
    }

    suitName = suitName
      .replace(new RegExp(path.sep, 'g'), '-')
  }

  return suitName
}
