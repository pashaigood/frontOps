import { compose, createStore, combineReducers } from 'redux'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export default class {
  constructor () {
    this.reducers = {}
    this.middlewares = []
  }

  /**
   *
   * @param [initialState]
   * @param [reducer] Custom reducer function
   * @return {*}
   */
  get (initialState, reducer, enhancer) {
    if (!this.store) {
      this.create(initialState, reducer, enhancer)
    }
    return this.store
  }

  create (initialState, reducer, enhancer) {
    const composedMiddlewares = composeEnhancers(
      applyMiddleware(this.middlewares)
    )

    this.store = createStore(
      reducer || combineReducers(this.reducers),
      initialState,
      enhancer ? enhancer(composedMiddlewares) : composedMiddlewares
    )
    return this.store
  }

  /**
   *
   * @param {Object<Function>|String} reducers
   * @param [reducerFunction]
   */
  addReducer (reducers, reducerFunction) {
    if (arguments.length === 2) {
      this.reducers[arguments[0]] = arguments[1]
    } else {
      Object.assign(this.reducers, reducers)
    }

    if (this.store) {
      this.store.replaceReducer(combineReducers(this.reducers))
    }
    return reducers
  }

  addMiddleware (newMiddleware) {
    this.middlewares.push(...[].concat(newMiddleware))
  }

  dispatch (...params) {
    return this.store.dispatch(...params)
  }

  getState () {
    return this.store.getState()
  }
}

function applyMiddleware (middlewares) {
  return (createStore) => (reducer, initialState, enhancer) => {
    const store = createStore(reducer, initialState, enhancer)
    let dispatch = store.dispatch

    const middlewareAPI = {
      getState: store.getState,
      dispatch: (action) => dispatch(action)
    }
    dispatch = (action) => compose(
      ...middlewares.map(middleware => middleware(middlewareAPI)))(
      store.dispatch)(action)

    return {
      ...store,
      dispatch
    }
  }
}
