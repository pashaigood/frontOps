import path from 'path'
import { spawn } from 'child_process'
import resolve from 'resolve'
import findNodeModules from 'find-node-modules'
import promisify from 'promisify-node'
import _rimraf from 'rimraf'
import autoInstall, {AutoInstallerMessageTypes} from '../autoInstall'

const rimraf = promisify(_rimraf)
const debug = true

const installProps = {
  installProps: ['--no-save', '--no-audit'],
  debug
}


const existingModule = 'lodash.flip'

describe('utils/autoInstall', () => {
  beforeAll((done) => {
    const existingModulePath = path.resolve(__dirname, findNodeModules(__dirname).shift(), existingModule)
    debug && console.log(existingModulePath)
    rimraf(existingModulePath).then(done)
    /*rimraf(existingModulePath, () => {
      done()
    })*/
  })

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
  }, 120000)

  it('should install module and rerun.', (done) => {
    const installer = autoInstall(
      path.resolve(__dirname, 'autoInstallSuccess.mock.js'),
      installProps
    )

    let installedModules = new Set()

    installer.onMessage = message => {
      if (message.type === AutoInstallerMessageTypes.INSTALL) {
        expect(resolve.sync(existingModule)).toBeTruthy()
        installedModules.add(message.payload)
        done()
      }

      /*if (message.type === AutoInstallerMessageTypes.RESTART && installedModules.length === 2) {
        done()
      }*/
    }
  }, 120000)
})