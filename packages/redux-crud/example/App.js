import React, { Component } from 'react'
import { connect } from 'react-redux'
import './App.css'
import posts from './components/posts'

class App extends Component {
  render () {
    return (
      <h1>Works!</h1>
    )
  }
}

export default connect(() => ({}), {})(App)
