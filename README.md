# Axelar-cross-chain-distributor


## Deployed contracts 🥳

Binance Testnet:
- MegaVoteMaster: 0x577ba39Ad22d49e74c04667A5Cf02030B4402572
- ERC20MegaVote: 0x8317E660AD7e621Ffc31c1652E8d288f540456F5

Avax Testnet:
- MegaVoteMaster: 0x17CA47790e2ec7139fE8F728eE73dc9E35e49CC2
- ERC20MegaVote: 0x4e2ebcee1512888d7ceddb40859462615de5770a

## Usage

### Setup ⛏️

1. Create campaign on `MegaVoteMaster` using `createCampaign(string memory name)`
2. Whitelist the ERC20MegaVote contracts using `addVoteToken(string memory sourceChain, string memory sourceChainAddress)`
    
    Chain names used by Axelar: https://docs.axelar.dev/dev/build/chain-names/testnet

### Get some test tokens (For testing only)

Get tokens from the method `giveMe` in `ERC2MegaVote`

```solidity
function giveMe(uint256 amount)
```

### Vote 📮

In `ERC20MegaVote`, there are two methods:

```solidity
function vote(
    uint256 amount, uint256 campaignId,
    string memory destinationChain, string memory masterAddress
) 
```

```solidity
function unvote(
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

### Batch Send Tokens Cross-chain

`ERC20MegaVote` inherits from `ERC20CrossChain`

The method `transferRemote` can send tokens cross-chain

```solidity
function transferRemote(
    string calldata destinationChain,
    string calldata destinationAddress,
    address[] calldata recipients,
    uint256[] calldata amounts
) public payable {
```

Params:

- `destinationChain`: Chain name of `MegaVoteMaster`

- `destinationAddress`: Address of `MegaVoteMaster`

- `recipients`:  An array of recipients addresses

- `amount`: An array of tokens amount to be sent to each recipients

- `payableAmount` Amount of gas to pay Axelar bridge

### Check Total Votes

View method getVotes in `MegaVoteMaster`.

```solidity
function getVotes(uint256 campaignId)
```

## Deploy Your Own Voting Contracts🚀

```
hardhat run scripts/deploy.ts --network <NETWORK>
```

## Run Tests 🤖

```basg
foundry test --fork-url <CHAIN_RPC_URL>
```
