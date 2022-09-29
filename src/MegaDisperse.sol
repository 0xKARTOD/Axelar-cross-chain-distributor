/**
 *Submitted for verification at Etherscan.io on 2018-10-22
*/

pragma solidity ^0.8.9;

import { IAxelarGateway } from '../lib/interfaces/IAxelarGateway.sol';
import { IAxelarGasService } from '../lib/interfaces/IAxelarGasService.sol';
import { IERC20 } from '../../interfaces/IERC20.sol';

contract MegaDisperse {

    IAxelarGateway public gateway;
    IAxelarGasService public gasService;

    struct SwapInfo {
        string srcSymbol;
        string destSymbol;
        string destChain;
        string execAddr;
    }

    constructor(
        address gateway_,
        address gasService_
    ) {
        gateway = IAxelarGateway(gateway_);
        gasService = IAxelarGasService(gasService_);
    }

    function sendToken(
        SwapInfo memory swapInfo,
        string calldata recipient,
        uint256 value,
        uint256 gasFee
    ) internal {
        address tokenX = gateway.tokenAddresses(swapInfo.srcSymbol);
        bytes memory payload = abi.encode(swapInfo.destSymbol, recipient);
        IERC20(tokenX).transferFrom(msg.sender, address(this), value + gasFee);
        IERC20(tokenX).approve(address(gasService), gasFee);

        gasService.payGasForContractCallWithToken(
            address(this),
            swapInfo.destChain,
            swapInfo.execAddr,
            payload,
            swapInfo.srcSymbol,
            value,
            tokenX,
            gasFee,
            msg.sender
        );

        IERC20(tokenX).approve(address(gateway), value);
        gateway.callContractWithToken(swapInfo.destChain, swapInfo.execAddr, payload, swapInfo.srcSymbol, value);
    }

    function disperseEther(address[] calldata recipients, uint256[] calldata values) external payable {
        for (uint256 i = 0; i < recipients.length; i++)
            payable(recipients[i]).transfer(values[i]);
        uint256 balance = address(this).balance;
        if (balance > 0)
            payable(msg.sender).transfer(balance);
    }

    function disperseToken(IERC20 token, address[] calldata recipients, uint256[] calldata values) external {
        uint256 total = 0;
        for (uint256 i = 0; i < recipients.length; i++)
            total += values[i];
        require(token.transferFrom(msg.sender, address(this), total));
        for (uint i = 0; i < recipients.length; i++)
            require(token.transfer(recipients[i], values[i]));
    }

    function disperseTokenSimple(
        SwapInfo memory swapInfo,
        string[] calldata recipients,
        uint256[] calldata values,
        uint256 gasFee
    ) external {
        for (uint256 i = 0; i < recipients.length; i++) {
            sendToken(swapInfo, recipients[i], values[i], gasFee);
        }
    }
}