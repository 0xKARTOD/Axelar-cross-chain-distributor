// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.9;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "../src/MegaDisperse.sol";
import { AddressToString } from '../lib/axelar-utils/StringAddressUtils.sol';
import { IERC20 } from '../lib/interfaces/IERC20.sol';

contract ContractTest is Test {
    using AddressToString for address;

    MegaDisperse internal megaDisperse;
    address internal idiaAddr = 0x0b15Ddf19D47E6a86A56148fb4aFFFc6929BcB89;
    IERC20 internal idia = IERC20(idiaAddr);
    address internal sender = 0x1f1BDFE288a8C9ac31F1f7C70dfEE6c82EDF77f6;
    address internal recipent = 0x08fAe3885E299c24ff9841478EB946f41023aC69;
    address internal gateWayAddr = 0x4F4495243837681061C4743b74B3eEdf548D56A5;
    address internal gasServiceAddr = 0x2d5d7d31F671F86C782533cc367F14109a082712;

    constructor() {
        megaDisperse = new MegaDisperse(gateWayAddr, gasServiceAddr);
    }
    function setUp() public {
    }

    function testDisperseSimple() public {
        uint256 disperseAmount = 111111;
        uint256[] memory disperseAmountList = new uint256[](1);
        disperseAmountList[0] = disperseAmount;

        string[] memory recipentList = new string[](1);
        recipentList[0] = recipent.toString();
    
        MegaDisperse.SwapInfo memory swapInfo = MegaDisperse.SwapInfo(
            idiaAddr.toString(),
            idiaAddr.toString(),
            "a",
            "a"
        );

        megaDisperse.disperseTokenSimple(
            swapInfo,
            recipentList,
            disperseAmountList,
            0
        );
        // uint256 recipentBalance = recipent.balance;
        // assertEqUint(recipentBalance, disperseAmount);
    }

    receive() external payable {
    }
}
