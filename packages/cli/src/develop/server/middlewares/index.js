import * as Config from 'common/constants/Config'
import * as utils from 'common/services/utils'
import * as paths from 'common/constants/paths'
import path from 'path'
import fs from 'fs'
export {default as webpackDev} from 'webpack-dev-middleware'
export {default as webpackHot} from 'webpack-hot-middleware'
export {staticGzip as gzip} from 'gzippo'
const history = require('connect-history-api-fallback')
const httpProxyMiddleware = require('http-proxy-middleware')

export function spa () {
  const skipUrl = ['/api', '/export', '/theme']

  return history({
    rewrites: [
      {
        from: /^\/(.*?)\/([^\.]*)$/,
        to: function (context) {
          const app = context.match[1]
          const originUrl = context.match[0]
          let newUrl = (app ? '/' + app : '') + '/index.html'

          if (skipUrl.find(skip => typeof skip === 'string' ? originUrl.indexOf(skip) > -1 : skip.test(originUrl))) {
            return originUrl
          }

          // Check for root url
          // TODO: Remove isFileExists
          if (!isFileExists(newUrl)) {
            newUrl = newUrl.split('/').slice(2).concat('').reverse().join('/')
          }

          // TODO: Remove isFileExists
          return !isFileExists(originUrl)
            ? newUrl
            : originUrl
        }
      }
    ]
  })
}

export function backendProxy () {
  return httpProxyMiddleware(
    function (path, req) {
      const filePath = req.url.split('?')[0]
      // TODO: Remove isFileExists
      // Static file with ajax.
      if (isFileExists(filePath)) {
        return false
      }

      return (
        isAjax(req) ||
        isPost(req) ||
        !isFileExists(filePath)
      )
    },
    {target: utils.getProxyHost(), changeOrigin: Config.CHANGE_ORIGIN, logLevel: 'warn'}
  )
}

function isPost (req) {
  return req.method.toLowerCase() === 'post' || /^multipart\/form-data/.test(req.headers['content-type'])
}

function isFileExists (url) {
  const basePath = paths.OUTPUT //utils.isProduction() ?  : paths.TMP

  return fs.existsSync(path.resolve(basePath + url)) ||
    fs.existsSync(path.resolve(basePath + url + '/index.html'))
}

function isAjax (req) {
  return !!(req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1))
}
