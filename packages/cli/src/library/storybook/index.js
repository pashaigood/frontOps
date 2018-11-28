const path = require('path')
const childProcess = require('child_process')
const {MODULES_DBS} = require('common/constants/paths')

export default (options) => {
  childProcess.fork(path.join(MODULES_DBS, '.bin/start-storybook'), ['-p', 9001, '-c', __dirname])
}
