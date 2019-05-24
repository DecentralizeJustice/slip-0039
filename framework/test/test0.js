const { PythonShell } = require('python-shell')
const util = require('util')
const slip39 = require('../../javascript/slip39')
const options = {
  mode: 'json',
  scriptPath: 'python/test'
}

const python = util.promisify(PythonShell.run)

async function test () {
  try {
    const oracle = await python('generate_random_identifier.py', options)
    const javascript = await slip39.generateRandomIdentifier()
    return (oracle[0] === javascript)
  } catch (err) {
    return (err)
  }
  //
}
test()
module.exports = { test }
