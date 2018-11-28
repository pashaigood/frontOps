const path = require('path')
const fs = require('fs')

const benchmarkPath = path.resolve(process.cwd(), process.argv[process.argv.length - 1])
const benchmarkPathParts = benchmarkPath.split(path.sep)
global.BENCHMARK_NAME = benchmarkPathParts.pop().split('.')[0]
global.BENCHMARK_DIR = benchmarkPathParts.pop()

process.env.Benchmark = true

if (fs.existsSync(benchmarkPath)) {
  require(benchmarkPath)
}
