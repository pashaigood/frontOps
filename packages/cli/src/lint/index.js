import scripts from './scripts'

export default function (options) {
  scripts(options).then((result) => {
    process.stdout.write(result)
  })
}
