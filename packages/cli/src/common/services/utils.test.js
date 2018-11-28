import path from 'path'
import * as utils from './utils'
import * as paths from '../constants/paths'

describe('common/services/utils', () => {
  describe('getEntities', () => {
    it('should return applications config map', () => {
      expect(utils.buildEntriesConfig()).toEqual({
        admin: {
          name: 'admin',
          output: 'admin',
          path: paths.SOURCE + '/admin',
          prerender: true,
          entry: [
            'admin.html',
            {
              filename: 'admin/index.html',
              vars: {
                test: 'Hello world'
              }
            }
          ]
        },
        filesystem: {
          name: 'filesystem',
          alias: 'main',
          output: '.',
          path: paths.SOURCE + '/filesystem'
        }
      })
    })

    it('should return list of entities', () => {
      expect(utils.getEntries()).toEqual([
        'admin',
        'filesystem'
      ])
    })
  })

  describe('getLayouts', () => {
    it('should get layout list', () => {
      expect(utils.getLayouts().sort().map(clearAbsolutePath)).toEqual([
        'common/layouts/index.jade',
        'common/layouts/index.html',
        'common/layouts/index.pug'
      ].sort())
    })

    it('should get layout in a given folder', () => {
      expect(utils.getLayouts(paths.SOURCE + '/filesystem').map(clearAbsolutePath)).toEqual([
        'filesystem/index.html'
      ])
    })
  })

  describe('getDefaultLayout', () => {
    it('should not work if layout not exists', () => {
      expect(() => utils.getDefaultLayout([])).toThrow()
    })

    it('should prefer pug template to jade and html', () => {
      expect(clearAbsolutePath(utils.getDefaultLayout())).toContain('.pug')
    })

    it('should return jade to html', () => {
      expect(utils.getDefaultLayout(['index.html', 'index.jade'])).toContain('.jade')
    })
  })
})

export function clearAbsolutePath (absolutePath) {
  return absolutePath.replace(process.cwd() + '/' + paths.SOURCE_DIR + '/', '')
}

export function addAbsolutePath (relativePath) {
  return path.join(paths.SOURCE, relativePath)
}
