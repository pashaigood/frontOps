import * as blocks from '../index'
import * as paths from 'common/constants/paths'

describe('webpack/blocks', () => {
  describe('entryPoint', () => {
    it('should return all entries list.', () => {
      checkApps(['admin', '.'])
    })

    it('should return only selected application.', () => {
      checkApps(['.'], {
        application: 'filesystem'
      })
    })
  })
})

function checkApps (apps, entryPoint) {
  const entries = blocks.entryPoint(entryPoint)().entry
  expect(Object.keys(entries)).toEqual(apps)

  Object.keys(entries).forEach(key => {
    const entry = entries[key]
    const app = key === '.' ? 'filesystem' : key
    expect(entry).toContain(paths.SOURCE + `/${app}`)
  })
}
