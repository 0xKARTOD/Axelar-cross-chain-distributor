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
        (uint256 campaignId, uint256 amount) = abi.decode(payload_, (uint256, uint256));
        campaigns[campaignId].totalVotes += amount;
    }
}