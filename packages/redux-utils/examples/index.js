import Store from '../src/Store'
import { createReducer, createMiddleware, createType, createAction } from '../src'

const Types = {
  CREATE: createType(module)('CREATE'),
  UPDATE: createType(module)('UPDATE')
}

const reducer = createReducer({
  [Types.CREATE]: create,
  [Types.UPDATE]: update
})

function create (state, action) {}

function update (state, action) {}

const middleware = createMiddleware({
  [createMiddleware.INIT]: () => {},
  [createMiddleware.BEFORE]: () => {},
  [Types.CREATE]: validate,
  [Types.UPDATE]: validate,
  [createMiddleware.OTHERWISE]: () => {}
})

function validate (store, next, action) {
  const isValid = true || false
  if (isValid) {
    return next(action) // or undefined
  } else {
    return false //  to stop flow.
  }
}

const actions = {
  create: createAction(Types.CREATE),
  update: createAction(Types.UPDATE)
}

const store = new Store()

store.addReducer({ reducerName: reducer })
store.addMiddleware(middleware)

store.init()

store.get().dispatch(actions.create())
store.get().getState()
