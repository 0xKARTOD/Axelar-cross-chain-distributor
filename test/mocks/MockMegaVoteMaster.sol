pragma solidity ^0.8.9;

import "../../src/MegaVoteMaster.sol";

contract MockMegaVoteMaster is MegaVoteMaster {

    constructor(address gateway_) MegaVoteMaster(gateway_) {
    }

    function execute(
        string calldata sourceChain_,
        string calldata sourceAddress_,
        bytes calldata payload_
    ) public {
        require(voteTokens[abi.encode(sourceChain_, sourceAddress_)], "Source contract must be whitelisted");
        (uint256 campaignId, uint256 amount, bool isVote) = abi.decode(payload_, (uint256, uint256, bool));
        if (isVote) {
            campaigns[campaignId].totalVotes += amount;
        } else {
            campaigns[campaignId].totalVotes -= amount;
        }
    }
}