/*
SPDX-License-Identifier: MIT
*/
pragma solidity ^0.8.18;

import "./IBEP721.sol";
import "./IERC165.sol";

contract Selector {
  /**
   * Uses the selector function to get the interface ERC165's id.
   * 
   * @return - Bytes4 `0x01ffc9a7` that is the interface ERC165's id
   */
  function calcIERC165InterfaceId() external pure returns (bytes4) {
    IERC165 i;
    return i.supportsInterface.selector;
  }

  /**
   * Calculates the interface IBEP721's id by using the XOR method on each function of the interface.
   *
   * @return - Bytes4 `0x80ac58cd` that is the interface IBEP721's id
   */
  function calcIBEP721InterfaceId() external pure returns (bytes4) {
    return 
        bytes4(keccak256('balanceOf(address)')) ^
        bytes4(keccak256('ownerOf(uint256)')) ^
        bytes4(keccak256('approve(address,uint256)')) ^
        bytes4(keccak256('getApproved(uint256)')) ^
        bytes4(keccak256('setApprovalForAll(address,bool)')) ^
        bytes4(keccak256('isApprovedForAll(address,address)')) ^
        bytes4(keccak256('transferFrom(address,address,uint256)')) ^
        bytes4(keccak256('safeTransferFrom(address,address,uint256)')) ^
        bytes4(keccak256('safeTransferFrom(address,address,uint256,bytes)'));
  }
}