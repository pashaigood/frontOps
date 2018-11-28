module.exports = {
  description: 'Create new generator',
  prompts: [
    {
      name: 'name',
      message: 'New generator name'
    },
    {
      name: 'description',
      message: 'Generator description'
    }
  ],
  destination: '/generators/{{name}}'
}
