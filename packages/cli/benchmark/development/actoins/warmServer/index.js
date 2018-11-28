import actions from '../actions'
import clear from '../clear'
import startServer from './start'

export default function server (options) {
  let server
  let index = 0
  let deferred
  let isCold = 0
  // let timestamp = Date.now()

  action.onStart = () => {
    clear()
    server = startServer(Object.assign({server: false}, options), (command) => {
      // const currentTimestamp = Date.now()

      deferred.resolve()

      // Skip build and cold rebuild.
      if (isCold < 2) {
        deferred.benchmark.reset()
        isCold++
      } else {
        // process.stdout.write(`${currentTimestamp - timestamp}ms.`)
        process.stdout.write('.')
      }
      // timestamp = currentTimestamp
    })
  }

  action.onComplete = () => {
    server.kill()
  }

  action.minSamples = actions.length

  function action (_deferred) {
    if (index >= actions.length) {
      index = 0
    }

    deferred = _deferred
    actions[index++]()
  }

  return action
}
