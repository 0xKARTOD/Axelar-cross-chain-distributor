// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.9;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "./mocks/MockERC20MegaVote.sol";
import "./mocks/MockMegaVoteMaster.sol";
import { AddressToString } from '../lib/axelar-utils/StringAddressUtils.sol';

contract ContractTest is Test {
    using AddressToString for address;

    string internal constant SOURCE_CHAIN = "Binance";
    string internal constant DESTINATION_CHAIN = "Avax";

    MockMegaVoteMaster internal mockMegaVoteMaster;
    MockERC20MegaVote internal mockERC20MegaVote;
    address internal voter = 0x1f1BDFE288a8C9ac31F1f7C70dfEE6c82EDF77f6;
    address internal gatewayAddr = 0x4D147dCb984e6affEEC47e44293DA442580A3Ec0;
    address internal gasServiceAddr = 0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6;

    constructor() {
        mockMegaVoteMaster = new MockMegaVoteMaster(gatewayAddr);
        mockERC20MegaVote = new MockERC20MegaVote("VOTE", "VOTE", gatewayAddr, gasServiceAddr);
        mockMegaVoteMaster.createCampaign("Test Campaign");
        mockMegaVoteMaster.addVoteToken(SOURCE_CHAIN, address(mockERC20MegaVote).toString());
    }
    function setUp() public {
    }

    function testExecute() public {
        uint256 votes = 10000;
        mockERC20MegaVote.mint(address(this), 1000000000000000000);
        console.log(mockERC20MegaVote.balanceOf(address(this)));
        bytes memory payload = mockERC20MegaVote.genVotePayload(votes, 0, DESTINATION_CHAIN, address(mockMegaVoteMaster).toString());
        mockMegaVoteMaster.execute(SOURCE_CHAIN, address(mockERC20MegaVote).toString(), payload);
        assertEq(mockMegaVoteMaster.getVotes(0), votes);

        payload = mockERC20MegaVote.genUnvotePayload(votes, 0, DESTINATION_CHAIN, address(mockMegaVoteMaster).toString());
        mockMegaVoteMaster.execute(SOURCE_CHAIN, address(mockERC20MegaVote).toString(), payload);
        assertEq(mockMegaVoteMaster.getVotes(0), 0);
    }

}
