import * as Env from 'common/constants/Env'
import * as utils from 'common/services/utils'
import program, { collectOptions } from '../program'

export default program
  .command('test <application>')
  .option('--watch', 'Watch mode')
  .description('Start unit test.')
  .action((application, command) => {
    command.application = application
    startTest(collectOptions(command))
  })

export function startTest (options = {}, cb = () => {}) {
  process.env.NODE_ENV = Env.TEST
  options.development = true
  if (utils.isBlob(options.application) || utils.isJsFile(options.application)) {
    options.blob = options.application
  }
  options.application = utils.convertAppPathToName(options.application)

  return require('./karma/index').default(options, cb)
}
