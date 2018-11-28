import path from 'path'
import { CWD } from 'common/constants/paths'

const TEMPLATES_DIR = 'generators'

export const Paths = {
  TEMPLATES_DIR,
  TEMPLATE_DIR: 'template',
  TEMPLATES: path.join(CWD, TEMPLATES_DIR),
  BUILTIN_TEMPLATES: path.join(__dirname, TEMPLATES_DIR)
}
