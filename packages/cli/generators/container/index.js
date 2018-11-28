module.exports = {
  prompts: [
    {
      name: 'appPath',
      message: 'application path'
    },
    {
      name: 'name',
      message: 'New container name'
    }
  ],
  destination: '{{appPath}}/{{name}}'
}
