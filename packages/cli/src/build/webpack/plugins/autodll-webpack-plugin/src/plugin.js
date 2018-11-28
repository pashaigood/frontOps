import path from 'path'
import webpack, { DllReferencePlugin } from 'webpack'
import flatMap from 'lodash/flatMap'
import isEmpty from 'lodash/isEmpty'
import { RawSource } from 'webpack-sources'

import { cacheDir, getManifestPath, getInjectPath } from './paths'
import { concat, keys, merge } from './utils/index.js'
import createCompileIfNeeded from './createCompileIfNeeded'
import createConfig from './createConfig'
import createMemory from './createMemory'
import createSettings from './createSettings'
import getInstanceIndex from './getInstanceIndex'
import createHandleStats from './createHandleStats'

function AutoDLLPlugin (settings) {
  this._originalSettings = settings
}

AutoDLLPlugin.prototype.apply = function (compiler) {
  const settings = createSettings({
    originalSettings: this._originalSettings,
    index: getInstanceIndex(compiler.options.plugins, this),
    parentConfig: compiler.options,
  })

  const log = () => {}
  const dllConfig = createConfig(settings, compiler.options)
  const compileIfNeeded = createCompileIfNeeded(log, settings)

  const memory = createMemory()
  const handleStats = createHandleStats(log, settings.hash, memory)

  if (isEmpty(dllConfig.entry)) {
    // there's nothing to do.
    return
  }

  const {context, inject} = settings

  keys(dllConfig.entry)
    .map(getManifestPath(settings.hash))
    .forEach(manifestPath => {
      new DllReferencePlugin({
        context: context,
        manifest: manifestPath
      }).apply(compiler)
    })

  compiler.plugin('before-compile', (params, callback) => {
    params.compilationDependencies = params.compilationDependencies.filter(
      path => !path.startsWith(cacheDir)
    )

    callback()
  })

  let firstTime = true

  compiler.plugin(['run', 'watch-run'], (_compiler, callback) => {
    if (firstTime) {
      firstTime = false
      compileIfNeeded(() => webpack(dllConfig))
        .then(handleStats)
        .then(({source, stats}) => {
          if (source === 'memory') return
          return memory.sync(settings.hash, stats)
        })
        .then(() => callback())
        .catch(console.error)
    } else {
      callback()
    }
  })

  if (inject) {
    compiler.plugin('compilation', compilation => {
      addAssets(compilation)

      compilation.plugin(
        'html-webpack-plugin-before-html-generation',
        (htmlPluginData, callback) => {
          htmlPluginData.assets.js = getAssets(htmlPluginData)
          callback(null, htmlPluginData)
        }
      )
    })
  }

  function addAssets (compilation) {
    const dllAssets = getMemoryAssets()

    compilation.assets = merge(compilation.assets, dllAssets)
  }

  function getMemoryAssets () {
    if (!getMemoryAssets.cache) {
      getMemoryAssets.cache = memory.getAssets().reduce((assets, {filename, buffer}) => {
        const assetPath = path.join(settings.path, filename)

        assets[assetPath] = new RawSource(buffer)
        return assets
      }, {})
    }

    return getMemoryAssets.cache
  }

  function getAssets (htmlPluginData) {
    if (!getAssets.cache[htmlPluginData.outputName]) {
      const dllEntriesPaths = flatMap(memory.getStats().entrypoints, 'assets').map(filename =>
        getInjectPath({
          publicPath: settings.publicPath,
          pluginPath: settings.path,
          filename
        })
      )
      getAssets.cache[htmlPluginData.outputName] = concat(dllEntriesPaths, htmlPluginData.assets.js)
    }

    return getAssets.cache[htmlPluginData.outputName]
  }

  getAssets.cache = {}
}

export default AutoDLLPlugin
