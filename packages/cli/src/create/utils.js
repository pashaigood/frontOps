import { Paths } from './constants'

export function clearGeneratorName (dirtyName) {
  return dirtyName
    .replace(Paths.TEMPLATES_DIR, '')
    .replace(/\//g, '')
    .replace(/\\/g, '')
}
