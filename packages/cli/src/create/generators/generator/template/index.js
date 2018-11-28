// Takes all options from https://plopjs.com/
module.exports = {
  description: '{{description}}',
  prompts: [ // More about prompts: https://github.com/SBoudrias/Inquirer.js/
    {
      name: 'entityName',
      message: 'Type entity name'
    }
  ],
  /**
   * can be one of:
   * sub => $srcRoot/sub
   * /sub => $projectRoot/sub
   * ./sub => $cwdPath/sub
   */
  destination: '...'
}
