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

    function genVote(
        uint256 amount,
        uint256 campaignId,
        string memory destinationChain,
        string memory masterAddress
    ) public returns (bytes memory payload) {
        address voter = _msgSender();
        require(userVotes[voter][campaignId] + amount <= balanceOf(voter), "Votes exceed voting power");
        userVotes[voter][campaignId] += amount;
        bytes memory payload = abi.encode(campaignId, amount);
        return payload;
    }
}