module.exports = {
  description: 'App generator from project',
  prompts: [
    {
      name: 'name',
      message: 'New application name'
    }
  ],
  destination: '{{dashCase name}}'
}
