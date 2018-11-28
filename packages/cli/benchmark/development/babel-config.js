import suite from '../suite'
import server from './actoins/warmServer/index'
import createCombinations from './helpers/createCombinations'


const common = {
  babelCacheDirectory: true,
  babelBrowser: true,
  babelIgnoreModules: true
}

const combinations = createCombinations({
    // babelCacheDirectory: createCombinations.BOOL,
    babelTransformRuntime: createCombinations.BOOL,
    // babelBrowser: createCombinations.BOOL,
    // babelIgnoreModules: createCombinations.BOOL
  }
)

combinations.forEach(combination => {
  suite.addFromParams(server, {...combination, ...common})
})

suite.run()

