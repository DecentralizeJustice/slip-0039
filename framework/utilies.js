const fs = require('fs')
const util = require('util')
const randomNumber = require('random-number-csprng')
const randNum = util.promisify(randomNumber)
const fsWrite = util.promisify(fs.writeFile)

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
module.exports = { resetEntropyCounts, seedEntropyPool }
