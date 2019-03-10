/**
 *
 * @param name
 * @return {*}
 */
export default name => {
  const selectors = state => {
    const root = getState(state, name)
    return {
      state: () => root,
      list: list.bind(null, root),
      pagination: pagination.bind(null, root),
      filter: filter.bind(null, root),
      element: element.bind(null, root)
    }
  }

  selectors.state = state => ({ ...selectors(state).state() })

  return selectors
}

export function getState (state, name) {
  return state[name]
}

/**
 *
 * @param {InitialState} state
 * @return {Immutable.List}
 */
export function list (state) {
  return state.getList()
}

/**
 *
 * @param {InitialState} state
 * @return {*}
 */
export function pagination (state) {
  return state.pagination
}

/**
 *
 * @param {InitialState} state
 * @return {*}
 */
export function filter (state) {
  return state.filter
}

/**
 *
 * @param {Immutable.List} state
 * @param id
 * @return {Immutable.Map}
 */
export function element (state, id) {
  const _list = list(state)
  return _list.getIn([
    findIndexById(_list, id)
  ])
}

/**
 *
 * @param {Immutable.List} list
 * @param id
 * @return {number}
 */
export function findIndexById (list, id) {
  return list.findIndex(element => element.get('id') === id)
}

/**
 *
 * @param {Immutable.List}  list
 * @param id
 * @return {Immutable.Map}
 */
export function findById (list, id) {
  return list.find(element => element.get('id') === id)
}
