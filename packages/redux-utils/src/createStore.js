import { compose, createStore, combineReducers } from 'redux'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export default function (reducers = {}, middlewares = [], initialState, enhancer) {
  const hotMiddleware = composeEnhancers(createHotMiddleware(middlewares))

  reducers.meta = () => ({})
  const store = createStore(
    combineReducers(reducers),
    initialState,
    enhancer ? enhancer(hotMiddleware) : hotMiddleware
  )
  store.reducers = reducers
  store.middlewares = middlewares
  store.addReducer = addReducer.bind(store)
  store.addMiddleware = addMiddleware.bind(store)

  return store
}

/**
 *
 * @param {[function]|function} newMiddleware
 */
function addMiddleware (newMiddleware) {
  this.middlewares.push(...[].concat(newMiddleware))
}

/**
 *
 * @param {object} reducers
 */
function addReducer (reducers) {
  Object.assign(this.reducers, reducers)

  this.replaceReducer(combineReducers(this.reducers))
}

function createHotMiddleware (middlewares) {
  return createStore => (reducer, initialState, enhancer) => {
    const store = createStore(reducer, initialState, enhancer)
    let dispatch = store.dispatch

    const middlewareAPI = {
      getState: store.getState,
      dispatch: action => dispatch(action)
    }
    dispatch = action => compose(
      ...middlewares.map(middleware => middleware(middlewareAPI))
    )(store.dispatch)(action)

    return {
      ...store,
      dispatch
    }
  }
}

if (process.env.NODE_ENV === 'test') {
  module.exports.createHotMiddleware = createHotMiddleware
}
