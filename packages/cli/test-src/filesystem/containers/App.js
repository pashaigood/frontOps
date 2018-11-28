import React from 'react'
import HaveContainer from 'common/containers/HaveContainer'
import {Provider} from 'react-redux'
import stores from 'common/stores'

export default class App extends React.Component {
  render () {
    return (
      <Provider store={stores()}>
        <HaveContainer/>
      </Provider>
    )
  }
}
