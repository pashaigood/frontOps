import path from 'path'
import * as Paths from 'common/constants/paths'

export default () => ({
  resolve: {
    modules: [
      Paths.SOURCE,
      // Required for assets
      path.resolve(Paths.SOURCE, '..'),
      Paths.MODULES_COMMON,
      Paths.MODULES_DIR,
      Paths.MODULES_DBS
    ],
    extensions: ['.js', '/index.js', '.scss', '.html']
  }
})
