import Paths from 'constants/Paths'
import loadPlugin from '../loadPlugin'

describe('services/loadPlugin', () => {
  it('Should load local plugins.', () => {
    const plugins = loadPlugin.fromLocal({
      scope: Paths.PLUGINS
    })

    expect(plugins.entry).toBeDefined()
    expect(plugins.entry()).toBeInstanceOf(Function)
  })
})