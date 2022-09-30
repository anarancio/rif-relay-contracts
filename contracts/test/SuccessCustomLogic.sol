// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/cryptography/ECDSA.sol";
import "../interfaces/IForwarder.sol";
import "../interfaces/IWalletCustomLogic.sol";
import "../utils/RSKAddrValidator.sol";

/* solhint-disable avoid-low-level-calls, no-unused-vars */

/**
 * Example custom logic which always succeed
 */
contract SuccessCustomLogic is IWalletCustomLogic {
    using ECDSA for bytes32;

    event LogicCalled();
    event InitCalled();

    function initialize(bytes memory initParams) public override {
        emit InitCalled();
    }

    function execute(
        bytes32 suffixData,
        IForwarder.ForwardRequest memory req,
        bytes calldata sig
    ) external payable override returns (bytes memory ret) {
        emit LogicCalled();
        ret = "success";
    }

    function directExecute(address to, bytes calldata data)
        external
        payable
        override
        returns (bytes memory ret)
    {
        emit LogicCalled();
        ret = "success";
    }
}
