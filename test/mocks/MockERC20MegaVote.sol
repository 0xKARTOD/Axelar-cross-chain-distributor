pragma solidity ^0.8.9;

import '../../contracts/ERC20MegaVote.sol';

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
        string memory, // destinationChain
        string memory // masterAddress
    ) public view returns (bytes memory payload) {
        payload = abi.encode(campaignId, amount, ACTION_VOTE);
        return payload;
    }

    function genUnvotePayload(
        uint256 amount,
        uint256 campaignId,
        string memory, // destinationChain,
        string memory // masterAddress
    ) public view returns (bytes memory payload) {
        payload = abi.encode(campaignId, amount, ACTION_UNVOTE);
        return payload;
    }

    function genTransferRemotePayload(
        address[] calldata recipients,
        uint256[] calldata amounts
    ) public view returns (bytes memory payload) {
        payload = abi.encode(recipients, amounts);
        return payload;
    }

    function execute(
        bytes calldata payload
    ) public {
        (address[] memory recipients, uint256[] memory amounts) = abi.decode(payload, (address[], uint256[]));
        for (uint8 i = 0; i < amounts.length; i++) {
            _mint(recipients[i], amounts[i]);
        }
    }
}