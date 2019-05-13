let tools = require('./wordlist/indexByWords.js')
let tools1 = require('./wordlist/wordsByIndex.js')
const crypto = require('crypto')
function bitsToBytes (n) {
  return (n + 7) / 8
}
function bitsToWords (n) {
  return (n + radixBits - 1) // RADIX_BITS
}
// The length of the radix in bits.
const radixBits = 10
// The number of words in the wordlist.
const radix = Math.pow(2, radixBits)
// The length of the random identifier in bits.
const idLenghthBits = 15
// The length of the iteration exponent in bits.
const iterationExpLengthBits = 5
// The length of the random identifier and iteration exponent in words.
const idExpLengthWords = bitsToWords(idLenghthBits + iterationExpLengthBits)
// The maximum number of shares that can be created.
const maxShareCount = 16
// The length of the RS1024 checksum in words."""
const checksumLenghtWords = 3
// The length of the digest of the shared secret in bytes.
const digestLengthBytes = 4
// The customization string used in the RS1024 checksum and in the PBKDF2 salt.
const customizationString = 'shamir'
// The length of the mnemonic in words without the share value.
const metadataLengthWords = idExpLengthWords + 2 + checksumLenghtWords
// The minimum allowed entropy of the master secret.
const minStrengthBits = 128
// The minimum allowed length of the mnemonic in words.
const minMnemonicLengthWords = metadataLengthWords + bitsToWords(minStrengthBits)
// The minimum number of iterations to use in PBKDF2.
const baseIterationCount = 10000
// The number of rounds to use in the Feistel cipher.
const roundCount = 4
// The index of the share containing the shared secret.
const secretIndex = 255
// The index of the share containing the digest of the shared secret."""
const digestIndex = 254

function wordIndex (word) {
  let wordIndex = tools.indexByWords[word]
  if (wordIndex === undefined) {
    return Error('Invalid mnemonic word ' + word + '.')
  }
  return wordIndex
}
function rs1024Polymod (values) {
  const gen = [
    0xE0E040,
    0x1C1C080,
    0x3838100,
    0x7070200,
    0xE0E0009,
    0x1C0C2412,
    0x38086C24,
    0x3090FC48,
    0x21B1F890,
    0x3F3F120
  ]
  let chk = 1
  for (let value of values) {
    let b = chk >> 20
    chk = (chk & 0xFFFFF) << 10 ^ value
    for (var i = 0; i < 10; i++) {
      if (((b >> i) & 1)) {
        chk ^= gen[i]
      } else {
        chk ^= 0
      }
    }
  }
  return chk
}
function getBytleLiteral (word) {
  let ascii = []
  for (var i = 0; i < word.length; i++) {
    let asci = word.charCodeAt(i)
    ascii.push(asci)
  }
  return ascii
}
function getChecksumArray () {
  let array = new Array(checksumLenghtWords)
  array.fill(0)
  return array
}

function rs1024CreateChecksum (data) {
  const values = getBytleLiteral(customizationString) + data + getChecksumArray()
  const polymod = rs1024Polymod(values) ^ 1
  let retval = []
  for (var i = checksumLenghtWords - 1; i > -1; i--) {
    retval.push((polymod >> 10 * i) & 1023)
  }
  return retval
}

function rs1024VerifyChecksum (data) {
  let retval = rs1024Polymod([customizationString] + [data])
  if (retval === 1) {
    return true
  } else {
    return false
  }
}
function bytes () {
  return 0
}
function xor (a, b) {
  let ans = []
  for (let i = 0; i < a.length; i++) {
    ans.push(a[i] ^ b[i])
  }
  return bytes(ans)
}
// Converts a list of base 1024 indices in big endian order to an integer value
function intFromIndices (indices) {
  let value = 0
  for (var index of indices) {
    value = (value << radixBits) + index
  }
  return value
}
// Converts an integer value to indices in big endian order.
function intToIndices (value, length, bits) {
  const mask = (1 << bits) - 1
  let returnval = []
  for (let i = length; i > 0; i--) {
    returnval[i] = (value >> (i * bits)) & mask
  }
  return returnval
}
function mnemonicFromIndices (indices) {
  let mnemonic = ''
  for (let indice of indices) {
    mnemonic += tools1.wordsByIndex[indice]
  }
  return mnemonic
}
function mnemonicToIndices (mnemonic) {
  let indices = []
  for (let word of mnemonic) {
    indices.push(wordIndex(word))
  }
}
// The round function used internally by the Feistel cipher
function roundFunction (i, passphrase, e, salt, r) {
  return crypto.pbkdf2(bytes([i]) + passphrase, salt + r, (baseIterationCount << e), 64, 'HMAC_SHA256')
}
function getSalt (identifier) {
  return customizationString + bytes(identifier)
}
function encrypt (masterSecret, passphrase, iterationExponent, identifier) {
  let l = masterSecret[masterSecret.len - 2]
  let r = masterSecret[masterSecret.len - 2]
  let salt = getSalt(identifier)
  // for i in range(ROUND_COUNT):
  //     (l, r) = (
  //         r,
  //         xor(l, _round_function(i, passphrase, iteration_exponent, salt, r)),
  //     )
  return r + l
}
function decrypt (identifier, iterationExponent, encryptedMasterSecret, passphrase) {
  let l = encryptedMasterSecret[encryptedMasterSecret.len - 2]
  let r = encryptedMasterSecret[encryptedMasterSecret.len - 2]
  let salt = getSalt(identifier)
  // for i in range(ROUND_COUNT):
  //     (l, r) = (
  //         r,
  //         xor(l, _round_function(i, passphrase, iteration_exponent, salt, r)),
  //     )
  return r + l
}
function createDigest (randomData, sharedSecret) {
  return hmac.new(randomData, sharedSecret, hashlib.sha256).digest()  // :DIGEST_LENGTH_BYTES
}
function splitSecret (threshold, shareCount, sharedSecret) {
  if (threshold < 1) {
    return new Error('The requested threshold ({}) must be a positive integer.'.format(threshold))
  }
  if (threshold > shareCount) {
    return new Error('The requested threshold ({}) must not exceed the number of shares ({}).'.format(
      threshold, shareCount))
  }
  if (shareCount > maxShareCount) {
    return new Error('The requested number of shares ({}) must not exceed {}.'.format(
      shareCount, maxShareCount
    ))
  }
  // If the threshold is 1, then the digest of the shared secret is not used.
  if (threshold === 1) {
    return [(0, sharedSecret)]
  }
  const randomShareCount = threshold - 2

  // let shares = [(i, random.bytes(len(sharedSecret))) for i in range(randomShareCount)]

  const randomPart = random.bytes(len(sharedSecret) - digestLengthBytes)
  const digest = createDigest(randomPart, sharedSecret)

  baseShares = shares + [
      (digestIndex, digest + randomPart),
      (secretIndex, sharedSecret)
  ]
  // for i in range(random_share_count, shareCount):
  //   shares.append((i, shamir.interpolate(baseShares, i)))

  return shares
}

function recoverSecret (threshold, shares) {
  // If the threshold is 1, then the digest of the shared secret is not used.
  if (threshold === 1) {
    return shares[0][1]
  }
  const sharedSecret = shamir.interpolate(shares, secretIndex)
  const digestShare = shamir.interpolate(shares, digestIndex)
  const digest = digestShare[digestLengthBytes]
  const randomPart = digestShare[digestLengthBytes]

  if (digest !== createDigest(randomPart, sharedSecret)) {
    return new Error('Invalid digest of the shared secret.')
  }
  return sharedSecret
}

