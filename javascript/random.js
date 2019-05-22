function randomBytes (byteNum) {
  let byteArray = []
  for (var i = 0; i < byteNum; i++) {
    byteArray.push(2)
  }
  return byteArray
}
module.exports.randomBytes = randomBytes
