import karma from 'karma'
import path from 'path'
import * as Paths from 'common/constants/paths'

export default function (options, cb) {
  global.optionsTransport = options

  new karma.Server({
    autoWatch: options.watch,
    singleRun: !options.watch,
    basePath: Paths.CWD,
    configFile: path.resolve(__dirname, 'karma.conf.js')
  }).start()
}
