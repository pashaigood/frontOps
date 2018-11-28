import * as Env from 'common/constants/Env'
import * as utils from 'common/services/utils'
import clear from 'common/services/clear'
import program, { collectOptions } from '../program'

export default program
  .command('develop [application]')
  .option('--only, --no-pre-build', 'don\'t build all app before start dev server')
  .option('--skip-prerender', 'don\'t do prerender')
  .option('--old-browser, --polyfills', 'enable polyfills for old browser.')
  .alias('dev')
  .alias('all')
  .description('Start development.')
  .action((application, command) => {
    command.application = application
    startDevelopment(collectOptions(command))
  })

program
  .command('server')
  .description('Just run a server.')
  .action(() => {
    startDevelopment({simple: true, production: true})
  })

/**
 *
 * @param options
 * @param {String} [options.application]
 * @param {String} [options.only]
 * @param {Boolean} [options.simple]
 * @param {Function} cb
 */
export function startDevelopment (options = {}, cb = () => {}) {
  if (options.production !== true) {
    utils.applyBenchmarkTo(options, Env.DEVELOPMENT)
    process.env.NODE_ENV = Env.DEVELOPMENT
    options.development = true
    options.hotReload = !options.polyfills
  } else {
    process.env.NODE_ENV = Env.PRODUCTION
    options.preBuild = false
  }

  const server = require('./server/index').default
  options.application = utils.convertAppPathToName(options.application)

  if (options.application && options.preBuild !== false) {
    clear()
    const {application, ...buildOptions} = options
    buildOptions.skipApplications = [application]
    return require('../build/webpack/index').default(buildOptions, () => server(options, cb))
  } else {
    return server(options, cb)
  }
}
