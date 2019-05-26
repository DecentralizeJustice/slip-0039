const utilities = require('../utilities')

const numberOfTest = 32
const entropyBytesNeeded = 2
const pythonName = 'generate_random_identifier.py'
const javaFunc = utilities.slip39.generateRandomIdentifier

async function comparingFunction (pythonOutput, javascriptOutput) {
  return pythonOutput[0] === javascriptOutput
}

async function testFunction () {
  await utilities.seedEntropyPool(entropyBytesNeeded)
  await utilities.resetEntropyCounts()
  const pythonOutput = await utilities.runPython(pythonName,
    utilities.options)
  const javascriptOutput = await javaFunc()
  await utilities.resetEntropyCounts()
  return comparingFunction(pythonOutput, javascriptOutput)
}

module.exports.runTest = async function () {
  const func = await utilities.runTest(numberOfTest, javaFunc.name, testFunction)
  return func
}
