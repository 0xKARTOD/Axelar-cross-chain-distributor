# Axelar-cross-chain-distributor

## Deploy 🚀

```
hardhat run scripts/deploy.ts --network <NETWORK>
```

## Run Tests 🤖

```basg
foundry test --fork-url <CHAIN_RPC_URL>
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

Params:

- `amount`: The amount of vote to cast or uncast, and tokens to be locked or unlocked

- `campaignId`: ID of the campaign to interact with

- `destinationChain`: Chain name of `MegaVoteMaster`. Refer to https://docs.axelar.dev/dev/build/chain-names/testnet

- `masterAddress`: Contract address of `MegaVoteMaster`

To cast `amount` of votes, the contract will lock the same amount of `ERC20MegaVote` tokens.  
Uncasting `amount` of votes will have the tokens be refunded.



