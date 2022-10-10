pragma solidity ^0.8.9;

import '../../src/ERC20MegaVote.sol';

contract MockERC20MegaVote is ERC20MegaVote {

    constructor(
        string memory name_,
        string memory symbol_,
        address gateway_,
        address gasReceiver_
    ) ERC20MegaVote(name_, symbol_, gateway_, gasReceiver_) {
    }

    function genVotePayload(
        uint256 amount,
        uint256 campaignId,
        string memory destinationChain,
        string memory masterAddress
    ) public view returns (bytes memory payload) {
        payload = abi.encode(campaignId, amount, ACTION_VOTE);
        return payload;
    }

    function genUnvotePayload(
        uint256 amount,
        uint256 campaignId,
        string memory destinationChain,
        string memory masterAddress
    ) public view returns (bytes memory payload) {
        payload = abi.encode(campaignId, amount, ACTION_UNVOTE);
        return payload;
    }
}