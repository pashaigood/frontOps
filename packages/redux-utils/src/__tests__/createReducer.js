import createReducer from '../createReducer'

const ActionTypes = {
  INCREASE: 'i',
  DECREASE: 'd'
}

const increaseAction = {
  type: ActionTypes.INCREASE
}

const decreaseAction = {
  type: ActionTypes.DECREASE
}

describe('createReducer', () => {
  it('should work', () => {
    const value = 10
    const reducer = createReducer({
      [ActionTypes.INCREASE]: state => ++state,
      [ActionTypes.DECREASE]: state => --state
    }, value)

    expect(reducer(value, increaseAction)).toBe(value + 1)
    expect(reducer(value, decreaseAction)).toBe(value - 1)
  })
})
