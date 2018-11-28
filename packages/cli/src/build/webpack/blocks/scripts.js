import os from 'os'
import webpack from 'webpack'
import _merge from 'lodash/merge'
import * as Paths from 'common/constants/paths'
import * as utils from 'common/services/utils'
import createBabelConfig from '../babel'
import NgAnnotatePlugin from 'ng-annotate-webpack-plugin'
import Expression from 'common/constants/Expressions'

export default (options) => {
  const stripLoader = {
    loader: 'strip-code-loader',
    options: utils.getStripConfig()
  }
  const loaders = [
    utils.isProduction() && options.annotateLoader && 'ng-annotate-loader',
    'babel-loader?' + JSON.stringify(_merge(createBabelConfig(options), options.createBabelConfig)),
    // 'eslint-loader',
    stripLoader
  ].filter(Boolean)

  const valLoaders = ['val-loader']//loaders.concat('val-loader')
  global.Paths = Paths
  global.utils = utils

  const jsxFiles = {
    test: Expression.JS,
    use: loaders,
    include: [
      Paths.SOURCE,
      // Paths.DBS
    ],
    exclude: [
      /node_modules/
    ]
  }

  return context => ({
    module: {
      rules: [
        /*{
          enforce: 'pre',
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'eslint-loader'
        },*/
        !process.env.Benchmark && {
          enforce: 'pre',
          test: Expression.VAL_JS,
          use: valLoaders
        },
        jsxFiles
      ].filter(Boolean)
    },
    plugins: [
      utils.isProduction() && options.uncompress !== true && new NgAnnotatePlugin(),
      utils.isProduction() && options.uncompress !== true && new webpack.optimize.UglifyJsPlugin({
        compress: {warnings: false},
        parallel: os.cpus().length
      })
    ].filter(Boolean)
  })
}
