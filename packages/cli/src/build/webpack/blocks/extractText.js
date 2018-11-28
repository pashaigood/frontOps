export default function extractText () {
  const Etwp = require('extract-text-webpack-plugin')
  const plugin = new Etwp({
    filename: '[name]/index.css?[chunkhash]',
    allChunks: true
  })

  const postHook = (context, config) => {
    config.module.rules.forEach(
      rule => {
        if (['.css', '.scss'].find(ext => rule.test.test(ext))) {
          const [ fallbackLoaders, nonFallbackLoaders ] = splitFallbackRule([rule])

          rule.use = plugin.extract({
            fallback: fallbackLoaders,
            use: nonFallbackLoaders
          })
        }
      }
    )
  }

  return Object.assign(
    context => ({
      plugins: [
        plugin
      ]
    }),
    {
      post: postHook
    }
  )
}

function splitFallbackRule (rules) {
  const leadingStyleLoaderInAllRules = rules.every(rule => {
    return rule.use.length > 0 && rule.use[0] && (rule.use[0] === 'style-loader' || rule.use[0].loader === 'style-loader')
  })

  if (leadingStyleLoaderInAllRules) {
    const trimmedRules = rules.map(rule => Object.assign({}, rule, { use: rule.use.slice(1) }))
    return [ ['style-loader'], getUseEntriesFromRules(trimmedRules) ]
  } else {
    return [ [], getUseEntriesFromRules(rules) ]
  }
}

function getUseEntriesFromRules (rules) {
  const normalizeUseEntry = use => typeof use === 'string' ? { loader: use } : use

  return rules.reduce(
    (useEntries, rule) => useEntries.concat(rule.use.map(normalizeUseEntry)),
    []
  )
}
