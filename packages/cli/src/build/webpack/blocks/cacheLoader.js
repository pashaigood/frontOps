import findCacheDir from 'find-cache-dir'

const RequiredExpression = [
  '.js',
  '.css',
  '.scss'
]

export default (options) => {
  return Object.assign(
    () => ({}),
    {
      post (context, config) {
        const rules = config.module.rules.filter(rule => RequiredExpression.find(rule.test.test.bind(rule.test)))
        rules.forEach(rule => {
          rule.use.unshift({
            loader: 'cache-loader',
            options: {
              cacheDirectory: findCacheDir({name: 'cache-loader'})
            }
          })
        })
      }
    }
  )
}