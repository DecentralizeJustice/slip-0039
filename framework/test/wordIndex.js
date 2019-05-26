const utilities = require('../utilities')
const wordlist = require('../../javascript/wordlist/wordsByIndex')
const numberOfTest = 32
const pythonName = 'word_index.py'
const javaFunc = utilities.slip39.wordIndex

async function comparingFunction (pythonOutput, javascriptOutput) {
  const output = (pythonOutput[0] === javascriptOutput.toString())
  return output
}
async function comparingFunctionError (pythonOutput, javascriptOutput) {
  const firstbit = pythonOutput[0].substring(0, 21) === javascriptOutput.substring(0, 21)
  const output = (firstbit)
  return output
}
async function testFunction () {
  const branch = await utilities.genInt(0, 3)
  let randomWordOptions = { args: [],
    mode: 'text',
    scriptPath: 'python/test' }
  let randomWord
  const randomInt = await utilities.genInt(0, 1023)
  if (branch !== 0) {
    randomWord = wordlist.wordsByIndex[randomInt]
    randomWordOptions.args = [randomWord]
  } else {
    randomWord = randomInt.toString()
    randomWordOptions.args = [randomWord]
  }
  const pythonOutput = await utilities.runPython(pythonName,
    randomWordOptions)
  const javascriptOutput = await javaFunc(randomWord)
  if (javascriptOutput instanceof Error) {
    return comparingFunctionError(pythonOutput, javascriptOutput.message)
  }
  return comparingFunction(pythonOutput, javascriptOutput)
}

module.exports.runTest = async function () {
  const func = await utilities.runTest(numberOfTest, javaFunc.name, testFunction)
  return func
}
