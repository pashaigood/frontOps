import fs from 'fs'
import { getRequiredGlob, getWebpackConfig, generateEntriesFrom } from '../karma.conf'

describe('karma/karma.conf', () => {
  it('should generate webpack config.', () => {
    expect(getWebpackConfig({useEntries: false, useOutput: false})).toBeDefined()
  })

  it('should get app tests glob.', () => {
    expect(getRequiredGlob('test-src/filesystem')).toEqual([
      'test-src/filesystem/**/*_spec.js'
    ])
  })

  it('should create entries.', () => {
    const entries = generateEntriesFrom(getRequiredGlob('test-src/filesystem'))
    expect(entries.length).toBeGreaterThan(0)
    entries.forEach(entry => {
      expect(fs.existsSync(entry)).toBeTruthy()
    })
  })
})
