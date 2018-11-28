import suite from '../suite'
import server from './actoins/warmServer/index'

const common = {threadLoader: true}
suite
  .addFromParams(server, {...common})
  .addFromParams(server, {cache: true, ...common})
  .addFromParams(server, {threadLoaderWarmup: true, ...common})
  .addFromParams(server, {cache: true, threadLoaderWarmup: true, ...common})
  .run()
