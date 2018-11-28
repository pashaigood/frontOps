import * as Paths from '../constants/paths'
import rimraf from 'rimraf'
import findCacheDir from 'find-cache-dir'

export default function () {
  output()
  tmp()
}

export function output () {
  rimraf.sync(Paths.OUTPUT)
}

export function tmp () {
  rimraf.sync(Paths.TMP)
}

export function cache () {
  rimraf.sync(findCacheDir({cwd: Paths.CWD}))
}
