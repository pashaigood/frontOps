import * as Paths from 'common/constants/paths'

const git = require('jest-changed-files/build/git').default

export default function getFiles (options) {
  const gitPromises = [Paths.CWD].map(function (repo) {
    return (
      git.findChangedFiles(repo, options))
  })

  return Promise.all(gitPromises).then(files => {
    return Array.from(
      files.reduce(function (allFiles, changedFilesInTheRepo) {
        for (const file of changedFilesInTheRepo) {
          allFiles.add(file)
        }

        return allFiles
      }, new Set())
    )
  })
}
