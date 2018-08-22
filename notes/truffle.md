# Build process todo

## Migrations
Migrations need to be js files in the `./migrations` folder.
They 
They should import solidity files like:
`var Migrations = artifacts.require("./Migrations.sol");`

They should export a deploy function like:
```
module.exports = function (deployer) {
  deployer.deploy(State);

  deployer.link(State, RockPaperScissorsState);
  deployer.deploy(RockPaperScissorsState);
  deployer.link(RockPaperScissorsState, RockPaperScissorsGame);
  deployer.link(State, RockPaperScissorsGame);
  deployer.deploy(RockPaperScissorsGame);
}
```

## Contracts
Solidity contracts (`.sol` files) get compiled into JSON artifacts, placed in the `./build/contracts` folder.
They should be moved to `./src/contracts` or something like that.

## Truffle config
Truffle needs a `truffle.js` config file in the directory where you run `truffle`.