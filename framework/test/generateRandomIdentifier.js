const utilities = require('../utilities')

const numberOfTest = 32
const entropyBytesNeeded = 2
const pythonName = 'generate_random_identifier.py'

module.exports.runTest = async function () {
  const func = await utilities.runTest(entropyBytesNeeded, numberOfTest, pythonName,
    utilities.slip39.generateRandomIdentifier, utilities.compareFunction)
  return func
}
