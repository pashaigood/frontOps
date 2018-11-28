import program from '../program'
import plop from './plop/index'
import * as utils from './utils'

export default program
  .command('create <entity>')
  .allowUnknownOption()
  .description('Create new systems entity.')
  .action((templateName, command) => {
    templateName = utils.clearGeneratorName(templateName)
    plop({templateName})
  })
