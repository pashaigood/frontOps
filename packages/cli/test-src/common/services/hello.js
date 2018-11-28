import assert from 'assert'
const helloElement = document.createElement('div')
helloElement.innerHTML = 'hello!'
document.body.appendChild(helloElement)

// json-test
const packageJson = require('../package.json')
assert.equal(packageJson.name, 'filesystem')

let envCode = ''
// strip code test
/* production-code */
envCode = 'production'
/* end-production-code */

/* develop-code */
envCode = 'development'
/* end-develop-code */

if (__DEV__) {
  assert.equal(envCode, 'development')
}

// ng-annotate test
function ngInject ($scope) {
  'ngInject'
}

/**
 * @ngInject
 */
function ngInject2 ($scope) {
}
if (__DEV__) {
  assert.equal(ngInject.$inject, void 0)
  assert.equal(ngInject2.$inject, void 0)
} else {
  assert.deepEqual(ngInject.$inject, ['$scope'])
  assert.deepEqual(ngInject2.$inject, ['$scope'])
}

// ui-kit
const uiKit = require('core/components/ui-kit')
assert.ok(uiKit.test)
uiKit.test()

// sass test
require('../layouts/index.scss')

// css test
require('../layouts/index.css')

// common node_modules and moment locales
const moment = require('moment')
require('moment/locale/ru')
moment().locale('ru')
console.log(moment().format('MMMM Do YYYY, h:mm:ss a'))

// react with prop types
const React = require('react')
assert.ok(React.PropTypes)

// html
require('filesystem/index.html')

class Test {
  static prop = 1
  props = 1
}
const test = new Test()
assert.equal(test.props, 1)
assert.equal(Test.prop, 1)

const apps = require('answer')
assert.equal(apps, 42)

const applications = require('applications').default
assert.deepEqual(Object.keys(applications).sort(), ['admin', 'filesystem'].sort())
