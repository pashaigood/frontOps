const applications = global.utils.buildEntriesConfig()

module.exports = function () {
  return {
    code: 'export default ' + JSON.stringify(applications)
  }
}
