import path from 'path'
import * as Paths from 'common/constants/paths'

const pathToStoryBook = path.join(Paths.CWD, 'storybook.js')

export default () => ({
  code: `import '${pathToStoryBook}'`
})
