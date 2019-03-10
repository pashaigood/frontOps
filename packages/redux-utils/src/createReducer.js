/**
 * Helper for reducer creations
 * @param {Object<Action, Function>} handlers
 * @param {*} [defaultState] Default reducer state
 * @return {function(*=, *=): *}
 */
export default function createReducer (handlers, defaultState) {
  return function (state = defaultState, action, params) {
    if (handlers[action.type]) {
      state = handlers[action.type](state, action, params) || state
    }
    return state
  }
}
