import path from 'path'
import child_process from 'child_process'

export default function run (options, cb) {
  const server = child_process.fork(path.join(__dirname, 'server.js'), [JSON.stringify(options)], {silent: true})

  server.stdout.on('data', (data) => {
    const message = data.toString().trim()
    switch (message) {
      case 'build':
      case 'rebuild':
        cb(message)
        break
    }
  })

  return server
}

process.on('SIGINT', cleanExit) // catch ctrl-c
process.on('SIGTERM', cleanExit) // catch kill

function cleanExit () { process.exit() }

