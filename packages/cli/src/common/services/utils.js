import * as Paths from '../constants/paths'
import * as Env from '../constants/Env'
import * as Config from '../constants/Config'
import fastGlob from 'fast-glob'
import path from 'path'
import _defaults from 'lodash/defaults'

export function buildEntriesConfig () {
  if (!buildEntriesConfig.cache) {
    const appConfigs = fastGlob.sync('**/package.json', {
      cwd: Paths.SOURCE,
      deep: 1,
      bashNative: []
    })

    buildEntriesConfig.cache = appConfigs.reduce((apps, configPath) => {
      const entry = configPath.split('/')[0]
      const config = require(path.join(Paths.SOURCE, configPath))

      if (config.application) {
        apps[entry] = Object.assign({
          name: entry,
          output: entry,
          path: path.join(Paths.SOURCE, entry)
        }, config.application === true ? {} : config.application)
      }
      return apps
    }, {})
  }

  return buildEntriesConfig.cache
}

/**
 *
 * @param [options]
 * @param {String} options.application
 * @return {Array}
 */
export function getEntries (options) {
  const entriesConfig = buildEntriesConfig()
  if (options !== void 0 && entriesConfig[options.application]) {
    return [options.application]
  }
  return Object.keys(entriesConfig)
}

export function getLayouts (layoutDir = Paths.LAYOUTS) {
  if (!getLayouts.cache[layoutDir]) {
    getLayouts.cache[layoutDir] = fastGlob.sync('index.{html,pug,jade}', {
      cwd: layoutDir,
      deep: 0,
      bashNative: []
    }).map(layout => path.join(layoutDir, layout))
  }

  return getLayouts.cache[layoutDir]
}
getLayouts.cache = {}

/**
 *
 * @param {Array<String>} [layouts]
 * @return {*}
 */
export function getDefaultLayout (layouts = getLayouts()) {
  if (layouts.length === 0) {
    throw new Error('Layouts should exists.')
  }

  if (layouts.length > 1) {
    const isJade = layouts.find(layout => layout.includes('.jade'))
    const isPug = layouts.find(layout => layout.includes('.pug'))
    return isPug || isJade || layouts[0]
  } else {
    return layouts[0]
  }
}

/**
 *
 * @param appPath
 */
export function getAppLayout (appPath) {
  try {
    return getDefaultLayout(getLayouts(appPath))
  } catch (e) {
    return false
  }
}

/**
 *
 * @param {String} env environment.
 * @return {*}
 */
export function getStripConfig (env = process.env.NODE_ENV) {
  if (env === Env.PRODUCTION) {
    return {
      start_comment: '(?:develop|test)-code',
      end_comment: 'end-(?:develop|test)-code'
    }
  }

  const code = env === Env.TEST ? 'develop' : 'test'

  return {
    start_comment: '(?:#code#|production|production-#code#)-code'.replace(/#code#/g, code),
    end_comment: 'end-(?:#code#|production|production-#code#)-code'.replace(/#code#/g, code)
  }
}

export function isProduction () {
  return process.env.NODE_ENV !== Env.TEST && process.env.NODE_ENV === Env.PRODUCTION
}

export function isDevelopment () {
  return !isProduction()
}

export function convertAppPathToName (appPath) {
  if (isBlob(appPath)) {
    appPath = appPath.split('*').shift()
  }
  return appPath && appPath.replace(Paths.SOURCE_DIR, '').replace(/(\/$)|(^\/)/, '').split('/')[0]
}

export function isBlob (path) {
  return /\*/.test(path)
}

export function isJsFile (path) {
  return /\.js$/.test(path)
}

export function getBenchmarkConfig (type) {
  try {
    return require(path.join(Paths.BENCHMARK_RESULT, type))
  } catch (e) {
    return {}
  }
}

export function applyBenchmarkTo (options, env) {
  !process.env.Benchmark && _defaults(options, getBenchmarkConfig(env))
}

export function getPublicHost (conf = Config) {
  return isDevelopment() ? `${conf.PROTO}://${conf.HOST}${conf.PORT !== 80 ? ':' + conf.PORT : ''}/` : '/'
}

export function getProxyHost (conf = Config) {
  return `${conf.PROXY_PROTO}://${conf.PROXY_HOST}${conf.PROXY_PORT !== 80 ? ':' + conf.PROXY_PORT : ''}`
}

export function findModule (module) {
  const fs = require('fs')
  const path = require('path')
  const dbsPath = path.join(Paths.MODULES_DBS, module)
  const cwdPath = path.join(Paths.MODULES, module)
  if (fs.existsSync(dbsPath)) {
    return dbsPath
  }
  if (fs.existsSync(cwdPath)) {
    return cwdPath
  }

  throw new Error(`${module} not found.`)
}
