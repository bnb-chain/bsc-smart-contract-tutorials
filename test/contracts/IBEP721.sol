/*
SPDX-License-Identifier: MIT
*/
pragma solidity ^0.8.18;

import "./IERC165.sol";

interface IBEP721 is IERC165 {
    function balanceOf(address owner) external view returns (uint balance);
    function ownerOf(uint tokenId) external view returns (address owner);

    function safeTransferFrom(address from, address to, uint tokenId) external;
    function safeTransferFrom(address from, address to, uint tokenId, bytes calldata data) external;
    function transferFrom(address from, address to, uint tokenId) external;

    function approve(address to, uint tokenId) external;
    function setApprovalForAll(address operator, bool _approved) external;
    function getApproved(uint tokenId) external view returns (address operator);
    function isApprovedForAll(address owner, address operator) external view returns (bool);
}

interface IBEP721Receiver {
    function onBEP721Received(address operator, address from, uint tokenId, bytes calldata data) external returns (bytes4);
}