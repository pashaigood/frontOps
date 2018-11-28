import path from 'path'
import webpack from 'webpack'
import dllWebpack from './index'
import dllWebpackConfig, { getManifestPath, getDllPath } from './webpack.config'
import AddAssetHtmlPlugin from 'add-asset-html-webpack-plugin'
import * as paths from 'common/constants/paths'

/**
 *
 * @param options
 * @param {Object} options.entry
 * @constructor
 */
export default function InjectDll (options) {
  this.options = options
}

InjectDll.prototype.apply = function (compiler) {
  dllWebpackConfig.entry = this.options.entry

  // Object.keys(dllWebpackConfig.entry).forEach(dll => {
  //   new webpack.DllReferencePlugin({
  //     context: paths.CWD,
  //     manifest: getManifestPath(dll)
  //   }).apply(compiler)
  // })

  new AddAssetHtmlPlugin(
    Object.keys(dllWebpackConfig.entry).map(dll => ({
      publicPath: '/common',
      filepath: getDllPath(dll),
      includeSourcemap: false
    }))
  ).apply(compiler)

  let firstRun = true
  compiler.plugin(['run', 'watch-run'], (_compiler, callback) => {
    console.log('run')
    if (firstRun) {
      firstRun = false
      const dllCompiler = dllWebpack(dllWebpackConfig)
      dllCompiler.run(() => {
        console.log('first')
        callback()
      })
    } else {
      console.log('other')
      callback()
    }
  })
}
