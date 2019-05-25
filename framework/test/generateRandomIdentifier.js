const utilities = require('../utilities')

const numberOfTest = 32
const entropyBytesNeeded = 2
const pythonName = 'generate_random_identifier.py'
async function compareFunction (pythonOutput, javascriptOutput) {
  return pythonOutput[0] === javascriptOutput
}
module.exports.runTest = async function () {
  const func = await utilities.runTest(entropyBytesNeeded, numberOfTest, pythonName,
    utilities.slip39.generateRandomIdentifier, compareFunction)
  return func
}
