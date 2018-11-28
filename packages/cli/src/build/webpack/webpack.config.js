import findCacheDir from 'find-cache-dir'
import * as paths from 'common/constants/paths'
import * as Config from 'common/constants/Config'
import * as utils from 'common/services/utils'
import * as Env from 'common/constants/Env'
import * as blocks from './blocks/index'
import happypack from 'webpack-blocks-happypack'
import BundleAnalyzerPlugin from 'webpack-bundle-analyzer'
import HardSourceWebpackPlugin from 'hard-source-webpack-plugin'
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin'
import webpack from 'webpack'

const {
  addPlugins, createConfig, env,
  sourceMaps, defineConstants
} = require('@webpack-blocks/webpack2')

/**
 *
 * @param {Object} options
 * @param {Boolean} [options.development]
 * @param {String} [options.application]
 * @param {String} [options.number]
 * @param {Boolean} [options.uncompress]
 * @return {*}
 */
module.exports = (options) => {
  const loaders = [
    blocks.scripts(options),
    blocks.styles(options),
    blocks.pug,
    blocks.assets,
    blocks.html
  ]

  const config = createConfig.vanilla(
    [
      defineConstants({
        'process.env.NODE_ENV': options.development ? Env.DEVELOPMENT : Env.PRODUCTION,
        'process.env.PUBLIC_PATH': paths.PUBLIC.replace(/\/$/, ''),
        '__DEV__': options.development,
        // TODO: implement test
        '__TEST__': false
      }),
      options.useEntries !== false && blocks.entryPoint(options),
      options.useOutput !== false && blocks.setOutput(options),
      blocks.resolveModules,
      blocks.alias,
      blocks.loaderResolve,
      options.cache && blocks.cacheLoader(options),
      blocks.noParse,
      options.happypack === true && happypack(loaders, {
        verbose: false,
        tempDir: findCacheDir({name: '.happypack'})
      }),
      options.threadLoader === true && blocks.threadLoader(options),
      addPlugins([
        new CaseSensitivePathsPlugin(),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        options.analyzer && new BundleAnalyzerPlugin.BundleAnalyzerPlugin({
          // analyzerMode: 'static',
          analyzerMode: 'server',
          analyzerHost: Config.HOST,
          analyzerPort: Config.PORT,
          defaultSizes: 'gzip',
          logLevel: 'silent',
          openAnalyzer: true,
          // reportFilename: 'report.html'
        }),
        options.hardSource && new HardSourceWebpackPlugin({
          environmentHash: function () {
            // Return a string or a promise resolving to a string of a hash of the
            return new Promise(function (resolve, reject) {
              require('fs').readFile(paths.DBS + '/package-lock.json', function (err, src) {
                if (err) {return reject(err)}
                resolve(
                  require('crypto').createHash('md5').update(src).digest('hex')
                )
              })
            })
          }
        }),
        options.autoPrefetch && new webpack.AutomaticPrefetchPlugin()
      ].filter(Boolean)),

      env(Env.DEVELOPMENT, [
        blocks.dll(options),
        sourceMaps()
      ]),

      env(Env.PRODUCTION, [
        options.offline && blocks.offline(options),
        blocks.extractText(),
        addPlugins([
          new webpack.HashedModuleIdsPlugin(),
          new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            filename: 'common/index.js?[chunkhash]',
            minChunks: utils.getEntries().length
          })
        ])
      ].filter(Boolean))
    ]
      .concat(options.happypack !== true && loaders)
      .filter(Boolean)
  )

  config.stats = false
  return config
}
