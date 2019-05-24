const fs = require('fs')
const util = require('util')
// const fsRead = util.promisify(fs.readFile)
const fsWrite = util.promisify(fs.writeFile)

async function resetEntropyCounts () {
  const zeroCountObject = { 'count': 0 }
  await fsWrite('javascript/usedEntropy.json', JSON.stringify(zeroCountObject))
}

module.exports = { resetEntropyCounts }
