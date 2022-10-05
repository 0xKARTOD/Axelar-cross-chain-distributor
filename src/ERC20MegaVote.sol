pragma solidity ^0.8.9;

import '@openzeppelin/token/ERC20/presets/ERC20PresetMinterPauser.sol';
import { AxelarExecutable } from '@axelar-network/axelar-gmp-sdk-solidity/contracts/executables/AxelarExecutable.sol';
import { IAxelarGasService } from '@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol';

contract ERC20MegaVote is ERC20PresetMinterPauser, AxelarExecutable {
    IAxelarGasService public immutable gasReceiver;

    /// @dev address => (project id => number of votes)
    /// @dev address => votes of the user in each campaign
    mapping(address => mapping(uint256 => uint256)) public userVotes;

    event VoteCasted(address voter, uint256 campaignId, uint256 amount);
    // event VoteUncasted(address voter, uint256 campaignId, uint256 amount);

    constructor(
        string memory name_,
        string memory symbol_,
        address gateway_,
        address gasReceiver_
    ) ERC20PresetMinterPauser(name_, symbol_) AxelarExecutable(gateway_){
        gasReceiver = IAxelarGasService(gasReceiver_);
    }


    /**
      @notice Vote to a campaign
      @param amount Amount of votes to cast
      @param campaignId Id of the campaign
      @param destinationChain Destination chain of the master contract that counts all votes
      @param masterAddress Address of the master contract that counts all votes
     */
    function vote(
        uint256 amount,
        uint256 campaignId,
        string memory destinationChain,
        string memory masterAddress
    ) public {
        address voter = _msgSender();
        require(userVotes[voter][campaignId] + amount <= balanceOf(voter), "Votes exceed voting power");
        userVotes[voter][campaignId] += amount;
        bytes memory payload = abi.encode(campaignId, amount);
        gateway.callContract(destinationChain, masterAddress, payload);
        emit VoteCasted(voter, campaignId, amount);
    }

    // TODO: implement unvote function
    // function unvote(uint256 amount, uint256 campaignId) public {
    //     address voter = _msgSender()
    //     require(userVotes[voter][campaignId] - amount >= 0, "Negative votes");
    //     userVotes[voter] -= amount;
    //     CampaignMasterContract masterContract = masterContracts[campaignId];
    //     require(masterContract, "Master contract not initialized");
    //     bytes memory payload = abi.encode(campaignId, amount);
    //     callContract(masterContract.destinationChain, masterContract.contractAddress, payload);
    //     emit VoteUncasted(voter, campaignId, amount);
    // }
}