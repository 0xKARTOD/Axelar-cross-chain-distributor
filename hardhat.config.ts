import '@nomiclabs/hardhat-waffle'
import '@nomiclabs/hardhat-etherscan'
import '@nomiclabs/hardhat-web3'
import dotenv from 'dotenv'

dotenv.config()

module.exports = {
  solidity: {
    version: '0.8.9',
    settings: {
      optimizer: { enabled: true },
    },
  },
  etherscan: {
    apiKey: {
      bscTestnet: process.env.BSCSCAN_API_KEY,
    },
  },
  networks: {
    bsc_test: {
      url: 'https://data-seed-prebsc-1-s3.binance.org:8545',
      chainId: 97,
      gasPrice: 11000000000,
      accounts: [process.env.PRIVATE_KEY]
    },
    avax_test: {
      url: 'https://api.avax-test.network/ext/bc/C/rpc',
      chainId: 43113,
      accounts: [process.env.PRIVATE_KEY]
    },
  },
}
