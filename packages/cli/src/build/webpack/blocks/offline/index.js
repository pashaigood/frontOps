import path from 'path'
import OfflinePlugin from 'offline-plugin'

export default function (options) {
  function postHook (context, config) {
    const entries = config.entry
    Object.keys(entries).forEach(entry => {
      entries[entry].unshift(path.join(__dirname, 'runtime.js'))
    })
  }

  return Object.assign(
    context => ({
      plugins: [
        new OfflinePlugin({
          externals: [
            '/'
          ],
          ServiceWorker: {
            minify: options.minify !== false,
            navigateFallbackURL: '/'
          },
          AppCache: {
            FALLBACK: {
              '/': '/offline-page.html'
            }
          }
        })
      ]
    }),
    {
      post: postHook
    }
  )
}
