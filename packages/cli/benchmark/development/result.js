import suite from '../suite'
import server from './actoins/warmServer/index'
import resultConfig from '../result/development/index'

console.log(resultConfig)

suite
  .addFromParams(server, {ignore: true, ...resultConfig})
  .run()
