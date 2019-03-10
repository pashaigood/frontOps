createMiddleware.INIT = '__INIT'
createMiddleware.BEFORE = '__BEFORE'
createMiddleware.OTHERWISE = '__OTHERWISE'

/**
 * Helper for middleware creation.
 * @param {Object<Action, Function>} behaviors
 * @return {function(*=)}
 */
function createMiddleware (behaviors) {
  return store => {
    behaviors[createMiddleware.INIT] && behaviors[createMiddleware.INIT](store)

    return next => action => {
      if (
        behaviors[createMiddleware.BEFORE]
      ) {
        const result = behaviors[createMiddleware.BEFORE](store, next, action)
        if (result !== void 0) {
          return result
        }
      }

      let type = action.type
      const behavior = behaviors[type] || behaviors[createMiddleware.OTHERWISE]

      if (behavior) {
        const result = behavior(store, next, action)
        if (result !== void 0) {
          return result
        }
      }

      return next(action)
    }
  }
}

export default createMiddleware
