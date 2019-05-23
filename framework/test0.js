const { PythonShell } = require('python-shell')
const util = require('util')
const slip39 = require('../javascript/slip39')
const options = {
  mode: 'json',
  scriptPath: 'python/test'
}

const python = util.promisify(PythonShell.run)

async function test () {
  try {
    let oracle = await python('generate_random_identifier.py', options)
    return (oracle[0] === slip39.generateRandomIdentifier())
  } catch (err) {
    return (err)
  }
  //
}

module.exports = { test }
