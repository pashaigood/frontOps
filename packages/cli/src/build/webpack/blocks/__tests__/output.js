import * as utils from 'common/services/utils'
import setOutput from '../setOutput'
import HtmlWebpackPlugin from 'html-webpack-plugin'

describe('webpack/blocks/setOutput', () => {
  let outputConfig
  beforeAll(() => {
    outputConfig = setOutput({development: true})()
  })

  it('should generate output', () => {
    expect(outputConfig.output.filename).toBe('[name]/index.js')
  })

  it('Should contains multiple html outputs.', () => {
    const htmlPlugins = getHtmlPlugins(outputConfig)
    const fileNames = htmlPlugins.reduce((fileNames, plugin) => {
      fileNames.push(plugin.options.filename)
      return fileNames
    }, [])

    expect(fileNames.sort()).toEqual(['./index.html', 'admin.html', 'admin/index.html'].sort())
  })

  it('Should contains provided entry variables.', () => {
    const adminConfig = utils.buildEntriesConfig().admin
    const testWord = adminConfig.entry[1].vars.test
    const htmlPlugins = getHtmlPlugins(outputConfig)
    expect(testWord).toBeDefined()
    expect(htmlPlugins.find(({options}) => options.test === testWord)).toBeDefined()
  })
})

function getHtmlPlugins (outputConfig) {
   return outputConfig.plugins.filter((plugin) => plugin instanceof HtmlWebpackPlugin)
}
