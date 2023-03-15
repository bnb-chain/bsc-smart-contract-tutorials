/*
SPDX-License-Identifier: MIT
*/
pragma solidity ^0.8.18;

// Define the contract
contract FungibleToken {
    // Token details
    string public name;
    string public symbol;
    uint256 public totalSupply;
    uint8 public decimals;

    // Mapping to keep track of token balances
    mapping (address => uint256) public balanceOf;

    // Mapping to keep track of allowance for spending
    mapping (address => mapping (address => uint256)) public allowance;

    // Events for token transfers and approvals
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    // Variable to keep track of contract owner
    address public getOwner;

    // Constructor function to initialize the contract
    constructor(string memory _name, string memory _symbol, uint256 _totalSupply, uint8 _decimals) {
        // Assign the token details
        name = _name;
        symbol = _symbol;
        totalSupply = _totalSupply;
        decimals = _decimals;

        // Assign the total supply to the contract creator
        balanceOf[msg.sender] = totalSupply;

        // Assign the contract owner to the creator
        getOwner = msg.sender;
    }

    // Function to transfer tokens
    function transfer(address to, uint256 value) public returns (bool) {
        require(balanceOf[msg.sender] >= value, "Insufficient balance");

        // Transfer tokens
        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;

        // Emit transfer event
        emit Transfer(msg.sender, to, value);

        return true;
    }

    // Function to approve spending of tokens
    function approve(address spender, uint256 value) public returns (bool) {
        allowance[msg.sender][spender] = value;

        // Emit approval event
        emit Approval(msg.sender, spender, value);

        return true;
    }

    // Function to transfer tokens from another address
    function transferFrom(address from, address to, uint256 value) public returns (bool) {
        require(balanceOf[from] >= value, "Insufficient balance");
        require(allowance[from][msg.sender] >= value, "Insufficient allowance");

        // Transfer tokens
        balanceOf[from] -= value;
        balanceOf[to] += value;
        allowance[from][msg.sender] -= value;

        // Emit transfer event
        emit Transfer(from, to, value);

        return true;
    }
}
