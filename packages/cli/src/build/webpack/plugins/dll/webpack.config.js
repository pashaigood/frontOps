import path from 'path'
import webpack from 'webpack'
import * as Paths from 'common/constants/paths'
import resolveModules from '../../blocks/resolveModules'
import findCacheDir from 'find-cache-dir'

export default {
  ...resolveModules(),

  output: {
    filename: getDllName('[name]'),
    path: getCachePath(),

    // The name of the global constiable which the library's
    // require() function will be assigned to
    library: '[name]_dll'
  },

  plugins: [
    new webpack.DllPlugin({
      // The path to the manifest file which maps between
      // modules included in a bundle and the internal IDs
      context: Paths.CWD,
      // within that bundle
      path: getManifestPath('[name]'),
      // The name of the global constiable which the library's
      // require function has been assigned to. This must match the
      // output.library option above
      name: '[name]_dll'
    })
  ]
}

function getCachePath () {
  return findCacheDir({name: 'injectDll'})
}

export function getDllPath (name) {
  return path.join(getCachePath(), getDllName(name))
}

function getDllName (name) {
  return `${name}.dll.js`
}

export function getManifestPath (name) {
  return path.join(getCachePath(), `${name}-manifest.json`)
}
