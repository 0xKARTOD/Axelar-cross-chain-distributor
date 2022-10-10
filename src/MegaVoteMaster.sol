pragma solidity ^0.8.9;

import '@openzeppelin/access/Ownable.sol';
import { AxelarExecutable } from '@axelar-network/axelar-gmp-sdk-solidity/contracts/executables/AxelarExecutable.sol';

contract MegaVoteMaster is AxelarExecutable, Ownable {
    struct Campaign {
        string name;
        uint256 totalVotes;
    }

    /// @dev The next campaign id
    uint256 public nextId = 0;
    /// @dev campaign id => campaign name and total votes
    mapping(uint256 => Campaign) public campaigns;

    /// @dev abi.encode(<sourceChain>, <contractAddress>) => is whitelisted or not
    mapping(bytes => bool) public voteTokens;

    event CampaignCreated(uint256 campaignId, string campaignName);

    constructor(address gateway_) AxelarExecutable(gateway_) {
    }

    function addVoteToken(string memory sourceChain, string memory sourceChainAddress) public onlyOwner {
        voteTokens[abi.encode(sourceChain, sourceChainAddress)] = true;
    }

    function removeVoteToken(string memory sourceChain, string memory sourceChainAddress) public onlyOwner {
        voteTokens[abi.encode(sourceChain, sourceChainAddress)] = false;
    }

    /**
      @notice Create a new campaign with the id equals to nextId
      @param name The name of the campaign
     */
    function createCampaign(string memory name) public {
        campaigns[nextId] = Campaign(name, 0);
        emit CampaignCreated(nextId, name);
        nextId += 1;
    }

    /**
      @notice Get total votes of a campaign to given campaign id
      @param campaignId The id of the campaign
     */
    function getVotes(uint256 campaignId) public view returns (uint256 totalVotes) {
        return campaigns[campaignId].totalVotes;
    }

    /**
      @notice Axelar specific function. Increment or decrement votes to campaigns
      @param sourceChain_ The chain where the voter initialize a vote
      @param sourceAddress_ The contract where the voter initialize a vote
      @param payload_ (uint256 campaign id, uint256 amount of vote)
     */
    function _execute(
        string calldata sourceChain_,
        string calldata sourceAddress_,
        bytes calldata payload_
    ) internal override {
        require(voteTokens[abi.encode(sourceChain_, sourceAddress_)], "Source contract must be whitelisted");
        (uint256 campaignId, uint256 amount, bool isVote) = abi.decode(payload_, (uint256, uint256, bool));
        if (isVote) {
            campaigns[campaignId].totalVotes += amount;
        } else {
            campaigns[campaignId].totalVotes -= amount;
        }
    }
}