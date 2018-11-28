import { startDevelopment } from '../../../../packages/cli/src/commands'

const options = JSON.parse(process.argv[process.argv.length -1])
let isFirst = true
startDevelopment(Object.assign({server: false}, options), (error) => {
  if (error) {
    throw error
  }

  if (isFirst) {
    console.log("build")
    isFirst = false
  }
  else {
    console.log("rebuild")
  }
})
