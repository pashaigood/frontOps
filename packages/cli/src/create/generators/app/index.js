module.exports = {
  description: 'Create new project application',
  prompts: [
    {
      name: 'name',
      message: 'Application name'
    }
  ],
  destination: '{{name}}'
}
