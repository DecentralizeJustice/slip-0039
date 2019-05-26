const bitsToBytes = require('./test/bitsToBytes')
const bitsToWords = require('./test/bitsToWords')
const generateRandomIdentifier = require('./test/generateRandomIdentifier')
const wordIndex = require('./test/wordIndex')
async function main () {
  if (process.argv.indexOf('-loop') !== -1) {
    while (true) {
      await loopFunc()
    }
  } else {
    loopFunc()
  }
}
async function loopFunc () {
  await bitsToBytes.runTest()
  await bitsToWords.runTest()
  await generateRandomIdentifier.runTest()
  await wordIndex.runTest()
}
main()
