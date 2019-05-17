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
function groupPrefix (
  identifier, iterationExponent, groupIndex, groupThreshold, groupCount
) {
  const idExpInt = (identifier << iterationExpLengthBits) + iterationExponent
  return (intToIndices(idExpInt, idExpLengthWords, radixBits)) +
        (groupIndex << 6) + ((groupThreshold - 1) << 2) + ((groupCount - 1) >> 2)
}
function encodeMnemonic(
    identifier,
    iteration_exponent,
    group_index,
    group_threshold,
    group_count,
    member_index,
    member_threshold,
    value,
){
    // Converts share data to a share mnemonic.
    // :param int identifier: The random identifier.
    // :param int iteration_exponent: The iteration exponent.
    // :param int group_index: The x coordinate of the group share.
    // :param int group_threshold: The number of group shares needed to reconstruct the encrypted master secret.
    // :param int group_count: The total number of groups in existence.
    // :param int member_index: The x coordinate of the member share in the given group.
    // :param int member_threshold: The number of member shares needed to reconstruct the group share.
    // :param value: The share value representing the y coordinates of the share.
    // :type value: Array of bytes.
    // :return: The share mnemonic.
    // :rtype: Array of bytes.

    // Convert the share value from bytes to wordlist indices.
    const valueWordCount = bits_to_words(len(value) * 8)
    const valueInt = int.from_bytes(value, "big")

    const shareData = (
        groupPrefix(
            identifier, iteration_exponent, group_index, group_threshold, group_count
        )
        + (
            (((group_count - 1) & 3) << 8)
            + (member_index << 4)
            + (member_threshold - 1),
        )
        + tuple(_int_to_indices(value_int, value_word_count, RADIX_BITS))
    )
    const checksum = rs1024_create_checksum(share_data)

    return mnemonic_from_indices(share_data + checksum)
  }


function decodeMnemonic(mnemonic){
    // Converts a share mnemonic to share data

    const mnemonicData = tuple(mnemonicToIndices(mnemonic))

    if (len(mnemonicData) < minMnemonicLengthWords){
        return Error(
            "Invalid mnemonic length. The length of each mnemonic must be at least {} words.".format(
                minMnemonicLengthWords
            )
        )
      }
    const paddingLen = (radixBits * (len(mnemonicData) - METADATA_LENGTH_WORDS)) % 16
    if padding_len > 8:
        raise MnemonicError("Invalid mnemonic length.")

    if not rs1024_verify_checksum(mnemonic_data):
        raise MnemonicError(
            'Invalid mnemonic checksum for "{} ...".'.format(
                " ".join(mnemonic.split()[: ID_EXP_LENGTH_WORDS + 2])
            )
        )

    id_exp_int = _int_from_indices(mnemonic_data[:ID_EXP_LENGTH_WORDS])
    identifier = id_exp_int >> ITERATION_EXP_LENGTH_BITS
    iteration_exponent = id_exp_int & ((1 << ITERATION_EXP_LENGTH_BITS) - 1)
    tmp = _int_from_indices(
        mnemonic_data[ID_EXP_LENGTH_WORDS : ID_EXP_LENGTH_WORDS + 2]
    )
    group_index, group_threshold, group_count, member_index, member_threshold = _int_to_indices(
        tmp, 5, 4
    )
    value_data = mnemonic_data[ID_EXP_LENGTH_WORDS + 2 : -CHECKSUM_LENGTH_WORDS]

    if group_count < group_threshold:
        raise MnemonicError(
            'Invalid mnemonic "{} ...". Group threshold cannot be greater than group count.'.format(
                " ".join(mnemonic.split()[: ID_EXP_LENGTH_WORDS + 2])
            )
        )

    value_byte_count = bits_to_bytes(RADIX_BITS * len(value_data) - padding_len)
    value_int = _int_from_indices(value_data)
    if value_data[0] >= 1 << (RADIX_BITS - padding_len):
        raise MnemonicError(
            'Invalid mnemonic padding for "{} ...".'.format(
                " ".join(mnemonic.split()[: ID_EXP_LENGTH_WORDS + 2])
            )
        )
    value = value_int.to_bytes(value_byte_count, "big")

    return (
        identifier,
        iteration_exponent,
        group_index,
        group_threshold + 1,
        group_count + 1,
        member_index,
        member_threshold + 1,
        value,
    )
}

