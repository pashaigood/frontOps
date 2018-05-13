import path from 'path'
import resolve from 'resolve'
import findNodeModules from 'find-node-modules'
import promisify from 'promisify-node'
import _rimraf from 'rimraf'
import autoInstall, {AutoInstallerMessageTypes} from '../autoInstall'

const rimraf = promisify(_rimraf)
const debug = false

const installProps = {
  installProps: ['--no-save', '--no-audit', '--no-shrinkwrap', '--ignore-scripts', '--no-package-lock'],
  debug
}

const existingModules = ['lodash.flip', 'lodash.ismap']

describe('utils/autoInstall', () => {
  beforeAll(cleanModules)
  afterAll(cleanModules)

  it('should break execution with unexisting module.', (done) => {
    const installer = autoInstall(
      path.resolve(__dirname, 'autoInstallBroken.mock.js'),
      installProps
    )
    installer.onMessage = message => {
      if (message.type === AutoInstallerMessageTypes.ERROR) {
        done()
      }
    }
  }, debug ? 20000 : 120000)

  it('should install module and rerun.', (done) => {
    const installer = autoInstall(
      path.resolve(__dirname, 'autoInstallSuccess.mock.js'),
      installProps
    )

    let installedModules = []

    installer.onMessage = message => {
      if (message.type === AutoInstallerMessageTypes.ERROR) {
        expect(true).toBeFalsy('Do not expect installing error.')
      }

      if (message.type === AutoInstallerMessageTypes.INSTALL) {
        expect(resolve.sync(message.payload)).toBeTruthy()
        installedModules.push(message.payload)
      }

      if (
        installedModules.length === existingModules.length &&
        message.type === AutoInstallerMessageTypes.RESTART
      ) {
        installer.kill()
        done()
      }
    }
  }, debug ? 40000 : 120000)
})

function cleanModules (done) {
  const modulesPath = path.resolve(__dirname, findNodeModules(__dirname).shift())
  Promise.all(
    existingModules.map(moduleName => {
      const existingModulePath = path.resolve(modulesPath, moduleName)
      return rimraf(existingModulePath)
    })
  ).then(() => done())
}