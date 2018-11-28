import path from 'path'
import glob from 'common/services/glob'
import * as CommonPaths from 'common/constants/paths'
import { Paths } from '../constants'

const CONFIG_FILE = 'index.js'

module.exports = function (plop) {
  const templates = [
    ...createGenerators(Paths.BUILTIN_TEMPLATES),
    ...createGenerators(Paths.TEMPLATES)
  ].filter(([name]) => name !== 'project')

  templates.forEach(([name, config]) => {
    plop.setGenerator(name, config)
  })
}

function createGenerators (templatesPath) {
  return findTemplates(templatesPath).map(configPath => createConfig(configPath, templatesPath))
}

function findTemplates (templatesPath = Paths.TEMPLATES) {
  return glob.find(`*/${CONFIG_FILE}`, {
    cwd: templatesPath
  })
}

function createConfig (configPath, templatesPath = Paths.TEMPLATES) {
  const name = configPath.split('/')[0]
  const templatePath = path.join(templatesPath, name, Paths.TEMPLATE_DIR)
  const {prompts, destination, ...config} = require(path.join(templatesPath, configPath))

  if (!destination) {
    throw new Error('Generator\'s destination should be defined.')
  }

  return [name, {
    prompts: prompts && prompts.map(prompt => ({
      type: 'input',
      ...prompt
    })),
    actions: [
      {
        skipIfExists: true,
        type: 'addMany',
        base: templatePath,
        destination: resolveDestination(destination),
        templateFiles: [`${templatePath}/**`]
      }
    ],
    ...config
  }]
}

function resolveDestination (destination) {
  const [starts] = destination.match(/^\W+/) || [null]

  switch (starts) {
    case '/': {
      return path.join(CommonPaths.PROJECT, destination)
    }
    case './': {
      return path.join(CommonPaths.CWD, destination)
    }
    default: {
      return path.join(CommonPaths.SOURCE, destination)
    }
  }
}

Object.assign(module.exports, {
  CONFIG_FILE,
  createConfig,
  findTemplates,
  resolveDestination
})