def _decode_mnemonics(mnemonics):
    identifiers = set()
    iteration_exponents = set()
    group_thresholds = set()
    group_counts = set()
    groups = {}  # { group_index : [member_threshold, set_of_member_shares] }
    for mnemonic in mnemonics:
        identifier, iteration_exponent, group_index, group_threshold, group_count, member_index, member_threshold, share_value = decode_mnemonic(
            mnemonic
        )
        identifiers.add(identifier)
        iteration_exponents.add(iteration_exponent)
        group_thresholds.add(group_threshold)
        group_counts.add(group_count)
        group = groups.setdefault(group_index, [member_threshold, set()])
        if group[0] != member_threshold:
            raise MnemonicError(
                "Invalid set of mnemonics. All mnemonics in a group must have the same member threshold."
            )
        group[1].add((member_index, share_value))

    if len(identifiers) != 1 or len(iteration_exponents) != 1:
        raise MnemonicError(
            "Invalid set of mnemonics. All mnemonics must begin with the same {} words.".format(
                ID_EXP_LENGTH_WORDS
            )
        )

    if len(group_thresholds) != 1:
        raise MnemonicError(
            "Invalid set of mnemonics. All mnemonics must have the same group threshold."
        )

    if len(group_counts) != 1:
        raise MnemonicError(
            "Invalid set of mnemonics. All mnemonics must have the same group count."
        )

    for group_index, group in groups.items():
        if len(set(share[0] for share in group[1])) != len(group[1]):
            raise MnemonicError(
                "Invalid set of shares. Member indices in each group must be unique."
            )

    return (
        identifiers.pop(),
        iteration_exponents.pop(),
        group_thresholds.pop(),
        group_counts.pop(),
        groups,
    )


def _generate_random_identifier():
    """Returns a randomly generated integer in the range 0, ... , 2**ID_LENGTH_BITS - 1."""

    identifier = int.from_bytes(random.bytes(bits_to_bytes(ID_LENGTH_BITS)), "big")
    return identifier & ((1 << ID_LENGTH_BITS) - 1)


