import path from 'path'
import * as paths from 'common/constants/paths'
import * as utils from 'common/services/utils'
import AutoDllPlugin from 'autodll-webpack-plugin'
import LocalAddAssetHtmlPlugin from '../plugins/autodll-webpack-plugin/index'
import _camelCase from 'lodash/camelCase'
import InjectDll from '../plugins/dll/InjectDll'

export default (options) => {
  return () => ({
    plugins: []
      .concat(
        options.localAutoDll === true && localAutoDll(options)
      )
      .concat(
        options.autoDll === true && autoDll(options)
      )
      .concat(
        options.vanillaDll === true && vanillaDll(options)
      )
      .filter(Boolean)
  })
}

function autoDll (options) {
  return createAutoDllConfig(options, AutoDllPlugin)
}

function localAutoDll (options) {
  return createAutoDllConfig(options, LocalAddAssetHtmlPlugin)
}

function createAutoDllConfig (options, AutoDll) {
  const commonConfig = {
    context: paths.CWD,
    publicPath: utils.getPublicHost(),
    inject: true, // will inject the DLL bundle to index.html
    path: './common/dll'
  }

  return [
   /* options.application && new AutoDll({
      ...commonConfig,
      entry: {
        [`vendor_${options.application}`]: getApplicationVendor(options.application)
      }
    }),*/
    new AutoDll({
      ...commonConfig,
      entry: options.autoDllSingle !== false ? {
        vendor: getCommonVendor()
      } : getMultiEntryVendor()
    })
  ]
}

function vanillaDll (options) {
  return new InjectDll({
    entry: {
      vendor: getCommonVendor()
    }
  })
}

export function getMultiEntryVendor () {
  const packageData = require(path.join(paths.COMMON, 'package.json'))
  return Object.keys(packageData.dependencies).reduce((vendor, pkg) => {
    vendor[_camelCase(pkg)] = [path.join(paths.MODULES_COMMON, pkg)]
    return vendor
  }, {})
}

export function getCommonVendor () {
  const packageData = require(path.join(paths.COMMON, 'package.json'))
  return Object.keys(packageData.dependencies).map(pkg => path.join(paths.MODULES_COMMON, pkg))
}

function getApplicationVendor (application) {
  if (!application) {
    return []
  }
  const pathToApp = path.join(paths.SOURCE, application)
  const packageData = require(path.join(pathToApp, 'package.json'))
  const dllIgnore = (packageData.application && packageData.application.dllIgnore) || []

  return Object.keys(packageData.dependencies).filter(dep => !dllIgnore.includes(dep)).map(pkg => path.join(pathToApp, paths.MODULES_DIR, pkg))
}
