import path from 'path'
import createBabel from '../babel'

const babelConfig = createBabel()

describe('/webpack/babel', () => {
  it('should', () => {
    expect(babelConfig.presets).toBeDefined()
    expect(babelConfig.presets.find(isPathCorrectAndExists)).toBeFalsy()

    expect(babelConfig.plugins).toBeDefined()
    expect(babelConfig.plugins.find(isPathCorrectAndExists)).toBeFalsy()

    expect(babelConfig.env).toBeDefined()
    // expect(babel.env.development.presets.find(isPathCorrectAndExists)).toBeFalsy()
    expect(babelConfig.env.development.plugins.find(isPathCorrectAndExists)).toBeFalsy()
    // expect(babel.env.production.plugins.find(isPathCorrectAndExists)).toBeFalsy()
  })
})

function isPathCorrectAndExists (entryPath) {
  if (typeof entryPath !== 'string') {
    entryPath = entryPath[0]
  }

  if (path.isAbsolute(entryPath)) {
    return false
  }
}
