import 'core/components/bootstrap.scss'
import 'common/services/hello'
import ReactDOM from 'react-dom'
import React from 'react'
import App from './containers/App'
import { AppContainer } from 'react-hot-loader'
import $ from 'cheerio'

const rootElement = document.createElement('div')
console.log($(rootElement))
document.body.appendChild(rootElement)

render(App)

function render1 (App) {
  ReactDOM.render(
    <App/>,
    rootElement
  )
}

function render (App) {
  ReactDOM.render(
    <AppContainer>
      <App/>
    </AppContainer>,
    rootElement
  )
}

if (module.hot) {
  module.hot.accept('./containers/App', function () {
    console.log('Accepting the updated module!')
    render(App)
  })
}
