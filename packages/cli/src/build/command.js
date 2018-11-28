import * as Env from 'common/constants/Env'
import clear from 'common/services/clear'
import program, { collectOptions } from '../program'
import * as utils from 'common/services/utils'

export default program
  .command('build')
  .option('--uncompress', 'build uncompressed version')
  .option('--number <value>', 'build number')
  .option('-az, --analyzer', 'analize bundle')
  .description('Build production version.')
  .action((command) => {
    startBuild(collectOptions(command))
  })

export function startBuild (options = {}) {
  process.env.NODE_ENV = options.development !== true ? Env.PRODUCTION : Env.DEVELOPMENT
  clear()
  utils.applyBenchmarkTo(options, Env.PRODUCTION)
  return require('./webpack/index').default(options)
}
