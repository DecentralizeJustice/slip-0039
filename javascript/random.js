const fs = require('fs')
const util = require('util')
const fsRead = util.promisify(fs.readFile)
const fsWrite = util.promisify(fs.writeFile)

async function getJsonEntropy () {
  const test = await fsRead('./framework/entropyPool.json', 'utf8')
  const data = await JSON.parse(test)
  return data.entropy
}
async function getUsedEntropyCount () {
  let test = await fsRead('./javascript/usedEntropy.json', 'utf8')
  let data = await JSON.parse(test)
  return data.count
}
async function updateUsedEntropyCount (newCount) {
  let newCountObject = { 'count': newCount }
  newCountObject = await JSON.stringify(newCountObject)
  await fsWrite('./javascript/usedEntropy.json', newCountObject)
}

async function randomBytes (byteNum) {
  const bytes = await getJsonEntropy()
  let byteArray = []
  for (var i = 0; i < byteNum; i++) {
    let count = await getUsedEntropyCount()
    await updateUsedEntropyCount(count + 1)
    byteArray.push(bytes[count])
  }
  return byteArray
}
module.exports.randomBytes = randomBytes
