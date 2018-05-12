import webpackBlocks from '@webpack-blocks/core'
import Paths from 'constants/Paths'
import loadPlugin from 'services/loadPlugin'

declare type WebpackOptions = {
  entry: string,
  mode?: string
}

export default function (options: WebpackOptions): Object {
  const blocks = getBlocks(options)

  const config = webpackBlocks.createConfig({}, blocks);

  return config
}

function getBlocks (options) {
  const plugins = loadPlugin.fromLocal({
    scope: Paths.PLUGINS
  });

  return Object.keys(plugins).map(name => plugins[name](options));
}