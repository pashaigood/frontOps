import path from 'path'
import * as paths from 'common/constants/paths'
import * as utils from 'common/services/utils'
export { default as resolveModules } from './resolveModules'
export { default as threadLoader } from './threadLoader'
export { default as cacheLoader } from './cacheLoader'
export { default as extractText } from './extractText'
export { default as setOutput } from './setOutput'
export { default as offline } from './offline/index'
export { default as scripts } from './scripts'
export { default as styles } from './styles'
export { default as alias } from './alias/index'
export { default as dll } from './dll'

export const pug = () => {
  const options = {pretty: true}
  return {
    module: {
      rules: [
        {test: /\.(pug|jade)$/, exclude: /node_modules/, loader: 'pug-loader', options}
      ]
    }
  }
}

export const assets = () => ({
  module: {
    rules: [
      {
        test: /\.((svg)(\?v=[0-9]\.[0-9]\.[0-9]))|(svg|jpe?g|png|gif|ico)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'assets/[hash].[ext]'
        }
      },
      {
        test: /\.((woff2?)(\?v=[0-9]\.[0-9]\.[0-9]))|(woff2?)$/,
        loader: 'url-loader',
        options: {
          limit: 20000,
          name: 'assets/[hash].[ext]'
        }
      },
      {
        test: /\.((ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9]))|(ttf|eot)$/,
        loader: 'url-loader',
        options: {
          limit: 20000,
          name: 'assets/[hash].[ext]'
        }
      }
    ]
  },
  node: {
    fs: 'empty',
    vm: 'empty',
    net: 'empty',
    tls: 'empty'
  }
})

/*
 {
 test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
 loader: "url?limit=10000&mimetype=application/font-woff"
 }, {
 test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
 loader: "url?limit=10000&mimetype=application/font-woff"
 }, {
 test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
 loader: "url?limit=10000&mimetype=application/octet-stream"
 }, {
 test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
 loader: "file"
 }, {
 test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
 loader: "url?limit=10000&mimetype=image/svg+xml"
 }
 */

export const html = () => ({
  module: {
    rules: [
      {test: /\.html/, loader: 'html-loader'}
    ]
  }
})

export const entryPoint = (options = {}) => () => {
  let entries = utils.getEntries(options)
  const applications = utils.buildEntriesConfig()
  const isPolyfills = utils.isProduction() || options.polyfills

  if (options.skipApplications) {
    entries = entries.filter(app => !options.skipApplications.includes(app))
  }

  return {
    context: paths.CWD,
    entry: entries.reduce((entries, entry) => {
      const application = applications[entry]
      entries[application.output] = [
        // IE sensitive
        isPolyfills && utils.findModule('babel-polyfill'),
        isPolyfills && utils.findModule('whatwg-fetch'),
        application.path
      ].filter(Boolean)
      return entries
    }, {})
  }
}

export function loaderResolve () {
  return {
    resolveLoader: {
      modules: [paths.MODULES_DBS, 'node_modules'],
      moduleExtensions: ['-loader']
    }
  }
}

export const noParse = () => ({
  module: {
    noParse: utils.isDevelopment() ? [/\.min\.js$/i] : void 0
  }
})
