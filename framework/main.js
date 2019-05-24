const test0 = require('./test/test0')
async function main () {
  test0.test().then(result => {
    console.log(result)
  })
}
for (var i = 0; i < 3; i++) {
  main()
}
