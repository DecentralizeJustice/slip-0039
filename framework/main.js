const test0 = require('./test/test0')
async function main () {
  for (var i = 0; i < 100; i++) {
    const result = await test0.test()
    console.log(result)
  }
}
main()
