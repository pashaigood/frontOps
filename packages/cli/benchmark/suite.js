import path from 'path'
import write from 'write'
import Benchmark from 'packages/cli/benchmark/index'
import * as Paths from '../src/common/constants/paths'
import reduce from 'lodash/reduce'
import lowerCase from 'lodash/lowerCase'
import capitalize from 'lodash/capitalize'

const suite = new Benchmark.Suite

module.exports = suite

const defaultOptions = {
  defer: true,
  onCycle: function () {
    process.stdout.write('.')
  },
  minSamples: 2
}

suite._add = suite.add
suite.add = function (name, func, options) {
  return suite._add.call(this, name, func, Object.assign({}, defaultOptions, options))
}

suite.addFromParams = function (getAction, {common, ...config}, params = {}) {
  const name = reduce(config, (result, value, key) => {
    result += (result.length !== 0 ? ' and ' : '')
    if (typeof value === 'boolean') {
      result += `${value === false ? 'not ' : ''}${lowerCase(key)}`
    } else {
      result += `${lowerCase(key)} ${value}`
    }

    return result
  }, '').trim()
  const action = getAction({...config, ...common})
  const {onStart, onComplete, minSamples} = action

  suite.add(name, action, {onComplete, onStart, minSamples, ...params})
  suite[suite.length - 1].config = config

  return suite
}

suite
// add listeners
  .on('cycle', function (event) {
    process.stdout.write("\n\r")
    console.log(capitalize(String(event.target)))
  })
  .on('complete', function () {
    const fastest = this.filter(b => !b.config.ignore).sort((a, b) => a.hz < b.hz)[0]
    console.log('Fastest is ' + fastest.name)
    applyResult(fastest.config, BENCHMARK_NAME)
    process.exit(0)
  })

function applyResult (config, name) {
  const filePath = path.join(Paths.BENCHMARK_RESULT, BENCHMARK_DIR, name + '.json')
  write.sync(filePath, JSON.stringify(config, null, 2))
}
