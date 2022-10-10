// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.9;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "./mocks/MockERC20MegaVote.sol";
import "./mocks/MockMegaVoteMaster.sol";

contract ContractTest is Test {
    using AddressToString for address;

    string internal constant SOURCE_CHAIN = "Binance";
    string internal constant DESTINATION_CHAIN = "Avax";

    MockMegaVoteMaster internal mockMegaVoteMaster;
    MockERC20MegaVote internal mockERC20MegaVote;
    address internal voter = 0x1f1BDFE288a8C9ac31F1f7C70dfEE6c82EDF77f6;
    address internal gatewayAddr = 0x4D147dCb984e6affEEC47e44293DA442580A3Ec0;
    address internal gasServiceAddr = 0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6;

    uint256 internal immutable MINT_AMOUNT = 1000000000000000000;

    constructor() {
        mockMegaVoteMaster = new MockMegaVoteMaster(gatewayAddr);
        mockERC20MegaVote = new MockERC20MegaVote("VOTE", "VOTE", gatewayAddr, gasServiceAddr);
        mockMegaVoteMaster.createCampaign("Test Campaign");
        mockMegaVoteMaster.addVoteToken(SOURCE_CHAIN, address(mockERC20MegaVote).toString());
    }
    function setUp() public {
        mockERC20MegaVote.mint(address(this), MINT_AMOUNT);
    }

    function testExecute() public {
        uint256 votes = 10000;
        console.log(mockERC20MegaVote.balanceOf(address(this)));
        bytes memory payload = mockERC20MegaVote.genVotePayload(votes, 0, DESTINATION_CHAIN, address(mockMegaVoteMaster).toString());
        mockERC20MegaVote.vote(votes, 0, DESTINATION_CHAIN, address(mockMegaVoteMaster).toString());
        mockMegaVoteMaster.execute(SOURCE_CHAIN, address(mockERC20MegaVote).toString(), payload);
        assertEq(mockMegaVoteMaster.getVotes(0), votes);

        payload = mockERC20MegaVote.genUnvotePayload(votes, 0, DESTINATION_CHAIN, address(mockMegaVoteMaster).toString());
        mockMegaVoteMaster.execute(SOURCE_CHAIN, address(mockERC20MegaVote).toString(), payload);
        assertEq(mockMegaVoteMaster.getVotes(0), 0);
    }

    function testVoteUnVote() public {
        mockERC20MegaVote.vote(MINT_AMOUNT, 0, DESTINATION_CHAIN, address(mockMegaVoteMaster).toString());
    }

    function testUnvote() public {
        mockERC20MegaVote.vote(MINT_AMOUNT, 0, DESTINATION_CHAIN, address(mockMegaVoteMaster).toString());
        mockERC20MegaVote.unvote(MINT_AMOUNT, 0, DESTINATION_CHAIN, address(mockMegaVoteMaster).toString());
    }

    function testTransfer() public {
        uint256 sendAmount = 10000;
        address[] memory addresses = new address[](10);
        addresses[0] = address(this);
        uint256[] memory amounts = new uint256[](10);
        amounts[0] = sendAmount;
        mockERC20MegaVote.transferRemote(DESTINATION_CHAIN, address(0).toString(), addresses, amounts);
        assertEq(mockERC20MegaVote.balanceOf(address(this)), MINT_AMOUNT - sendAmount);
    }

}
