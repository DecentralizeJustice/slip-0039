# Slip-0039 for Javascript
The goal of this library is to act as a testing bed for an implementation of [slip--0039](https://github.com/satoshilabs/slips/blob/master/slip-0039.md) in javascript.
## Disclaimer

This Project is under development and will be for a while. Do not trust any secrets with code in this repo currently.

<!-- ## Run Demo Website

In order to run the code in this repo you need to download the repo and start a dev server via:

```
yarn serve
``` -->

## Background
Shamir Secret sharing is the best way to store crypto but it is not standardized. [Satoshilabs](https://satoshilabs.com/) created a standard for Shamir secret sharing to split mnemonics. It is currently being implemented in [micropython and c](https://github.com/trezor/trezor-firmware/pull/85) for their hardware wallets. This implementation only works with on hardware and in python environments. SSS is so great that everyone and everyone platform should have. I decided to implement slip-0039 in javascript.

## Design Methods
Satoshilabs implementation relies on a edited version of Daan Sprenkels [SSS](https://github.com/trezor/trezor-firmware/blob/ccb169e39e97cd65ceb851ad49e57a108f6ec460/crypto/shamir.c) library. For a javascript implementation we can use this c file and compile it to javascript using [emscripten](https://github.com/emscripten-core/emscripten). This core library saves a lot of time and also reduces the amount of new code we need to write. The wrapper functions around this file can be rewritten based upon the micropython implementation. We will also make a command line tool that runs the python code along with the javascript version and checks for differences. 
