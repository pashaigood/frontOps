import suite from '../suite'
import server from './actoins/warmServer/index'

const common = {}
suite
  .addFromParams(server, {polyfills: true, ...common})
  .addFromParams(server, {polyfills: false, ...common})
  .run()
