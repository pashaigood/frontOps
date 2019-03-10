import createActionTypes from './createActionTypes'
import createSelectors from './createSelectors'
import createActions from './createActions'
import createReducer from './createReducer'

/**
 *
 * @param {string} name
 */
export default name => {
  const reducer = createReducer(name)
  reducer.key = name
  reducer.actions = createActions(name)
  reducer.actionTypes = createActionTypes(name)
  reducer.selectors = createSelectors(name)
  reducer.getState = reducer.selectors.state
  return reducer
}
