const test0 = require('./test0')
async function main () {
  test0.test().then(result => {
    console.log(result)
  })
}

main()
