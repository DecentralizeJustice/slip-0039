
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
const idExpLengthWords = bitsToWords(ID_LENGTH_BITS + ITERATION_EXP_LENGTH_BITS)
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
