import suite from '../suite'
import server from './actoins/warmServer/index'

const common = {}

suite
  .addFromParams(server, {autoPrefetch: true, ...common})
  .addFromParams(server, {autoPrefetch: false, ...common})
  .run()
