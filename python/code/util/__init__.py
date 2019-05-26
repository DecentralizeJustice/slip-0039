import os
RADIX_BITS = 10
RADIX = 2 ** RADIX_BITS
def _load_wordlist():
    with open(os.path.join(os.path.dirname(__file__), "wordlist.txt"), "r") as f:
        wordlist = [word.strip() for word in f]

    if len(wordlist) != RADIX:
        raise ImportError(
            "The wordlist should contain {} words, but it contains {} words.".format(
                RADIX, len(wordlist)
            )
        )

    return wordlist
wordlist = _load_wordlist()
