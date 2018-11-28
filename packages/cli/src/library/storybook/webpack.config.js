import webpack from 'webpack'
import * as blocks from 'build/webpack/blocks'
import {createConfig} from '@webpack-blocks/webpack2'
process.noDeprecation = true
process.env.NODE_ENV = 'development'

const options = {noFilter: true}

const GLOBALS = {
  __DEV__: true,
  __TEST__: false
}

module.exports = (storybookBaseConfig, configType) => {
  const customConfig = createConfig.vanilla([
    blocks.assets,
    blocks.scripts(options),
    blocks.styles(options),
    blocks.resolveModules,
    blocks.loaderResolve,
    blocks.alias
  ])

  storybookBaseConfig.module = customConfig.module
  storybookBaseConfig.resolve = customConfig.resolve
  storybookBaseConfig.resolve.extensions = storybookBaseConfig.resolve.extensions.reduce((expressions, expression) => {

    if (expression === '/index.js') {
      return expressions
      // expressions.push('/lib/index.js'/*, '/dist/index.js'*/)
    }
    expressions.push(expression)
    return expressions
  }, [])
  storybookBaseConfig.resolveLoader = customConfig.resolveLoader

  storybookBaseConfig.plugins.filter(plugin => {
    if (plugin instanceof webpack.DefinePlugin) {
      Object.assign(
        plugin.definitions,
        GLOBALS
      )
      return true
    }

    return false
  })

  return storybookBaseConfig
}
