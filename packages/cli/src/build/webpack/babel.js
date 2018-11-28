import * as Config from 'common/constants/Config'
import * as utils from 'common/services/utils'

export default (options = {}) => {
  const plugins = [
    'transform-decorators-legacy',
    'syntax-dynamic-import',
    (utils.isProduction() || options.babelTransformRuntime) && ['transform-runtime', {
      'polyfill': false
    }],
    'transform-class-properties',
    'transform-object-rest-spread'
  ].filter(Boolean)

  return ({
    cacheDirectory: utils.isDevelopment() && options.babelCacheDirectory,
    babelrc: false,
    presets: [
      ['env', {
        'modules': options.babelModule ? options.babelModule : false,
        'targets': {
          // 'node': '8.6',
          'browsers': (utils.isProduction() || options.babelBrowser) ? Config.browsers : ["last 1 versions"]
        },
        'useBuiltIns': 'usage',
        // 'debug': true
      }],
      'react'
    ].map(preset),
    plugins: plugins.map(plugin),
    env: {
      development: {
        plugins: []
          .map(plugin)
          .concat([
              options.hotReload && 'react-hot-loader/babel.js'
            ]
              .filter(Boolean)
              .map(nodeModule)
          )
      },
      production: {
        presets: [
          // 'minify'
        ].map(preset),
        /*plugins: plugins.concat([
         ]).map(plugin)*/
      }
    },
    ignore: [
      options.babelIgnoreModules && 'node_modules'
    ].filter(Boolean)
  })
}

function preset (entry) {
  return getModule('babel-preset-', entry)
}

function plugin (entry) {
  return getModule('babel-plugin-', entry)
}

function nodeModule (entry) {
  return utils.findModule(entry)
}

function getModule (prefix, entry) {
  const absolutePath = utils.findModule(prefix + getEntry(entry))
  if (!isComplex(entry)) {
    return absolutePath
  } else {
    entry[0] = absolutePath
    return entry
  }
}

function isComplex (entry) {
  if (typeof entry === 'string') {
    return false
  } else {
    return true
  }
}

function getEntry (entry) {
  if (!isComplex(entry)) {
    return entry
  } else {
    return entry[0]
  }
}
