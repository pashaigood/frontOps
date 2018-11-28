const webpack = require('../packages/cli/src/webpack').default
const Env = require('../src/common/constants/Env')
const suite = require('./suite')

// add tests
suite
  .add('Compress sync', function (deferred) {
    process.env.NODE_ENV = Env.PRODUCTION
    webpack({development: false, skipPrerender: true, parallel: false}, () => {deferred.resolve()})
  })
  .add('Compress parallel', function (deferred) {
    process.env.NODE_ENV = Env.PRODUCTION
    webpack({development: false, skipPrerender: true}, () => {deferred.resolve()})
  })
  // run async
  .run({'async': true})
