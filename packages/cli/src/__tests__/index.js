import { getOptions } from '../program'
import commander from 'commander'

const program = commander.command('program')
const command = commander.command('command')
program.option('--4321')
command.option('--1234')

describe('index', () => {
  it('Should collection options.', () => {
    expect(getOptions(command, program)).toEqual(['4321', '1234'])
  })
})
