const utilities = require('../utilities')

const numberOfTest = 32
const pythonName = 'bits_to_bytes.py'
const javaFunc = utilities.slip39.bitsToBytes

async function comparingFunction (pythonOutput, javascriptOutput) {
  const output = (pythonOutput[0] === javascriptOutput)
  return output
}

async function testFunction () {
  const randomInt = await utilities.genInt(0, 255)
  const randomIntOptions = Object.assign({ args: [randomInt] }, utilities.options)
  const pythonOutput = await utilities.runPython(pythonName,
    randomIntOptions)
  const javascriptOutput = await javaFunc(randomInt)
  return comparingFunction(pythonOutput, javascriptOutput)
}

module.exports.runTest = async function () {
  const func = await utilities.runTest(numberOfTest, javaFunc.name, testFunction)
  return func
}
