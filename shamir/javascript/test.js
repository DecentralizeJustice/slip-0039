const emModule = require('./output.js')

const jsRun = function () {
  let shamirInterpolate =
    emModule.cwrap('shamirInterpolate', 'array', ['array', 'array', 'array', 'array', 'array', 'number'])
  let interprolate = shamirInterpolate([])

  console.log(interprolate)
}

global.js_run = jsRun
