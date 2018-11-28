import fs from 'fs'
import path from 'path'
import * as paths from './paths'
/*
import Liftoff from 'liftoff'
export default new Liftoff({
  cwd: paths.CWD,
  name: require.resolve('./package.json').name,
  configName: '.local',
  extensions: {
    'rc': null
  }
})
*/

let localConfig
try {
  localConfig = JSON.parse(fs.readFileSync(path.resolve(paths.CWD, '.local'), 'utf8'))
} catch (e) {
  localConfig = {}
}

export const PROTO = 'http'
export const HOST = 'localhost'
export const PORT = 3000
export const PROXY_PROTO = 'http'
export const PROXY_HOST = HOST
export const PROXY_PORT = 8080
export const CHANGE_ORIGIN = false
export const browsers = ['last 2 versions', 'ie >= 10']

Object.assign(module.exports, localConfig)
