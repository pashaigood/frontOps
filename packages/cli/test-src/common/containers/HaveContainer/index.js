import {reducer} from 'common/stores'
import * as reducers from './reducers/index'
import {connect} from 'react-redux'
import HaveContainer from './HaveContainer'

Object.assign(reducer, reducers)

export default connect(state => ({
  todos: state.todos
}), {})(HaveContainer)
