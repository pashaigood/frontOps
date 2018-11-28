import program from '../program'

export default program
  .command('library')
  .description('Run widgets library.')
  .action(() => {
    require('./storybook/index').default()
  })
