import * as Env from './common/constants/Env'
import program, { collectOptions, getOptions } from './program'
import './create/command'
import './build/command'
import development, { startDevelopment } from './develop/command'
import './library/command'
import './test/command'
import './install/command'

if (process.env.NODE_ENV !== Env.TEST) {
  program.parse(process.argv)
} else {
  exports.collectOptions = collectOptions
  exports.getOptions = getOptions
}

if (process.env.NODE_ENV !== Env.TEST && !program.args.find(arg => arg instanceof program.Command)) {
  program.application = program.args[0]
  development.allowUnknownOption(true)
  development.parse(process.argv)
  startDevelopment(collectOptions(development))
}
