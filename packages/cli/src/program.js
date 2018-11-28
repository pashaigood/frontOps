import program from 'commander'
// import commanderCompletion from 'commander-completion'
const packageData = require('../package.json')

program.name = packageData.name

program
  .option('-a, --application', 'select an application for development')
  .option('-prod, --production', 'production env')
  .option('--dev, --development', 'development env')

program
  .version(packageData.version)
  .description('Datatile build system.')

export default program

export function collectOptions (command) {
  const pick = require('lodash/pick')
  const options = getOptions(command, program)

  return {...pick(program, options), ...pick(command, options)}
}

export function getOptions (command, program) {
  const _camelCase = require('lodash/camelCase')
  let commandOptions = []
  if (command) {
    commandOptions = command.options.map(option => _camelCase(option.name()))
  }

  return program.options.map(option => option.name()).concat(commandOptions)
}