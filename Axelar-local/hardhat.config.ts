import '@nomiclabs/hardhat-waffle'
import '@nomiclabs/hardhat-etherscan'
import '@nomiclabs/hardhat-web3'
import "hardhat-gas-reporter"
import "solidity-coverage"
import dotenv from "dotenv"

dotenv.config()

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.9",
    settings: {
      evmVersion: process.env.EVM_VERSION || "london",
      optimizer: {
        enabled: true,
        runs: 1000,
        details: {
          peephole: true,
          inliner: true,
          jumpdestRemover: true,
          orderLiterals: true,
          deduplicate: true,
          cse: true,
          constantOptimizer: true,
          yul: true,
          yulDetails: {
            stackAllocation: true,
          },
        },
      },
    },
  },
  paths: {
    sources: "./contracts",
  },
  etherscan: {
    apiKey: {
      goerli: process.env.ETHERSCAN_API_KEY,
      kovan: process.env.ETHERSCAN_API_KEY,
      bscTestnet: process.env.BSCSCAN_API_KEY,
    },
  },
  networks: {
    hardhat: {
      forking: {
        url: 'https://bsc-dataseed.binance.org/',
      },
    },
    bsc_test: {
      url: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
      chainId: 97,
      gasPrice: 11000000000,
      accounts: [process.env.PRIVATE_KEY]
    },
    bsc_main: {
      url: 'https://bsc-dataseed.binance.org/',
      chainId: 56,
      gasPrice: 5000000000,
      accounts: [process.env.PRIVATE_KEY]
    },
    eth_goerli: {
      url: 'https://rpc.goerli.mudit.blog/',
      chainId: 5,
      accounts: [process.env.PRIVATE_KEY]
    },
    eth_main: {
      url: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
      accounts: [process.env.PRIVATE_KEY]
    },
  },
}