def generate_mnemonics(
    group_threshold, groups, master_secret, passphrase=b"", iteration_exponent=0
):
    """
    Splits a master secret into mnemonic shares using Shamir's secret sharing scheme.
    :param int group_threshold: The number of groups required to reconstruct the master secret.
    :param groups: A list of (member_threshold, member_count) pairs for each group, where member_count
        is the number of shares to generate for the group and member_threshold is the number of members required to
        reconstruct the group secret.
    :type groups: List of pairs of integers.
    :param master_secret: The master secret to split.
    :type master_secret: Array of bytes.
    :param passphrase: The passphrase used to encrypt the master secret.
    :type passphrase: Array of bytes.
    :param int iteration_exponent: The iteration exponent.
    :return: List of mnemonics.
    :rtype: List of byte arrays.
    """

    identifier = _generate_random_identifier()
    if len(master_secret) * 8 < MIN_STRENGTH_BITS:
            raise ValueError(
                "The length of the master secret ({} bytes) must be at least {} bytes.".format(
                    len(master_secret), bits_to_bytes(MIN_STRENGTH_BITS)
                )
            )

        if len(master_secret) % 2 != 0:
            raise ValueError(
                "The length of the master secret in bytes must be an even number."
            )

        if not all(32 <= c <= 126 for c in passphrase):
            raise ValueError(
                "The passphrase must contain only printable ASCII characters (code points 32-126)."
            )

        if group_threshold > len(groups):
            raise ValueError(
                "The requested group threshold ({}) must not exceed the number of groups ({}).".format(
                    group_threshold, len(groups)
                )
            )

        if any(
            member_threshold == 1 and member_count > 1
            for member_threshold, member_count in groups
        ):
            raise ValueError(
                "Creating multiple member shares with member threshold 1 is not allowed. Use 1-of-1 member sharing instead."
            )
            encrypted_master_secret = _encrypt(
                    master_secret, passphrase, iteration_exponent, identifier
                )

                group_shares = _split_secret(group_threshold, len(groups), encrypted_master_secret)

                return [
                    [
                        encode_mnemonic(
                            identifier,
                            iteration_exponent,
                            group_index,
                            group_threshold,
                            len(groups),
                            member_index,
                            member_threshold,
                            value,
                        )
                        for member_index, value in _split_secret(
                            member_threshold, member_count, group_secret
                        )
                    ]
                    for (member_threshold, member_count), (group_index, group_secret) in zip(
                        groups, group_shares
                    )
                ]


            def generate_mnemonics_random(
                group_threshold, groups, strength_bits=128, passphrase=b"", iteration_exponent=0
            ):
                """
                Generates a random master secret and splits it into mnemonic shares using Shamir's secret
                sharing scheme.
                :param int group_threshold: The number of groups required to reconstruct the master secret.
                :param groups: A list of (member_threshold, member_count) pairs for each group, where member_count
                    is the number of shares to generate for the group and member_threshold is the number of members required to
                    reconstruct the group secret.
                :type groups: List of pairs of integers.
                :param int strength_bits: The entropy of the randomly generated master secret in bits.
                :param passphrase: The passphrase used to encrypt the master secret.
                :type passphrase: Array of bytes.
                :param int iteration_exponent: The iteration exponent.
                :return: List of mnemonics.
                :rtype: List of byte arrays.
                """

                if strength_bits < MIN_STRENGTH_BITS:
                    raise ValueError(
                        "The requested strength of the master secret ({} bits) must be at least {} bits.".format(
                            strength_bits, MIN_STRENGTH_BITS
                        )
                    )

                if strength_bits % 16 != 0:
                    raise ValueError(
                        "The requested strength of the master secret ({} bits) must be a multiple of 16 bits.".format(
                            strength_bits
                        )
                    )

                return generate_mnemonics(
                    group_threshold,
                    groups,
                    random.bytes(strength_bits // 8),
                    passphrase,
                    iteration_exponent,
                )


            def combine_mnemonics(mnemonics):
                """
                Combines mnemonic shares to obtain the master secret which was previously split using
                Shamir's secret sharing scheme.
                :param mnemonics: List of mnemonics.
                :type mnemonics: List of byte arrays.
                :return: Identifier, iteration exponent, the encrypted master secret.
                :rtype: Integer, integer, array of bytes.
                """

                if not mnemonics:
                    raise MnemonicError("The list of mnemonics is empty.")

                identifier, iteration_exponent, group_threshold, group_count, groups = _decode_mnemonics(
                    mnemonics
                )

                if len(groups) != group_threshold:
                    raise MnemonicError(
                        "Wrong number of mnemonic groups. Expected {} groups, but {} were provided.".format(
                            group_threshold, len(groups)
                        )
                    )

                for group_index, group in groups.items():
                    if len(group[1]) != group[0]:
                        prefix = _group_prefix(
                            identifier,
                            iteration_exponent,
                            group_index,
                            group_threshold,
                            group_count,
                        )
                        raise MnemonicError(
                            'Wrong number of mnemonics. Expected {} mnemonics starting with "{} ...", but {} were provided.'.format(
                                group[0], mnemonic_from_indices(prefix), len(group[1])
                            )
                        )

                group_shares = [
                    (group_index, _recover_secret(group[0], list(group[1])))
                    for group_index, group in groups.items()
                ]

                return (
                    identifier,
                    iteration_exponent,
                    _recover_secret(group_threshold, group_shares),
