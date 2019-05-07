const fs = require('fs')
const textByLine = fs.readFileSync('wordlist.txt').toString().split('\n')
let data = {}
for (var i = 0; i < 1024; i++) {
  data[textByLine[i]] = i
}
function callback (err) {
  if (err) throw err
  console.log('complete')
}
fs.writeFile('indexByWords.json', JSON.stringify(data, null, 2), 'utf8', callback)
