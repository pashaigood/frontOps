import suite from '../suite'
import server from './actoins/warmServer/index'

const common = {}

suite
  // .addFromParams(server, {devtool: 'eval', ...common})
  .addFromParams(server, {devtool: 'cheap-eval-source-map', ...common})
  .addFromParams(server, {devtool: 'cheap-source-map', ...common})
  .addFromParams(server, {devtool: 'cheap-module-eval-source-map', ...common})
  .addFromParams(server, {devtool: 'cheap-module-source-map', ...common})
  .addFromParams(server, {devtool: 'eval-source-map', ...common})
  .addFromParams(server, {devtool: 'source-map', ...common})
  .run()
