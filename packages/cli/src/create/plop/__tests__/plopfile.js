import path from 'path'
import plopfile from '../plopfile'
import * as CommonPaths from 'common/constants/paths'
import { Paths } from 'create/constants'
import nodePlop from 'node-plop'

const APP = 'app'
const APP_CONFIG = `${APP}/${plopfile.CONFIG_FILE}`
const CONTAINER = 'container'
const CONTAINER_CONFIG = `${CONTAINER}/${plopfile.CONFIG_FILE}`
const GENERATOR = 'generator'
const GENERATOR_CONFIG = `${GENERATOR}/${plopfile.CONFIG_FILE}`

describe('src/create/plopfile', () => {
  describe('', () => {
    for (let [name, configPath, templatesPath] of [
      ['built-in', APP_CONFIG, Paths.BUILTIN_TEMPLATES],
      ['project', CONTAINER_CONFIG, Paths.TEMPLATES],
    ]) {
      it(`Should find all ${name}'s templates`, () => {
        expect(plopfile.findTemplates(templatesPath)).toContain(configPath)
      })
    }
  })

  it('Should generate plop config', () => {
    for (let [templateName, templateConfig, templatesPath] of [
      [APP, APP_CONFIG, Paths.BUILTIN_TEMPLATES],
      [CONTAINER, CONTAINER_CONFIG, Paths.TEMPLATES]
    ]) {
      const [name, config] = plopfile.createConfig(templateConfig, templatesPath)
      expect(name).toBe(templateName)
      expect(config.prompts.length).toBeGreaterThan(0)
      expect(config.actions.length).toBeGreaterThan(0)
    }
  })

  describe('Destination', () => {
    it('Should resolve root', () => {
      expect(plopfile.resolveDestination('/test')).toBe(CommonPaths.PROJECT + '/test')
    })

    it('Should resolve relative', () => {
      expect(plopfile.resolveDestination('./test')).toBe(CommonPaths.CWD + '/test')
    })

    it('Should resolve src', () => {
      expect(plopfile.resolveDestination('test')).toBe(CommonPaths.SOURCE + '/test')
    })
  })

  describe('Generators registration.', () => {
    const plop = nodePlop(path.join(__dirname, '/../plopfile.js'))

    it('Should register all generators.', () => {
      const generators = plop.getGeneratorList().map(g => g.name)
      for (let generator of [APP, CONTAINER]) {
        expect(generators).toContain(generator)
      }
    })

    it('Should resolve generators\' collision in favor of project', () => {
      const projectAppGeneratorConfig = require(path.join(Paths.TEMPLATES, APP_CONFIG))
      const generatorsDescription = plop.getGeneratorList().map(g => g.description)
      expect(projectAppGeneratorConfig.description).toBeDefined()
      expect(generatorsDescription).toContain(projectAppGeneratorConfig.description)
    })
  })
})
