import webpack from 'webpack'
import chalk from 'chalk'
import webpackConfig from './webpack.config'

export default (options, cb) => {
  compile(webpackConfig(options), cb)
}

function compile (webpackConfig, cb) {
  let webpackCompiler

  // Compile the webpack config
  try {
    console.log(chalk.blue.bold('Start build...'))
    webpackCompiler = webpack(webpackConfig)
  } catch (error) {
    console.error(chalk.red(`Webpack config is invalid\n`, error))
    console.log(error)
    process.exit(1)
  }

  // Handle errors in webpack build
  webpackCompiler.plugin('done', stats => {
    if (stats.hasErrors()) {
      console.error(chalk.red(`Build failed\n`, stats.toString()))
      console.info(chalk.bgMagenta('See webpack error above'))
    } else if (stats.hasWarnings()) {
      console.warn(chalk.yellow(`Build warnings`, stats.toString()))
    } else {
      console.log(chalk.blue.bold('Build finished'))
    }

    if (cb) {
      cb(stats)
    }
  })

  webpackCompiler.run(() => {})
  // Return the compiler
  return webpackCompiler
}
