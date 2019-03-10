import { createReducer } from '@frontops/redux-utils'
import InitialState from './InitialState'
import crateActionTypes from './createActionTypes'
import { findIndexById } from './createSelectors'

export default name => {
  const ActionTypes = crateActionTypes(name)

  return createReducer({
    [ActionTypes.LIST]: list,
    [ActionTypes.READ]: read,
    [ActionTypes.CREATE]: create,
    [ActionTypes.UPDATE]: update,
    [ActionTypes.REMOVE]: remove
  }, new InitialState())
}

/**
 *
 * @param {InitialState} state
 * @param action
 * @return {InitialState}
 */
function list (state, action) {
  state = state.read(null)
  return state.setList(action.payload)
}

/**
 *
 * @param {InitialState} state
 * @param action
 * @return {InitialState}
 */
function read (state, action) {
  return state.read(action.id)
}

/**
 *
 * @param {InitialState} state
 * @param action
 * @return {InitialState}
 */
function create (state, action) {
  return state.setList((state.getList() || []).concat(action.payload))
}

/**
 *
 * @param {InitialState} state
 * @param id
 * @param payload
 * @return {InitialState}
 */
function update (state, id, payload) {
  const _list = state.getList()
  return state.setList(
    _list.updateIn(
      [findIndexById(_list, id)],
      element => element.merge(payload)
    )
  )
}

/**
 *
 * @param {InitialState} state
 * @param id
 * @return {InitialState}
 */
function remove (state, id) {
  const _list = state.getList()
  return state.setList(
    _list.delete(
      findIndexById(_list, id)
    )
  )
}
