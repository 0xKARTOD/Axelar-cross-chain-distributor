# Axelar-cross-chain-distributor

## Deploy 🚀

```
hardhat run scripts/deploy.ts --network <NETWORK>
```

## Run Tests

```basg
foundry test --fork-url https://data-seed-prebsc-1-s1.binance.org:8545/
```
## Usage

### Setup ⛏️

1. Create campaign on `MegaVoteMaster` using `createCampaign(string memory name)`
2. Whitelist the ERC20MegaVote contracts using `addVoteToken(string memory sourceChain, string memory sourceChainAddress)`
    
    Chain names used by Axelar: https://docs.axelar.dev/dev/build/chain-names/testnet

### Vote 📮

In `ERC20MegaVote`, there are two methods:

```solidity
vote(
    uint256 amount, uint256 campaignId,
    string memory destinationChain, string memory masterAddress
) 
```

```solidity
unvote(
    uint256 amount, uint256 campaignId,
    string memory destinationChain, string memory masterAddress
) 
```

To cast `amount` of votes, the contract will lock the same amount of `ERC20MegaVote` tokens.  
Uncasting `amount` of votes will have the tokens be refunded.



