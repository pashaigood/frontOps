import suite from '../suite'
import server from './actoins/warmServer/index'
import threadLoader from '../result/development/threadLoader'

const common = {}
suite
  .addFromParams(server, {ignore: true, ...common})
  .addFromParams(server, {happypack: true, ...common})
  .addFromParams(server, {happypack: true, babelCacheDirectory: true, ...common})
  .run()
