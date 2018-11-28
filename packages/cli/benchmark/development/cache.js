import suite from '../suite'
import server from './actoins/warmServer/index'

const common = {}
suite
  .addFromParams(server, {ignore: true, ...common})
  .addFromParams(server, {babelCacheDirectory: true, ...common})
  .addFromParams(server, {cache: true, ...common})
  .addFromParams(server, {cache: true, babelCacheDirectory: true, ...common})
  .addFromParams(server, {hardSource: true, ...common})
  .addFromParams(server, {hardSource: true, babelCacheDirectory: true, ...common})
  .run()
