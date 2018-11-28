import path from 'path'
import * as Paths from 'common/constants/paths'
import fastGlob from 'fast-glob'

export default function () {
  const aliases = fastGlob.sync('**/*.js', {
    cwd: Paths.ALIASES,
    bashNative: []
  })

  return {
    resolve: {
      alias: aliases.reduce((alias, pathToAlias) => {
        const name = pathToAlias.split('/').pop().split('.').shift()
        alias[name + '$'] = path.join(Paths.ALIASES, pathToAlias)
        return alias
      }, {
        'applications$': path.resolve(__dirname, 'applications.val.js')
      })
    }
  }
}
