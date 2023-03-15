/*
SPDX-License-Identifier: MIT
*/
pragma solidity ^0.8.18;

/**
 * Interface that handles a standard method to publish and detect what interfaces a smart contract implements
 */
interface IERC165 {
    function supportsInterface(bytes4 interfaceID) external view returns (bool);
}