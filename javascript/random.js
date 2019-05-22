function randomBytes (byteNum) {
  var min = 0
  var max = 255
  var random = Math.floor(Math.random() * (+max - +min)) + +min
  let byteArray = []
  for (var i = 0; i < byteNum; i++) {
    byteArray.push(random)
  }
  return byteArray
}
module.exports.randomBytes = randomBytes
