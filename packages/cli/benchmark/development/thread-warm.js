import suite from '../suite'
import server from './actoins/warmServer/index'
import threadLoader from '../result/development/threadLoader'
import happypack from '../result/development/happypack'

const common = {}

suite
  .addFromParams(server, {noThreads: true, common})
  .addFromParams(server, {...happypack, common})
  .addFromParams(server, {...threadLoader, common})
  .run()
