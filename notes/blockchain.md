# Interacting with the blockchain with Drizzle
We're using [drizzle-react](https://github.com/trufflesuite/drizzle-react) to interact with the blockchain.
This is a replacement for `react-redux`.
* `Provider` is replaced with `DrizzleProvider`, which works the same, except it accepts an `options` parameter.
* `drizzleConnect` works similar to, but not identical to `connect`. The documentation for `drizzle-react` incorrectly states that they have the same api, but `drizzleConnect` accepts `(someComponent, mapStateToProps, mapDispatchToProps)` as its arguments.

### Drizzle options
[See the docs](https://github.com/trufflesuite/drizzle#options).

For drizzle, we must specify
- a fallback web3 provider, in case none is injected by the browser
- which contracts should be loaded.
- which ethereum events drizzle should monitor

The contracts can either be Truffle artifacts, which are plain-old JSON objects, or Web3 Contract objects. [See the docs](https://github.com/trufflesuite/drizzle/tree/8f30cc9eac0f5d604346499e3450d916919c3e5d#contracts-array).
We will typically use Truffle artifacts, meaning we'll need to add contract compilation to the build process.

When the app loads, the `drizzleStatusSaga` runs, hopefully updating the store's `drizzleStatus.initialized` from `false` to `true`.
This requires the following three actions to succeed:
1. A Web3 object must be initialized, connected to an Ethereum network.
    - In development, we'll likely use a local network provided by ganache or ganache-cli.
    - By default, drizzle looks for an injected web3 instance, which is typically provided by metamask or mist running in your browser.
    - There is a [breaking change](https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8) in metamask to be release on Nov. 2, which will force us to change the web3 injection process.
2. TODO: addresses
3. TODO: contracts
    - In the case where we use truffle artifacts, we need to ensure that the `networks` attribute contains an entry for the network connected to web3 in step 1. The contract, of course, should be deployed at the address specified by this `networks` entry, like below:
    ```
      "networks": {
        "network_id": {
          "events": {},
          "links": {
            "linkedContract1Name": "0xlinkedContract1Address",
            "linkedContract2Name": "0xlinkedContract2Address",
            ...
          },
          "address": "0xcontractAddress",
          "transactionHash": "0xtxHash"
        },
        ...
      }
    ```
    Deploying the contracts with `truffle migrate` ensures the network field is correctly set.

After initialization, we can use drizzle to call contract functions.
Here is [an example](https://github.com/truffle-box/drizzle-box/blob/e31a10027bd4f8da92ee6d35638e169150366730/src/layouts/home/Home.js#L36-L40), using helper components from `drizzle-react-components`.


# TODO
- [ ] Figure out how `react-scripts-ts build` works, ie. have a transpiled app available in `build/dist` or `lib` or wherever.
- [ ] Add contract compilation to build process.
  - [ ] Contract artifacts should be copied into `src/contracts`
- [ ] Add contract migration to build process.
- [ ] Sort out events, and add to the above doc
- [ ] Get truffle configuration working.