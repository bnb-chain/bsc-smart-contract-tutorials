/*
SPDX-License-Identifier: MIT
*/
pragma solidity ^0.8.18;

import "./IBEP721.sol";

contract NFT is IBEP721 {
    // Event that logs the transfer of a NFT token represented by his id between a sender and a receiver
    event Transfer(address indexed from, address indexed to, uint indexed id);

    // Event that logs the approval from a NFT token's owner for a spender to transfer a specific NFT token
    event Approval(address indexed owner, address indexed spender, uint indexed id);

    // Event that logs the approval from a NFT token's owner for a spender to transfer all his NFT token
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    // Mapping from token ID to owner address
    mapping(uint => address) internal _ownerOf;

    // Mapping owner address to token count
    mapping(address => uint) internal _balanceOf;

    // Mapping from token ID to approved address
    mapping(uint => address) internal _approvals;

    // Mapping from owner to operator approvals
    mapping(address => mapping(address => bool)) public _isApprovedForAll;

    /**
     * Checks whether a specific interface is supported by the smart-contract (Interface IERC165)
     * 
     * @param interfaceId - Hexadecimal number of bytes4 that represents an interface's id
     * @return - Boolean saying if the interface is supported
     */
    function supportsInterface(bytes4 interfaceId) external pure returns (bool) {
        return
            interfaceId == type(IBEP721).interfaceId ||
            interfaceId == type(IERC165).interfaceId;
    }

    /**
     * Checks the NFT token's balance of a user. If the address received is empty, returns an error.
     *
     * @param owner - Address of a user
     * @return - Balance of the user represented by an integer
     */
    function balanceOf(address owner) external view returns (uint) {
        require(owner != address(0), "owner = zero address");
        return _balanceOf[owner];
    }

    /**
     * Checks the owner of a NFT token. If the NFT token is not owned, returns an error message.
     *
     * @param id - ID of the NFT token
     * @return owner Address of the NFT token's owner
     */
    function ownerOf(uint id) external view returns (address owner) {
        owner = _ownerOf[id];
        require(owner != address(0), "token doesn't exist");
    }

    /**
     * Transfers safely a NFT token from a sender to a receiver. Check if the receiver is a smart-contract and that it handles BEP721 tokens.
     * If not, returns an error message.
     *
     * @param from - Address of the NFT token's sender
     * @param to - Address of the NFT token's receiver
     * @param id - Id of the NFT token
     */
    function safeTransferFrom(address from, address to, uint id) external {
        transferFrom(from, to, id);

        require(
            to.code.length == 0 ||
                IBEP721Receiver(to).onBEP721Received(msg.sender, from, id, "") ==
                IBEP721Receiver.onBEP721Received.selector,
            "unsafe recipient"
        );
    }

    /**
     * Similar to previous safeTransferFrom function except a message is sent to the smart-contract receiver to confirm that it handles BEP721
     * tokens. Sending data to another smart-contract is an application-specific.
     *
     * @param from - Address of the NFT token's sender
     * @param to - Address of the NFT token's receiver
     * @param id - Id of the NFT token represented by an interger
     * @param data - Data in bytes format sent to another smart-contract 
     */
    function safeTransferFrom(address from, address to, uint id, bytes calldata data) external {
        transferFrom(from, to, id);

        require(
            to.code.length == 0 ||
                IBEP721Receiver(to).onBEP721Received(msg.sender, from, id, data) ==
                IBEP721Receiver.onBEP721Received.selector,
            "unsafe recipient"
        );
    }

    /**
     * Transfers a specific NFT token from a sender to a receiver. Check if the sender is the owner or as the approval from the owner to
     * transfer the NFT token and if the receiver address is not empty.
     * Emits the `Transfer` event with the sender and the receiver address and the id of the transfered NFT token
     *
     * @param from - Address of the NFT token's sender
     * @param to - Address of the NFT token's receiver
     * @param id - Id of the NFT token represented by an interger 
     */
    function transferFrom(address from, address to, uint id) public {
        require(from == _ownerOf[id], "from != owner");
        require(to != address(0), "transfer to zero address");

        require(_isApprovedOrOwner(from, msg.sender, id), "not authorized");

        _balanceOf[from]--;
        _balanceOf[to]++;
        _ownerOf[id] = to;

        delete _approvals[id];

        emit Transfer(from, to, id);
    }

    /**
     * Approves another user to transfer a specific NFT token. If user is not the owner or have the rights to do the approval, returns 
     * an error message.
     * Emits the `Approval` event with the owner of the NFT token's address, the new approved spender's address and the id of the NFT token
     *
     * @param spender - Future approved user address
     * @param id - Id of the NFT token that can be transferred by the spender
     */
    function approve(address spender, uint id) external {
        address owner = _ownerOf[id];
        require(
            msg.sender == owner || _isApprovedForAll[owner][msg.sender],
            "not authorized"
        );

        _approvals[id] = spender;

        emit Approval(owner, spender, id);
    }

    /**
     * Gives the right for an operator to either have the rights to transfer any NFT tokens of the user calling the function or not.
     * Emits the `ApprovalForAll` event with the address of the owner, the address of the operator and his status.
     *
     * @param operator - Address of the user that will either get or not the rights 
     * @param approved - Boolean indicating the status of the operator
     */
    function setApprovalForAll(address operator, bool approved) external {
        _isApprovedForAll[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    /**
     * Checks the address of the user approved to transfer the token. If the token doesn't exist, returns an error message.
     *
     * @param id - Integer representing the id of the NFT token
     * @return - Address of the approved user to transfer the NFT token
     */
    function getApproved(uint id) external view returns (address) {
        require(_ownerOf[id] != address(0), "token doesn't exist");
        return _approvals[id];
    }

    /**
     * Checks if a user is an operator of another user
     *
     * @param owner - Address of the user who let his tokens rights
     * @param operator - Address of the user who has the permission to transfer any tokens of the other user
     * @return - Boolean on if the user as the rights
     */
    function isApprovedForAll(address owner, address operator) external view returns (bool) {
        return _isApprovedForAll[owner][operator];
    }

    /**
     * Checks if a user is either the owner of a token or has the rights to transfer the token
     *
     * @param owner - Address of the owner of the NFT token
     * @param spender - Address of the user who has the permission to transfer the NFT token
     * @param id - ID of the NFT token that will be transferred
     * @return - Boolean saying if the user can transfer the NFT token
     */
    function _isApprovedOrOwner(address owner, address spender, uint id) internal view returns (bool) {
        return (spender == owner ||
            _isApprovedForAll[owner][spender] ||
            spender == _approvals[id]);
    }

    /**
     * Creates a new NFT token. If the future owner address is empty or the token is already minted, returns an error message.
     * Emits the `Transfer` event with the address of the new owner and the NFT token's id.
     *
     * @param to - Address of the future owner
     * @param id - Id of the NFT token represented by an integer
     */
    function mint(address to, uint id) external {
        require(to != address(0), "mint to zero address");
        require(_ownerOf[id] == address(0), "already minted");

        _balanceOf[to]++;
        _ownerOf[id] = to;

        emit Transfer(address(0), to, id);
    }

    /**
     * Deletes a NFT token. If the sender is not the owner of the NFT token or the NFT token does not exist, returns an error message.
     * Emits the `Transfer` event with the address of the owner and the NFT token's id.
     *
     * @param id - Id of the NFT token
     */
    function burn(uint id) external {
        require(msg.sender == _ownerOf[id], "not owner");
        address owner = _ownerOf[id];
        require(owner != address(0), "not minted");

        _balanceOf[owner] -= 1;

        delete _ownerOf[id];
        delete _approvals[id];

        emit Transfer(owner, address(0), id);
    }
}