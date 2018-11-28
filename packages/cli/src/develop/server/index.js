import browserSync from 'browser-sync'
import * as Paths from 'common/constants/paths'
import * as Config from 'common/constants/Config'
import * as utils from 'common/services/utils'
import * as middlewares from './middlewares/index'
import webpackConfig from '../../build/webpack/webpack.config'
import webpack from 'webpack'
import queryString from 'query-string'
import chalk from 'chalk'
import WriteFilePlugin from 'write-file-webpack-plugin'

const webpackHotConfig = {
  reload: true
}

export default (options, cb) => {
  return startServer(webpackConfig(options), options, cb)
}

function startServer (webpackConfig, options, cb) {
  options.development && applyDevConfig(webpackConfig, options)
  const bundler = webpack(webpackConfig)

  if (utils.isProduction() && !options.simple) {
    console.log(chalk.blue.bold('Start building...'))
    bundler.run(() => {
      console.log(chalk.blue.bold('Build finished'))
    })
  }

  if (options.server === false) {
    return bundler.watch({}, cb)
  } else {
    const bsConfig = {
      host: Config.HOST,
      port: Config.PORT,
      open: false,
      ghostMode: false,
      server: {
        baseDir: [
          webpackConfig.output.path
        ],
        middleware: [
          middlewares.spa(),
          !options.simple && utils.isDevelopment() && middlewares.webpackDev(bundler, {
            // Dev middleware can't access config, so we provide publicPath
            publicPath: webpackConfig.output.publicPath,

            stats: webpackConfig.stats,

            watchOptions: webpackConfig.watchOptions
          }),
          !options.simple && utils.isDevelopment() && middlewares.webpackHot(bundler),
          middlewares.backendProxy(),
          utils.isProduction() && middlewares.gzip(webpackConfig.output.path)
        ].filter(Boolean),
        files: [
          '**/*.{html,css}',
          'assets/**'
        ]
      }
    }

    browserSync.instance = browserSync.init(bsConfig)
    return browserSync.instance
  }
}

function applyDevConfig (webpackConfig, options) {
  webpackConfig.watchOptions = {
    aggregateTimeout: 100,
    ignored: [
      Paths.OUTPUT,
      Paths.TMP,
      /node_modules/,
      /dll\.js/,
      /manifest\.json/
    ]
      .filter(Boolean)
  }
  webpackConfig.devtool = options.devtool || 'cheap-eval-source-map'
  if (options.hotReload) {
    Object.keys(webpackConfig.entry).forEach(entry => {
      const entryPoint = webpackConfig.entry[entry].pop()
      webpackConfig.entry[entry] = [
        ...webpackConfig.entry[entry],
        'webpack-hot-middleware/client?' + queryString.stringify(webpackHotConfig),
        'react-hot-loader/patch',
        entryPoint
      ]
    })
  }

  webpackConfig.plugins = webpackConfig.plugins.concat([
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.WatchIgnorePlugin(webpackConfig.watchOptions.ignored),
    new WriteFilePlugin({
      exitOnErrors: false,
      log: true,
      // required not to cache removed files
      useHashIndex: false
    })
  ].filter(Boolean))

  webpackConfig.output.publicPath = utils.getPublicHost()
}
