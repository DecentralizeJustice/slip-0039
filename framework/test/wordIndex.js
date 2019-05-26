const utilities = require('../utilities')

const numberOfTest = 32
const pythonName = 'word_index.py'
const javaFunc = utilities.slip39.wordIndex

async function comparingFunction (pythonOutput, javascriptOutput) {
  console.log(pythonOutput)
  const output = (pythonOutput[0] === javascriptOutput)
  return output
}

async function testFunction () {
  const randomWord = 'acid'// await utilities.genInt(0, 255)
  const randomIntOptions = Object.assign({ args: [randomWord] }, utilities.options)
  const pythonOutput = await utilities.runPython(pythonName,
    randomIntOptions)
  const javascriptOutput = await javaFunc(randomWord)
  return comparingFunction(pythonOutput, javascriptOutput)
}

module.exports.runTest = async function () {
  const func = await utilities.runTest(numberOfTest, javaFunc.name, testFunction)
  return func
}
