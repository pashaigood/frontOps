import program, { collectOptions } from '../program'
import install, { remove } from 'install'

program
  .command('install')
  .description('Install applications\' deps.')
  .option('--root', 'perform root deps.')
  .action((command) => {
    install(collectOptions(command))
  })

program
  .command('uninstall')
  .description('Remove applications\' deps.')
  .option('--root', 'perform root deps.')
  .action((command) => {
    remove(collectOptions(command))
  })

program
  .command('reinstall')
  .description('Reinstall applications\' deps.')
  .option('--root', 'perform root deps.')
  .action((command) => {
    const options = collectOptions(command)
    remove(options)
    install(options)
  })
