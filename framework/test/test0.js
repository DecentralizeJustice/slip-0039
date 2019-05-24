const { PythonShell } = require('python-shell')
const util = require('util')
const slip39 = require('../../javascript/slip39')
const utilities = require('../utilies')
const options = {
  mode: 'json',
  scriptPath: 'python/test'
}

const python = util.promisify(PythonShell.run)

async function test (numb) {
  const oracle = await python('generate_random_identifier.py', options)
  const javascript = await slip39.generateRandomIdentifier()
  await utilities.resetEntropyCounts()
  return (oracle[0] === javascript)
  //
}
module.exports = { test }
