import { fromJS, List } from 'immutable'

export default class InitialState {
  filter = fromJS({
    search: ''
  })
  order = null
  resources = null
  pagination = null
  collections = fromJS({
    selected: null
  })
  form = fromJS({
    fields: {},
    errors: {}
  })

  /**
   *
   * @return {Immutable.List}
   */
  getList () {
    return this.resources
  }

  setList (value) {
    const nextState = this.getNextState()
    nextState.resources = new List(value)
    return nextState
  }

  read (id) {
    const nextState = this.getNextState()
    nextState.collections = nextState.collections.setIn(['selected'], id)
    return nextState
  }

  getNextState () {
    const nextState = new InitialState()
    Object.assign(nextState, this)
    return nextState
  }
}
