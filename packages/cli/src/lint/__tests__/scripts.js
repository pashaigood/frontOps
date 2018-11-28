import path from 'path'
import {lint} from '../scripts'

describe('lint/scripts', () => {
  it('should lint correct file', () => {
    expect(lint([path.resolve(__dirname, '../mocks/correct.js')])).toEqual('')
  })

  it('should lint incorrect file', () => {
    expect(lint([path.resolve(__dirname, '../mocks/incorrect.js')])).toContain('2 Errors')
  })
})
