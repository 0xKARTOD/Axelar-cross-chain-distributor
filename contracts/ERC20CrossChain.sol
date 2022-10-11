// SPDX-License-Identifier: MIT
// Reference: https://github.com/axelarnetwork/axelar-local-gmp-examples/blob/main/examples/cross-chain-token/ERC20CrossChain.sol

pragma solidity 0.8.9;

import { IAxelarGateway } from '@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol';
import { IAxelarGasService } from '@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol';
import '@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol';
import { AxelarExecutable } from '@axelar-network/axelar-gmp-sdk-solidity/contracts/executables/AxelarExecutable.sol';
import { Upgradable } from '@axelar-network/axelar-gmp-sdk-solidity/contracts/upgradables/Upgradable.sol';
import { StringToAddress, AddressToString } from '@axelar-network/axelar-gmp-sdk-solidity/contracts/StringAddressUtils.sol';

contract ERC20CrossChain is AxelarExecutable, ERC20PresetMinterPauser {
    using StringToAddress for string;
    using AddressToString for address;

    error AlreadyInitialized();

    event FalseSender(string sourceChain, string sourceAddress);

    IAxelarGasService public gasReceiver;

    constructor(
        string memory name_,
        string memory symbol_,
        address gateway_,
        address gasReceiver_
    ) AxelarExecutable(gateway_) ERC20PresetMinterPauser(name_, symbol_) {
        gasReceiver = IAxelarGasService(gasReceiver_);
        /// @dev Grant the contract a minter role, so that `_execute` can mint
        grantRole(MINTER_ROLE, address(this));
    }

    // This is for testing.
    function giveMe(uint256 amount) external {
        _mint(msg.sender, amount);
    }

    function transferRemote(
        string calldata destinationChain,
        string calldata destinationAddress,
        address[] calldata recipients,
        uint256[] calldata amounts
    ) public payable {
        uint256 total = 0;
        for (uint8 i = 0; i < amounts.length; i++) {
            total += amounts[i];
        }
        _burn(msg.sender, total);
        bytes memory payload = abi.encode(recipients, amounts);
        sendGas(destinationChain, payload);
        gateway.callContract(destinationChain, destinationAddress, payload);
    }

    function sendGas(
        string memory destinationChain,
        bytes memory payload
    ) public payable {
        if (msg.value > 0) {
            gasReceiver.payNativeGasForContractCall{ value: msg.value }(
                address(this),
                destinationChain,
                address(this).toString(),
                payload,
                msg.sender
            );
        }
    }

    function _execute(
        string calldata, /*sourceChain*/
        string calldata, /*sourceAddress*/
        bytes calldata payload
    ) internal override {
        (address[] memory recipients, uint256[] memory amounts) = abi.decode(payload, (address[], uint256[]));
        for (uint8 i = 0; i < amounts.length; i++) {
            _mint(recipients[i], amounts[i]);
        }
    }
}