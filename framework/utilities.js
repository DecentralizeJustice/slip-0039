const fs = require('fs')
const util = require('util')
const randomNumber = require('random-number-csprng')
const randNum = util.promisify(randomNumber)
const fsWrite = util.promisify(fs.writeFile)
const log = console.log
const chalk = require('chalk')
const { PythonShell } = require('python-shell')
const runPython = util.promisify(PythonShell.run)
const slip39 = require('../javascript/slip39')
const options = {
  mode: 'json',
  scriptPath: 'python/test'
}

async function resetEntropyCounts () {
  const zeroCountObject = { 'count': 0 }
  await fsWrite('javascript/usedEntropy.json', JSON.stringify(zeroCountObject))
  await fsWrite('python/code/usedEntropy.json', JSON.stringify(zeroCountObject))
}

async function seedEntropyPool (bits) {
  let bitsArray = []
  for (var i = 0; i < bits; i++) {
    const bit = await randNum(0, 255)
    bitsArray.push(bit)
  }
  const bitsJson = { 'entropy': bitsArray }
  await fsWrite('framework/entropyPool.json', JSON.stringify(bitsJson))
}

async function checkPassedTest (testResultArray, numberOfTest) {
  const arrayElementsTrue = await testResultArray.every(item => item)
  const allTestRan = (testResultArray.length === numberOfTest)
  if (allTestRan & arrayElementsTrue) {
    return true
  } else {
    return false
  }
}

async function logResult (funcName, sucess, numberOfTest) {
  if (sucess) {
    log(`${funcName} ` + chalk.bgGreen('passed') +
      ' all ' + chalk.underline(`${numberOfTest}`) + ' test')
  } else {
    log(`${funcName} ` + chalk.bgRed('failed'))
  }
}

async function loopWithEntropy (neededBits, pythName, javascriptFunc, compareFunction) {
  await seedEntropyPool(neededBits)
  await resetEntropyCounts()
  const pythonOutput = await runPython(pythName,
    options)
  const javascriptOutput = await javascriptFunc()
  await resetEntropyCounts()
  return compareFunction(pythonOutput, javascriptOutput)
}

async function runTest (entropyBytesNeeded, numberOfTest, pythonName,
  javascriptFunc, compareFunction) {
  const javascriptName = javascriptFunc.name
  let passedTest = []
  if (entropyBytesNeeded !== 0) {
    for (var i = 0; i < numberOfTest; i++) {
      const result = await loopWithEntropy(entropyBytesNeeded,
        pythonName, javascriptFunc, compareFunction)
      passedTest.push(result)
    }
  }
  const sucess = await checkPassedTest(passedTest, numberOfTest)
  await logResult(javascriptName, sucess, numberOfTest)
}

async function compareFunction (pythonOutput, javascriptOutput) {
  return pythonOutput[0] === javascriptOutput
}
module.exports = {
  runTest,
  compareFunction,
  slip39 }
