import path from 'path'
import fastGlob from 'fast-glob'
import * as Paths from '../constants/paths'

const glob = {
  findCommands () {
    console.log(Paths.DBS_LIBS)
    const result = fastGlob.sync([
      '*/command.js'
    ], {
      cwd: Paths.DBS_LIBS
    }).map(commandPath => path.join(Paths.DBS_LIBS, commandPath))
    console.log(result)
  },

  find (paths, _options) {
    const options = {
      cwd: Paths.CWD,
      // TODO: Make null only for mac os
      bashNative: [],
      ignore: [
        `**/${Paths.MODULES_DIR}`
      ]
    }

    if (_options) {
      Object.assign(options, _options)
    }

    return fastGlob.sync(paths, options)
  }
}

export default glob
