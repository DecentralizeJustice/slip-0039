# Slip-0039 for Javascript
The goal of this library is to act as a testing bed for an implementation of [slip--0039](https://github.com/satoshilabs/slips/blob/master/slip-0039.md) in javascript.
## Disclaimer

This Project is under development and will be for a while. Do not trust any secrets with code in this repo currently.

### Prerequisites

In order to run the code in this repo you need to download the repo and start a dev server via:

```
yarn serve
```

### Background
Shamir Secret sharing is the best way to store crypto but it is not standardized. [Satoshilabs](https://satoshilabs.com/) created a standard for Shamir secret sharing to split mnemonics. It is currently being implemented in [micropython and c](https://github.com/trezor/trezor-firmware) for their hardware wallets. This implementation only works with on hardware and in python environments. SSS is so great that everyone and everyone platform should have. I decided to implement slip-0039 in javascript.

### Design Methods
