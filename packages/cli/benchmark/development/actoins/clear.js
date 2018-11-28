import path from 'path'
import findCacheDir from 'find-cache-dir'
import rimraf from 'rimraf'
import * as Paths from '../../../src/common/constants/paths'

export default function () {
  rimraf.sync(Paths.TMP)
  rimraf.sync(Paths.OUTPUT)
  // rimraf.sync(findCacheDir({name: 'autodll-webpack-plugin'}))
  // rimraf.sync(findCacheDir({name: 'hard-source'}))
  // rimraf.sync(findCacheDir({name: 'cache-loader'}))
  // rimraf.sync(findCacheDir({name: 'babel-loader'}))
  rimraf.sync(path.join(Paths.MODULES_DBS, '.cache'))
}