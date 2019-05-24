const fs = require('fs')
const util = require('util')
const fsRead = util.promisify(fs.readFile)
const fsWrite = util.promisify(fs.writeFile)

async function getJsonEntropy () {
  const test = await fsRead('./framework/entropyPool.json', 'utf8')
  const data = await JSON.parse(test)
  return data.entropy
}
async function getEntropyCount () {
  const test = await fsRead('./javascript/usedEntropy.json', 'utf8')
  const data = await JSON.parse(test)
  return data.count
}
async function updateEntropyCount (newCount) {
  const newCountObject = { 'count': newCount }
  await fsWrite('./javascript/usedEntropy.json', JSON.stringify(newCountObject))
}

async function randomBytes (byteNum) {
  const bytes = await getJsonEntropy()
  let byteArray = []
  for (var i = 0; i < byteNum; i++) {
    const count = await getEntropyCount()
    await updateEntropyCount(count + 1)
    byteArray.push(bytes[count])
  }
  return byteArray
}
module.exports.randomBytes = randomBytes
