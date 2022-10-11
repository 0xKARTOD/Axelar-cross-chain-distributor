pragma solidity ^0.8.9;

import "./ERC20CrossChain.sol";

contract ERC20MegaVote is ERC20CrossChain{
    /// @dev Encode in payload to flag as a VOTE action
    /// @dev Encode in payload to flag as an UNVOTE action
    bool ACTION_VOTE = true;
    bool ACTION_UNVOTE = false;

    /// @dev address => (project id => number of votes)
    /// @dev address => votes of the user in each campaign
    mapping(address => mapping(uint256 => uint256)) public userVotes;

    /// @dev Total amount of vote of a project
    /// @dev campaign id => total amount of votes
    mapping(uint256 => uint256) public totalVotes;

    event VoteCasted(address voter, uint256 campaignId, uint256 amount);
    event VoteUncasted(address voter, uint256 campaignId, uint256 amount);

    constructor(
        string memory name_,
        string memory symbol_,
        address gateway_,
        address gasReceiver_
    ) ERC20CrossChain(name_, symbol_, gateway_, gasReceiver_){
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
    ) public payable {
        address voter = _msgSender();
        totalVotes[campaignId] += amount;
        userVotes[voter][campaignId] += amount;
        burn(amount);

        bytes memory payload = abi.encode(campaignId, amount, ACTION_VOTE);
        sendGas(destinationChain, payload);
        gateway.callContract(destinationChain, masterAddress, payload);
        emit VoteCasted(voter, campaignId, amount);
    }

    /**
      @notice Unvote from a campaign
      @param amount Amount of votes to withdraw
      @param campaignId Id of the campaign
      @param destinationChain Destination chain of the master contract that counts all votes
      @param masterAddress Address of the master contract that counts all votes
     */
    function unvote(
        uint256 amount,
        uint256 campaignId,
        string memory destinationChain,
        string memory masterAddress
    ) public payable {
        address voter = _msgSender();
        require(userVotes[voter][campaignId] >= amount, "Exceed withdrawal limit");
        // require(transferFrom(address(this), voter, amount), "Transfer failed");
        totalVotes[campaignId] -= amount;
        userVotes[voter][campaignId] -= amount;
        mint(voter, amount);

        bytes memory payload = abi.encode(campaignId, amount, ACTION_UNVOTE);
        sendGas(destinationChain, payload);
        gateway.callContract(destinationChain, masterAddress, payload);
        emit VoteUncasted(voter, campaignId, amount);
    }
}