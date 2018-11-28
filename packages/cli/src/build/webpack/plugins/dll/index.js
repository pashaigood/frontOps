import webpack from 'webpack'
import config from './webpack.config'

export default (options, cb) => {
  return webpack(config, cb)
}
