import * as Paths from 'common/constants/paths'
import path from 'path'
import shell from 'shelljs'
import rimraf from 'rimraf'

export default function (options) {
  const exitCode = getPackages(options)
    .map(npmInstall)
    .reduce(function (code, result) {
      return result.exitCode > code ? result.exitCode : code
    }, 0)

  process.exit(exitCode)
}

/**
 *
 * @param options
 * @param {Boolean} options.root
 */
function getPackages (options) {
  let root = []
  if (options.root === true) {
    root = [Paths.CWD]
  }
  return root.concat(getPackageJsonLocations())
}

export function getPackageJsonLocations () {
  return shell.find(Paths.SOURCE)
    .filter(function (fname) {
      return !(fname.indexOf('node_modules') > -1 || fname[0] === '.') &&
        path.basename(fname) === 'package.json'
    })
    .map(function (fname) {
      return path.dirname(fname)
    })
}

export function npmInstall (dir) {
  shell.cd(dir)
  console.log('Installing ' + dir + '/package.json...')
  const result = shell.exec('npm install --production --no-optional')
  console.log('')

  return {
    dirname: dir,
    exitCode: result.code
  }
}

export function remove (options) {
  getPackages(options).forEach(packagePath => {
    rimraf.sync(path.join(packagePath, Paths.MODULES_DIR), {glob: false})
  })
}
