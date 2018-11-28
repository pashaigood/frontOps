import suite from '../suite'
import server from './actoins/warmServer/index'

const common = {}

suite
  .addFromParams(server, {noDll: true, ...common})
  // .addFromParams(server, {vanillaDll: true, ...common})
  .addFromParams(server, {autoDll: true, ...common})
  .addFromParams(server, {localAutoDll: true, ...common})
  .run()
