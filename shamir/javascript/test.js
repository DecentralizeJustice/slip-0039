const em_module = require('./output.js')

const js_run = function () {
  let a = em_module.cwrap('a', 'number', ['number'])
  console.log(a(12))
}

global.js_run = js_run
