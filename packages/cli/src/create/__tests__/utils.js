import * as utils from '../utils'

describe('create/utils', () => {
  it('Should clean generator name', () => {
    expect(utils.clearGeneratorName('generators/application')).toEqual('application')
    expect(utils.clearGeneratorName('generators/application/')).toEqual('application')
    expect(utils.clearGeneratorName('generators\\application')).toEqual('application')
  })
})
