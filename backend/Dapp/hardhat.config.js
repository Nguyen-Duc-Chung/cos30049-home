require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");


module.exports = {
  // CONNECT TO HARDHAT as Default: 
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337
    },
    // CONNECT TO GANACHE: 
    ganache: {
      url: "http://127.0.0.1:7545", 
      // accounts: [ " 0x... ", ],
      accounts: {
        mnemonic: " blood fantasy april girl glow cat garbage purity fashion hybrid give switch ", 
      },
      chainId: 1337 
    },
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};

// COMMAND TO Connect ganahce network:
//   npx hardhat run ignition/deploy.js --network ganache

// COMMAND TO Connect hardhat network:
//   npx hardhat node
//   npx hardhat run scripts/deploy.js --network localhost


