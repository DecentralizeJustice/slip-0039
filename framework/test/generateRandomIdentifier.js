const utilities = require('../utilities')
const slip39 = require('../../javascript/slip39')
const numberOfTest = 32
const entropyBitsNeeded = 2
const javascriptName = 'generateRandomIdentifier'
const pythonName = 'generate_random_identifier.py'

async function runTest (entropyBitsNeeded, pythonName, func) {
  let passedTest = []
  for (var i = 0; i < numberOfTest; i++) {
    const result = await loopWithEntropy(entropyBitsNeeded, pythonName, func)
    passedTest.push(result)
  }
  const sucess = await utilities.checkPassedTest(passedTest, numberOfTest)
  await utilities.logResult(javascriptName, sucess, numberOfTest)
}

async function loopWithEntropy (neededBits, pythName, func) {
  await utilities.seedEntropyPool(neededBits)
  await utilities.resetEntropyCounts()
  const oracle = await utilities.python(pythName,
    utilities.options)
  const javascript = await func()
  await utilities.resetEntropyCounts()
  return (oracle[0] === javascript)
}

module.exports.runTest = async function () {
  const func = await runTest(entropyBitsNeeded, pythonName, slip39.generateRandomIdentifier)
  return func
}
