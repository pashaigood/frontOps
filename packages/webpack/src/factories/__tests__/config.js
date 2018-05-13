import config from '../config'

describe('factories/config', () => {
  it('should create config', () => {
    expect(config({})).not.toThrow()
  })
})