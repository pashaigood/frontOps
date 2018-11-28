module.exports = {
  description: 'Create new project',
  prompts: [
    {
      name: 'name',
      message: 'New project name'
    }
  ],
  destination: '{{name}}'
}
