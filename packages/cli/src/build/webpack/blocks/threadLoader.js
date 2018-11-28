const RequiredExpression = [
  '.js',
  '.css',
  '.scss'
]

export default (options) => Object.assign(
  () => ({}),
  {
    post (context, config) {
      if (options.threadLoaderWarmup) {
        const threadLoader = require('thread-loader')

        threadLoader.warmup({
          name: 'my-pool'
          // pool options, like passed to loader options
          // must match loader options to boot the correct pool
        }, [
          // modules to load
          // can be any module, i. e.
          'babel-loader',
          'strip-code-loader'
        ])
      }

      const threadLoader = {
        loader: 'thread-loader',
        // loaders with equal options will share worker pools
        options: {
          // the number of spawned workers, defaults to number of cpus
          // workers: 2,

          // number of jobs a worker processes in parallel
          // defaults to 20
          workerParallelJobs: 50,

          // additional node.js arguments
          // workerNodeArgs: ['--max-old-space-size', '1024'],

          // timeout for killing the worker processes when idle
          // defaults to 500 (ms)
          // can be set to Infinity for watching builds to keep workers alive
          poolTimeout: 2000,

          // number of jobs the poll distributes to the workers
          // defaults to 200
          // decrease of less efficient but more fair distribution
          // poolParallelJobs: 50,

          // name of the pool
          // can be used to create different pools with elsewise identical options
          name: 'my-pool'
        }
      }

      const rules = config.module.rules.filter(rule => RequiredExpression.find(rule.test.test.bind(rule.test)))
      rules.forEach(rule => rule.use.unshift(threadLoader))
    }
  }
)