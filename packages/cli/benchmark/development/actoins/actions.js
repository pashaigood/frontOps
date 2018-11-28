import fs from 'fs'
import path from 'path'

export default []
  .concat([0, 1, 2, 4, 2, 3, 1, 0].map(name => changeHello.bind(void 0, name)))
  .concat([0, 1, 2, 3, 1, 2, 3, 2, 1, 0].map(name => changeHaveContainer.bind(void 0, name)))

function changeHello (name) {
  fs.writeFileSync(
    path.resolve('test-src/common/services/hello.js'),
    fs.readFileSync(path.resolve(`benchmark/development/mocks/hello/${name}.js`)),
    'utf-8'
  )
}

function changeHaveContainer (name) {
  fs.writeFileSync(
    path.resolve('test-src/common/containers/HaveContainer/HaveContainer.js'),
    fs.readFileSync(path.resolve(`benchmark/development/mocks/HaveContainer/${name}.js`)),
    'utf-8'
  )
}
