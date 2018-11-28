import path from 'path'
import * as paths from 'common/constants/paths'
import alias from '../alias/index'

describe('webpack/blocks/alias', () => {
  it('should create alias for all items in path.', () => {
    expect(alias()).toEqual({
      resolve: {
        alias: {
          'react$': path.join(paths.ALIASES, 'react.js'),
          'answer$': path.join(paths.ALIASES, 'answer.val.js'),
          'applications$': path.resolve(__dirname, '../alias/applications.val.js')
        }
      }
    })
  })
})
