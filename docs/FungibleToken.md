# Fungible Token

In this page, we will demonstrate:
- How to create BEP20 fungible tokens by creating the FungibleToken.sol file 
- Compile, migrate to the BNB Smart Chain testnet network.

## Introduction

[BEP20](https://academy.binance.com/en/glossary/bep-20) is a technical standard for tokens on the BNB Smart Chain (BSC). 
BEP20 tokens are similar to the ERC20 tokens on the Ethereum network and are used to represent digital assets such as cryptocurrencies, tokens, or other assets.

In this tutorial, we are going to create a fungible token. 

A fungible token is a type of digital asset that is interchangeable with other units of the same token. 
This means that each unit of the token is identical and has the same value as any other unit of the token. 
For example, if you have two $10 bills, you could exchange one for another and still have the same value.

Using a technical standard like BEP20 or ERC20 is important because it makes tokens easier to use, more secure, compatible with different platforms, and more liquid.
This can help to increase their adoption and value in the blockchain ecosystem.

## Requirements

When you create a BEP20 token, you need to follow the BEP20 standard. The BEP20 standard is defined [here](https://github.com/bnb-chain/BEPs/blob/master/BEP20.md).

A BEP20 token contract must implement the following functions:
- `symbol`: Returns the symbol of the token.
- `decimals`: Returns the number of decimals the token uses.
- `totalSupply`: Returns the total token supply.
- `balanceOf`: Returns the account balance of another account with address `_owner`.
- `getOwner`: Returns the address of the owner.
- `transfer`: Sends `_value` tokens to address `_to` from your address.
- `transferFrom`: Sends `_value` tokens to address `_to` from address `_from` on the condition it is approved by `_from`.
- `approve`: Allows `_spender` to withdraw from your account multiple times, up to the `_value` amount. If this function is called again it overwrites the current allowance with `_value`.
- `allowance`: Returns the amount which `_spender` is still allowed to withdraw from `_owner`.

In addition, the following functions are optional:
- `name`: Returns the name of the token.

It also needs to emit the following events:
- `Transfer`: Triggered when tokens are transferred.
- `Approval`: Triggered whenever approve(address _spender, uint256 _value) is called.

We are going to implement all of these functions in our contract, but keeping it as simple as possible.
Starting with the initialization of the variables, the creation of the constructor, and the implementation of the functions.

## Implementation

The BEP20 standard doesn't specify how to implement these functions. You can implement them in any way you want, and this can lead to errors and security issues.

Even more, you can extend the BEP20 standard by adding your own functions and events. For example, you can add a function to burn tokens or to mint new tokens.

Some of the common features of BEP20 that can be added are the following:

- `Mintable`: The ability to mint new tokens, increasing the total supply, by some privileged accounts.

- `Burnable`: The ability to burn tokens, decreasing the total supply.

- `Pausable`: The ability to pause the contract, preventing the transfer of tokens. You could also pause a specific account, preventing it from sending tokens.

- `Permit`: The ability to change the allowance of an BEP20 token for a specific account by providing a signed message. This is different from the traditional way of using the "approve" method, which requires sending a transaction on the blockchain and holding Ether to pay for the transaction fees.

- `Voting`: The ability to vote on proposals using tokens as voting weight. Keeps track of historical balances for voting in on-chain governance, with a way to delegate one's voting power to a trusted account.

- `Flash minting`: The ability to mint tokens and immediately sell them in the same transaction. This is useful for arbitrage bots.

- `Snapshots`: The ability to create snapshots of the balances at a given block number. This is useful for creating historical voting records, or for creating historical balances for voting in on-chain governance.

- `Upgradeable`:  The ability to upgrade the contract to a new version. This is useful for adding new features to the contract without having to redeploy it. Smart contracts are immutable by default unless deployed behind an upgradeable proxy.


**Notes**:

- Each functionality can be locked to specific accounts, or to all accounts. 
For example, you can lock the minting functionality to a specific account, or to all accounts. 
Or you can use roles to lock the functionality to specific groups of accounts.

- All of these features can be implemented in different ways, but is important to keep in mind that the more features you add, the more complex your contract will be. One option is to use a library that implements these features, like [Openzepelin extensions](https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#extensions).


## Settings

To deploy this contract, the following settings are required:
- Node v18.14.0: [Node Page](https://nodejs.org/en/download/)
- Truffle v5.4.18 (core: 5.4.18):
    - `npm install -g truffle@5.4.18`
    - [Truffle page](https://trufflesuite.com/docs/truffle/how-to/install/)
- Metamask Account:
    - [MetaMask For BNB Smart Chain](https://docs.bnbchain.org/docs/wallet/metamask/)

To test the transfer, approve and transferFrom functions of the smart contract, it is required that you have 2 different accounts in your metamask wallet that owns BNB tokens. We would suggest you to [airdrop BNB tokens](https://testnet.bnbchain.org/faucet-smart) to one of your metamask's account and then transfer some founds (at least 0.1 BNB) to your other accounts.

For this project, we decided to use these versions of Nodejs and Truffle. Later versions may work.


## Initiation

To get started, we'll need to create a new smart-contract file called `FungibleToken.sol`. You can do this by opening a new directory and creating a file with that name. In this file, we'll need to specify which compiler version we want to use for our Solidity code:

```
pragma solidity ^0.8.18;
```
[compiler version](../contracts/FungibleToken.sol#l4)

We are using the version 0.8.18 for this contract as it is the current latest solidity compiler version ([February 2023](https://blog.soliditylang.org/2023/02/01/solidity-0.8.18-release-announcement/)). 

To ensure the highest level of security, we follow the [official recommendation](https://docs.soliditylang.org/en/latest/index.html#solidity) and use the latest released version of Solidity.

## 1 - Create Smart-contract FungibleToken

### 1.1 - Name the contract

To create a new contract, we will have to write the following line:

```
 contract FungibleToken {}
```

[contract name](../contracts/FungibleToken.sol#l7)

This line defines the `FungibleToken` contract. The contract's functions and variables will be written within the curly braces following the contract name.


### 1.2 - Create the variables of the contract

In the specification of the BEP20 standard, we can see that the contract needs to have a list of public functions mentioned above. 
Starting from Solidity v0.8, public state variables automatically generate a public getter function. 
This means that you no longer need to write a separate getter function for each public state variable in your contract.

It is a best practice to initialize contract variables before or during the constructor function to ensure that the contract state is properly initialized when the contract is deployed to the blockchain network.

```
// Token details
string public name;
string public symbol;
uint8 public decimals;
uint256 public totalSupply;
```

[token variables](../contracts/FungibleToken.sol#l8)

In this part, we will use the `uint8` and `uint256` types to hold numbers instead of strings. These are unsigned integer types, which means that they can only hold positive values. 

#### uint8

The `uint8` type is an unsigned integer of 8 bits. It can hold a value between 0 and 255.

#### uint256

The `uint256` type is an unsigned integer of 256 bits. It can hold a value between 0 and 2^256 - 1.

### 1.3 - Adding a mapping to keep track of balances

A mapping is a key-value data structure similar to an associative array or hash table. It is used to store and access data in a structured way.

The `balanceOf` mapping will keep track of the balances of all the accounts in the contract. The `address` type is used to store Ethereum addresses. It is a 20-byte value that does not allow any arithmetic operations.

```
mapping(address => uint256) public balanceOf;
```

[balanceOf mapping](../contracts/FungibleToken.sol#l15)


### 1.4 - Adding a mapping to keep track of allowances for spending

The `allowance` mapping will keep track of the allowances for spending of all the accounts in the contract. 

This mapping will be used to keep track of the amount of tokens that an account has been approved to spend by another account.


```
mapping(address => mapping(address => uint256)) public allowance;
```

[allowance mapping](../contracts/FungibleToken.sol#l18)


### 1.5 - Adding event for token transfers

The `Transfer` event will be emitted when tokens are transferred. 

This will allow clients to listen for this event and react to it, as well as create and use applications that track token transfers.

In this line, we are using the `indexed` keyword. It is used to mark a field in an event as indexed. 

This means that the field will be stored in a special data structure that makes it easy and cheap to retrieve the value of the field when filtering or sorting logs.
An example of a use case for this is when you want to filter logs by the `from` or `to` address. 

Without the `indexed` keyword, you would have to loop through all the logs and check the `from` and `to` fields to find the ones you are looking for. 

With the `indexed` keyword, you can use the `from` and `to` fields to filter the logs directly.

**Note**:

The execution cost in smart contracts is proportional to the amount of gas used. 

The more gas you use, the more you have to pay. Being able to filter logs directly by the `from` and `to` fields will save a lot of gas, thus saving you money.

```
event Transfer(address indexed from, address indexed to, uint256 value);
```

[Transfer event](../contracts/FungibleToken.sol#l21)




### 1.6 - Adding event for token approvals

The `Approval` event will be emitted when an account approves another account to spend tokens on its behalf. 

This will allow clients to listen for this event and react to it, as well as create and use applications that track token approvals.


```
event Approval(address indexed owner, address indexed spender, uint256 value);
```

[Approval event](../contracts/FungibleToken.sol#l22)


For example, when a user authorizes a decentralized exchange (DEX) to spend their tokens, it triggers an approval event. 

A DEX is a platform that allows users to trade tokens without relying on a third party. This means that the user's tokens don't need to be transferred to the DEX before a trade can occur.


### 1.7 - Adding variable for the owner of the contract

The BEP20 standard requires that the contract has a variable that stores the address of the owner of the contract, which is the address that deployed the contract to the blockchain network.

One reason for this is the need to bind with BEP2 token in the Beacon Chain.

It can be also used for minting and burning tokens, and for pausing the contract.


```
    address public getOwner;
```

[Approval event](../contracts/FungibleToken.sol#l25)


### 1.8 - Adding the constructor function

The constructor function is a special function that is only executed upon contract creation, it is used to initialize the contract state.

It is important because it is the only place where the contract variables can be initialized, and usually it is used to specify the initial supply of tokens to particular accounts.


```
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
```

[Constructor](../contracts/FungibleToken.sol#l27)

In this contract, we are going to give all the supply of tokens to the account that is deploying the contract.

We will use the `msg.sender` variable to specify the address of the account that is deploying the contract.

**Note**: The variables `_name`, `_symbol`, `_decimals`, and `_totalSupply` are the parameters of the constructor function. Those are passed when the contract is deployed. When you define a function parameter with the same name as a state variable, the underscore symbol _ is added as a prefix to the parameter name to distinguish it from the state variable. This makes the code easier to read and reduces confusion.



### 1.9 - Adding the transfer function

The `transfer` function is used to transfer tokens from the account that is calling the function to another account.

```
function transfer(address _to, uint256 _value) public returns (bool) {
    require(balanceOf[msg.sender] >= _value);
    balanceOf[msg.sender] -= _value;
    balanceOf[_to] += _value;
    emit Transfer(msg.sender, _to, _value);
    return true;
}
```
[Transfer function](../contracts/FungibleToken.sol#l41)

The `transfer` function takes two parameters: `_to` and `_value`. 

The `_to` parameter is the address of the account that will receive the tokens. 

The `_value` parameter is the amount of tokens that will be transferred.

It has a returns (bool) statement. This means that the function will return a boolean value. 
If the function is executed successfully, it will return `true`. If the function fails, it will return `false`.

The `require` statement is used to check if the account that is calling the function has enough tokens to transfer. 
If the account doesn't have enough tokens, the function will revert and the tokens won't be transferred. 
This require has the option to add a message to the revert, useful for debugging.

In the final step, the `emit` statement is used to trigger the `Transfer` event. The purpose of this event is to notify clients that the tokens have been transferred.

**Note**: As the transfer function is customizable, you could add a fee to the transfer function, which gives the option to profit from the token transaction if desired.

### 1.10 - Adding the approve function

The `approve` function allows another account to spend tokens on behalf of the calling account.

This function is used in combination with the `transferFrom` function to transfer tokens from one account to another. It is also used to approve a DEX to spend tokens on the account that is calling the function.


```
function approve(address _spender, uint256 _value) public returns (bool) {
    allowance[msg.sender][_spender] = _value;
    emit Approval(msg.sender, _spender, _value);
    return true;
}
```

[Approve function](../contracts/FungibleToken.sol#l54)

The `approve` function takes two parameters: `_spender` and `_value`. 

The `_spender` parameter is the address of the account that will be approved to spend tokens on the account that is calling the function. The `_value` parameter is the amount of tokens that will be approved to spend.

It emits the `Approval` event. This is to notify the clients that the account has approved another account to spend tokens on its behalf.

### 1.11 - Adding the transferFrom function

Finally, the `transferFrom` function is used to transfer tokens from one account to another.

```
function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
    require(_value <= balanceOf[_from]);
    require(_value <= allowance[_from][msg.sender]);
    balanceOf[_from] -= _value;
    balanceOf[_to] += _value;
    allowance[_from][msg.sender] -= _value;
    emit Transfer(_from, _to, _value);
    return true;
}
```

[transferFrom function](../contracts/FungibleToken.sol#l65)

The requirements in the `transferFrom` function are the same as the requirements in the `transfer` function. 

The only difference is that the `_from` parameter is used to specify the account that is sending the tokens.

The `allowance` mapping is used to check if the account that is calling the function has been approved to spend tokens on the `_from` account.

The balance of the `_from` account is decreased by the `_value` parameter. 

The balance of the `_to` account is increased by the `_value` parameter. 

The allowance of the `_from` account is decreased by the `_value` parameter.

After the tokens are transferred, the `Transfer` event is emitted, this is to notify the clients that the tokens have been transferred.


## 2 - Compile and Migrate the contract

Follow the same steps as in the [Hello World tutorial](HelloWorld.md#l156) but using the `FungibleToken.sol` contract instead of the `HelloWorld.sol` contract.

The main difference is that in the `2_deploy_contracts.js` file, you will need to add the parameters of the constructor function.

For example, you can use the following parameters:

```
deployer.deploy(FungibleToken, 
    "TestToken",
    "TT",
    10000,
    18,
);
```

These parameters are the ones that we used in the constructor function.

```
constructor(string memory _name, string memory _symbol, uint256 _totalSupply, uint8 _decimals)
```

Being the first parameter the name of the token, the second parameter the symbol of the token, the third parameter the total supply of the token, and the fourth parameter the decimals of the token.

**Note**: 

If you intend to migrate only the BEP20 contract, you can replace the code in the `2_deploy_contracts.js` file with the following:

```

const FungibleToken = artifacts.require("FungibleToken");

module.exports = function(deployer) {
    deployer.deploy(FungibleToken, 
        "TestToken",
        "TT",
        10000,
        18,
    );
}
```

## 3 - Testing the smart contract

### 3.1 - Console Test

Once your migration is complete, you can test your deployed smart contract using the Truffle console. To access the Truffle environment, run the following command:

```sh
truffle console --network testnet
```

This will connect you to the `BNB Smart Chain testnet`.

Next, retrieve your deployed `FungibleToken` smart contract:

```js
const instance = await FungibleToken.deployed()
```

Now, you are able to test the functions of the smart contract.

To list all the elements inside the smart contract, write `instance` in the console.
For example, let's make sure that the `totalSupply` is equal to the `balanceOf` of the account that deployed the contract.

```js
instance.totalSupply()
```
Returns the folllowing result: (used 10000 as the totalSupply in the constructor)


```js
BN {
  negative: 0,
  words: [ 10000, <1 empty item> ],
  length: 1,
  red: null
}

```

**Notes:**

- The [BN](https://web3js.readthedocs.io/en/v1.2.0/web3-utils.html#bn) object is a BigNumber object. It is used to represent large numbers.

  - negative: indicates whether the number is negative (0 means positive);

  - words: an array of the number's magnitude in 26-bit chunks, in little-endian order (i.e. the least significant word is at index 0);

  - length: the number of words used to represent the number;

  - red: a reference to a Montgomery context used for modular arithmetic (null means the number is not using a Montgomery context).

- The `BN` object can be converted to a number using the `toNumber` function.

    ```js
    (instance.totalSupply()).toNumber();
    ```


After that, we want to check the balance of the account that deployed the contract. To do this, we can use the `balanceOf` function.

```js
let accounts = await web3.eth.getAccounts()
```

```js
instance.balanceOf(accounts[0])
```

```js
BN {
    negative: 0,
    words: [ 10000, <1 empty item> ],
    length: 1,
    red: null
}
```

That returns the same result as the `totalSupply` function. This is because the account that deployed the contract is the only account that has tokens, and it has the same amount of tokens as the total supply.

**Note:** We used the `web3` library to get the accounts from the user, but you could also write the address of the account that you want to check.




Now let's send 100 tokens to another account.

```js
instance.transfer(accounts[1],100)
```

And check the balance of the account that received the tokens.

```js
instance.balanceOf(accounts[1])
```
```js
BN {
  negative: 0,
  words: [ 100, <1 empty item> ],
  length: 1,
  red: null
}
```

And the one that sent the tokens.

```js
instance.balanceOf(accounts[0])
```
```js
BN {
  negative: 0,
  words: [ 9900, <1 empty item> ],
  length: 1,
  red: null
}
```

Now, let's try to send back the tokens to the first account. For that, we are going to use the `transferFrom` function, as the first account is not the owner of the tokens.


First, we need to approve the account that will send the tokens.

```js
instance.approve(accounts[0], 100, {from: accounts[1]})
```

**Note:** The `from` parameter is used to specify the account that will execute the function.

We can check the allowance of the account that will send the tokens.

```js
instance.allowance(accounts[1], accounts[0])
```

```js
BN {
  negative: 0,
  words: [ 100, <1 empty item> ],
  length: 1,
  red: null
}
```

And finally, we can send the tokens back to the first account.

```js
instance.transferFrom(accounts[1], accounts[0], 100)
```

And check the balance of the account that received the tokens.

```js
instance.balanceOf(accounts[0])
```

```js
BN {
  negative: 0,
  words: [ 10000, <1 empty item> ],
  length: 1,
  red: null
}
```


### 3.2 - Test functions

Following the same steps as in the [Hello World tutorial](HelloWorld.md#l359), create a file `fungible_token.js` and add tests for the functions of the smart contract.

For example, you can add the following tests:

```js
const FungibleToken = artifacts.require("FungibleToken");

contract('FungibleToken', function () {
    let instance;
    let accounts;
    before(async () => {
        instance = await FungibleToken.deployed();
        accounts = await web3.eth.getAccounts()
    });


    it('Should have the same getOwner address', async () => {
        let owner = await instance.getOwner();
        assert.equal(owner, accounts[0]);
    });

    it('Should transfer tokens and emit Transfer event', async () => {
        let sender = accounts[0];
        let recipient = accounts[1];
        
        let senderInitialBalance = await instance.balanceOf(sender);
        let recipientInitialBalance = await instance.balanceOf(recipient);

        let log = await instance.transfer(recipient, 100);

        let senderFinalBalance = await instance.balanceOf(sender);
        let recipientFinalBalance = await instance.balanceOf(recipient);

        assert.equal(senderInitialBalance - senderFinalBalance, 100, 'Sender balance not decreased by transfer amount');
        assert.equal(recipientFinalBalance - recipientInitialBalance, 100, 'Recipient balance not increased by transfer amount');

        assert.equal(log.logs.length, 1, 'Transfer event not emitted');
        assert.equal(log.logs[0].event, 'Transfer', 'Transfer event not emitted');
        assert.equal(log.logs[0].args.from, sender, 'Incorrect sender address in Transfer event');
        assert.equal(log.logs[0].args.to, recipient, 'Incorrect recipient address in Transfer event');
        assert.equal(log.logs[0].args.value, 100, 'Incorrect transfer amount in Transfer event');
    });

    it('Should increase allowance and emit Approval event', async () => {
        let owner = accounts[0];
        let spender = accounts[1];
        let amount = 100;

        let result = await instance.approve(spender, amount);
        let allowanceAfter = await instance.allowance(owner, spender);

        assert.equal(allowanceAfter.toString(), amount.toString(), "Allowance not increased");
        assert.equal(result.logs.length, 1, "Event not emitted");
        assert.equal(result.logs[0].event, "Approval", "Event not emitted");
        assert.equal(result.logs[0].args.spender, spender, "Incorrect spender address in event");
        assert.equal(result.logs[0].args.value, amount, "Incorrect allowance amount in event");
    });

    it('Should transfer tokens from account 1 to account 2, requested by account 0, and emit Transfer event', async () => {
        let owner = accounts[1];
        let spender = accounts[0];
        let recipient = accounts[2];
        let amount = 100;

        // Start by sending some tokens to account 1, as account 0 has all tokens initially
        await instance.transfer(accounts[1], amount);

        // Add allowance for account 0 to spend tokens from account 1
        await instance.approve(spender, amount, { from: owner });

        let result = await instance.transferFrom(owner, recipient, amount, { from: spender });
        let recipientBalanceAfter = await instance.balanceOf(recipient);

        assert.equal(recipientBalanceAfter, amount, "Balance not increased");
        assert.equal(result.logs.length, 1, "Event not emitted");
        assert.equal(result.logs[0].event, "Transfer", "Event not emitted");
        assert.equal(result.logs[0].args.from, owner, "Incorrect sender address in event");
        assert.equal(result.logs[0].args.to, recipient, "Incorrect recipient address in event");
        assert.equal(result.logs[0].args.value, amount, "Incorrect transfer amount in event");
    });
})
```

To run these test functions, we use the following command to compile the test file:
```bash
truffle test --network testnet
```

## 4 - Conclusion

In this tutorial you learned the basic content of a BEP20 smart contract. In this case, we created a Fungible Token.

The implementation of the smart contract is very simple, but it is enough to understand the basic concepts of BEP20 tokens.

For a more complete implementation of a BEP20 smart contract, you can check this template [BEP20.sol](https://github.com/bnb-chain/bsc-genesis-contract/blob/master/contracts/bep20_template/BEP20Token.template) from the BNB Smart Chain team.