import * as Paths from 'common/constants/paths'
import { CLIEngine } from 'eslint'
import getFiles from './files'

const cli = new CLIEngine({
  cwd: Paths.CWD
})
const formatter = cli.getFormatter('table')

export default function (options) {
  return getFiles(options).then(lint)
}

/**
 *
 * @param {Array<String>} files
 * @return {String}
 */
export function lint (files) {
  const report = cli.executeOnFiles(files.filter(file => file.endsWith('.js')))

  return report.errorCount || report.warningCount ? formatter(report.results) : ''
}
