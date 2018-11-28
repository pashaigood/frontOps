import { startDevelopment } from '../../../packages/cli/src/commands'
import actions from './actions'
import clear from './clear'

export default function server (options) {
  return function (deferred) {
    clear()
    let index = 0
    const server = startDevelopment(Object.assign({server: false}, options), (err, stats) => {
      if (err) {
        console.error(err)
      }
      if (index < actions.length) {
        actions[index++]()
      } else {
        deferred.resolve()
        server.close()
      }
    })
  }
}

