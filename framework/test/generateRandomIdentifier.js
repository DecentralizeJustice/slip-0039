const utilities = require('../utilities')

const numberOfTest = 32

async function test () {
  let passedTest = []
  for (var i = 0; i < numberOfTest; i++) {
    const result = await loop()
    passedTest.push(result)
  }
  const sucess = await utilities.checkPassedTest(passedTest, numberOfTest)
  await utilities.logResult('generateRandomIdentifier', sucess, numberOfTest)
}
async function loop () {
  const oracle = await utilities.python('generate_random_identifier.py',
    utilities.options)
  const javascript = await utilities.slip39.generateRandomIdentifier()
  await utilities.resetEntropyCounts()
  await utilities.seedEntropyPool(2)
  return (oracle[0] === javascript)
}
module.exports = { test }
