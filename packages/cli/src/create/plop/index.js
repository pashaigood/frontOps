// import minimist from 'minimist'
import chalk from 'chalk'
import nodePlop from 'node-plop'

export default (options) => {
  // const {_, ...args} = minimist(process.argv)
  const plop = nodePlop(`${__dirname}/plopfile.js`)

  try {
    const generator = plop.getGenerator(options.templateName)
    generator.runPrompts()
      .then(generator.runActions)
      .catch(error => {
        console.log(error)
      })
  } catch (e) {
    console.log(chalk.red('Template not found.'))
  }
}