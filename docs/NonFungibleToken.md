# Non-fungible tokens (NFT)

In this page, we will demonstrate:
- How to write a `NFT` contracts following the ERC721 specification;
- How to create interfaces and import them into a contract;
- Compile, migrate and test the `NFT` contract.

During the demonstration, we will cover important tools used in solidity smart-contracts.


## Settings

To run this project, the following settings are required:
- Node v18.14.0: [Node Page](https://nodejs.org/en/download/)
- Truffle v5.4.18 (core: 5.4.18):
    - `npm install -g truffle@5.4.18`
    - [Truffle page](https://trufflesuite.com/docs/truffle/how-to/install/)
- Metamask Account:
    - [MetaMask For BNB Smart Chain](https://support.metamask.io/network-profiles/network-profile-bnb-smart-chain-bnb/)

**Notes**:
- For this project, we decided to use these versions of Nodejs and Truffle. Later versions may work;
- If you run an M1 OS and encounter an error `Are you connected to the internet?`, read the following chat: [M1 'truffle-nodejs' issue](https://github.com/trufflesuite/truffle/issues/4431#issuecomment-969520019);
- Don't forget to add BNB testnet tokens to your Metamask account before migrating the smart-contract ([Airdrop website](https://testnet.bnbchain.org/faucet-smart));
- We chose to use Truffle to deploy our contract, but there are other methods available for deploying and compiling contracts.
- One of the requirements to deploy a smart-contract is to use a Software Package Data Exchange (SPDX) licence. SPDX is a standard for communicating software licenses in a machine-readable format. You can find more information on the different free SPDX on this [website](https://spdx.org/licenses/).


## Initiation

To get started, we will need to create 3 files:
- `IERC165.sol` - This file contains the ERC165 interface;
- `IBEP721.sol` - This file contains the BEP721 interface;
- `NFT.sol` - This file contains the `NFT` smart contract, which will utilize the ERC165 and BEP721 interfaces.

We will cover each interfaces explanation in detail in the following sections.

**Note**: For the tutorial, we will use the latest compiler version of solidity. To learn more, refer to the [HelloWorld smart-contract](./HelloWorld.md#Imports) explanation.


## 1 - Create the interfaces

### 1.1 - Non-fungible token (NFT)

Before explaining what interfaces are in solidity, it's important to first have a clear understanding of `non-fungible tokens`, which is the subject of this tutorial. 

A `non-fungible token`, or `NFT`, is a unique digital identifier that is recorded in a blockchain and certifies ownership and authenticity, and cannot be duplicated, replaced, or divided. `NFTs` usually refer to digital files such as photos, videos, and audio, and are distinctively identifiable assets, unlike cryptocurrencies that are fungible. The `NFT` also typically contains metadata such as the creator's name, the creation date, and other relevant information.

This tutorial will demonstrate the creation of simple `NFTs` represented by index ID. 

### 1.2 - Interfaces in solidity

An interface in Solidity is a set of function declarations that don't contain their implementation. Essentially, it defines the complete list of functions that an object must have to function properly. By imposing a specific set of properties and functions on a contract, the interface helps to ensure its compatibility with other contracts. Solidity allows us to interact with other contracts without having their code by using their interface.

One can usually find interfaces at the beginning of a Solidity contract, where they are declared using the keyword "interface". By minimizing code duplication and overhead, interfaces are particularly helpful when creating decentralized applications that prioritize extensibility and aim to avoid complexity.

Interfaces follow 4 different characteristics:
- `Inheritance`: Interfaces can inherit from other interfaces.
- `Contract Inheritance`: Contracts can inherit interfaces just as they would inherit other contracts.
- `Function Override`: We can override a function defined in an interface.
- `Data Access`: Data types defined inside interfaces can be accessed from other contracts.

As contract can inherit from different interfaces, there may be issues in knowing which interfaces are inherited by the smart-contract.

**Note**: If you want to have more information on the contract `Application Binary Interface` (ABI) and interfaces in Solidity, read the following [web documentation](https://docs.soliditylang.org/en/develop/abi-spec.html).


### 1.3 - Create the ERC165 interface

As BNB Chain is compatible with the `Ethereum Virtual Machine (EVM)`, it's possible to connect `ERC` interfaces with BEP contracts. We'll explain these two concepts in later parts of this tutorial.

In the case of `BEP721`, which we'll use in this tutorial, it uses the `ERC165` tool to enhance the contract's clarity.

#### 1.3.1 - What is Ethereum Request for Comment (ERC)?

`ERC` stands for `Ethereum request for comment`. It is a formal proposal made by the Ethereum developers for the improvement of the Ethereum network. ERCs are technical documents that define standards, protocols, and guidelines for the Ethereum ecosystem, including the creation and implementation of new tokens, smart-contracts, and other decentralized applications.

Many of these formal proposal documents are famous, like the `ERC20`, which details the token standards in a Blockchain. 

In this tutorial, we will begin by defining the purpose of the `ERC165` proposal.


#### 1.3.2 - ERC165

The [ERC165](https://eips.ethereum.org/EIPS/eip-165), also named the `Standard Interface Detection`, allows smart-contracts to advertise which interfaces they support. `ERC165` is a tool that helps contracts work better together by allowing them to declare their support for interfaces and check if an address implements a particular interface. This can save time and resources, prevent errors, and make it easier for different contracts to communicate with each other.

To list the different interfaces used in the contract, `ERC165` defines an interface by an unique interface id. An interface id is a `bytes4` value. It is calculated by taking the logical operation "exclusive or" (`XOR`) of all `function selectors` in the interface. Essentially, it is a hash that is used to differentiate one interface from another.

A `function selector` is a unique identifier that is automatically generated for each function based on the function's name and parameters. It is a four-byte (32-bit) hash value that is used to identify a function and is the first four bytes of the `keccak-256` hash of the function signature. The function selector is used to call a specific function in the contract, and it ensures that the function is called correctly with the right arguments.

**Note**: Here is a website giving more details on [function selector](https://docs.soliditylang.org/en/v0.8.12/abi-spec.html#function-selector)

The interface `ERC165` is based on one function, `supportsInterface`:
```solidity
function supportsInterface(bytes4 interfaceID) external view returns (bool);
```
[supportsInterface](../contracts/NFT/IBEP165.sol)

This function is a view fuction that takes an bytes4 interface id and returns a boolean depending on if the contract contains the interface. We will add this function in the `NFT` contract to confirm that our contract inherit from the `ERC165` and `BEP721` interfaces.


### 1.4 - Create the BEP721 interface

#### 1.4.1 - What is a BNB Evolution Proposal (BEP)?

Similar to the `Ethereum request for comment`, `BNB Evolution Proposal` (BEP) refers to a set of predefined token management rules and criteria that facilitate the launch of on-chain assets on the BNBe Chain. By following the BEP guidelines, projects can seamlessly transition their tokens from their original mainnet to the BNBe Chain, leveraging its superior speed, efficiency, and security features.

**Note**: To view the various BEP proposals, please refer to the following [GitHub repository](https://github.com/bnb-chain/BEPs).


#### 1.4.2 - BEP721

The [BEP721](https://eips.ethereum.org/EIPS/eip-721) standard is a set of rules and guidelines that define a `NFT` on the Ethereum blockchain. It is used to create unique, distinguishable tokens that represent digital assets. `BEP721` tokens are non-interchangeable, meaning that each token has a unique ID and cannot be substituted for another. The standard defines a set of functions that enable the transfer, ownership, and management of `BEP721` tokens on the blockchain.

Before defining the different functions, lets import the `IERC165` interface into the `IBEP721` interface and makes the `IBEP721` interface inherit from the `IERC165` interface.


##### 1.4.2.1 - Inheritance

As an object-oriented programming language, Solidity support inheritance between contracts or interfaces. Inheritance in Solidity allows a new contract to reuse code from an existing contract. The new contract, called a "derived contract" or "child contract", inherits properties and methods from the existing contract, called the "base contract" or "parent contract".

Here are 4 highlights on inheritance in Solidity:
- A derived contract can access all non-private members, including state variables and internal methods, but using `this` is not allowed.
- Function overriding is allowed as long as the function signature remains the same. If there is a difference in output parameters, compilation will fail.
- We can call a function in a super contract using either the `super` keyword or the super contract name.
- In the case of multiple inheritances, function calls using `super` give preference to the most derived contracts.

**Notes**: 
- There are different types of inheritance:
    - `Single Inheritance`: the functions and variables of one base contract are inherited to only one derived contract;
    - `Multi-level Inheritance`: Similar to the `Single Inheritance`, it has levels of the relationship between the parent and the child. When a child contract is derived from a parent, it also becomes the parent for any contracts that are derived from it;
    - `Hierarchical Inheritance`: A parent contract can have multiple child contracts, and this approach is commonly used when a shared functionality needs to be implemented in multiple locations;
    - `Multiple Inheritance`: A single contract can be inherited from many contracts. A parent contract can have more than one child while a child contract can have more than one parent.
- When a contract inherits from other contracts, only a single contract is created on the blockchain, and the code from all the base contracts is compiled into the created contract;
- State variable shadowing is considered as an error;

Before giving the inheritance to the 721 interface, let's import the 165 interface:
```solidity
import "./IERC165.sol";
```
[Importing the 165 interface](../contracts/NFT/IBEP721.sol#L6)

We will give a `Single Inheritance` type to the interface. To give inheritance to a contract or interface, we need to write `is` between the child contract/interface and the parent contract/interface:
```solidity
interface IBEP721 is IERC165
```
[Inheritance](../contracts/NFT/IBEP721.sol#L8)


##### 1.4.2.2 - Interface functions

We can now create the different functions that will be used in the `IBEP721` interface. The interface contains 9 different functions:

- `balanceOf`:
    - `View` function that returns the count of all `NFTs` assigned to an owner;
- `ownerOf`: 
    - `View` function that finds and returns the owner of an `NFT`;
- `safeTransferFrom`:
    - Transfer the ownership of an `NFT` from one address to another address and checks that the contract recipient is aware of the BEP721 protocol to prevent tokens from being forever locked. 
    - There are two functions:
        - The first one is dedicated to transfer the ownership of the `NFT` to another regular address; 
        - The second function transfers the ownership of the `NFT` to another smart-contract with a `bytes` data. Sending data is an application-specific. Send data to an `BEP721` contract only when it explicitly instructs you to do so and make sure to comply with any guidelines or directives provided by the contract.
- `transferFrom`:
    - Transfer the ownership of an `NFT`. Even if there is the `safeTransferFrom` function that is more secured to transfer the ownership of the `NFT`, the creator of the `BEP721` gave the following [explanation](https://github.com/ethereum/eips/issues/721#issuecomment-342943495) on the existance of the `transferFrom` function;
- `approve`:
    - Change or reaffirm the approved address for an `NFT`;
- `setApprovalForAll`:
    - Enable or disable approval for a third party, `operator`, to manage all of `msg.sender`'s assets;
- `getApproved`:
    - `View` function that gets the approved address for a single `NFT`
- `isApprovedForAll`: 
    - `View` function that queries if an address is an authorized operator for another address

We will also create another interface called `IBEP721Receiver`. It is defined by a single method, `onBEP721Received`, that is called by the sender of a `BEP721` token when the token is transferred to a smart-contract to confirm that the smart-contract support `BEP721` tokens. The function then returns a value indicating whether the `BEP721` token is supported by the new smart-contract:
```solidity
interface IBEP721Receiver {
    function onBEP721Received(address operator, address from, uint tokenId, bytes calldata data) external returns (bytes4);
}
```
[IBEP721Receiver interface](../contracts/NFT/IBEP721.sol#L22)

**Note**: If you have followed the tutorial on [fungible tokens](FungibleToken.md), you may notice that many functions in this contract are similar to those in the [fungible token tutorial](FungibleToken.md). If you haven't followed that tutorial yet, we suggest taking a look at it.

We can see the two interfaces in the following file:
[NFT interface](../contracts/NFT/IBEP721.sol)


## 2 - Create the Non-Fungible Token's contract

### 2.1 - Main contract

Now that we have the two interfaces, let's use them in our contract. We need to import the `IBEP721` interface and makes our new contract, `NFT`, inherit from the interface:
```solidity
import "./IBEP721.sol";

contract NFT is IBEP721 {
```
[NFT contract declaration](../contracts/NFT/NFT.sol#L6)


### 2.1.1 - Events

We will first declare the events that will be used in our contract.There will be three different events:
- `Transfer`: This event will be emitted when a transfer will be made. It will receive two addresses, the sender and the receiver, and an integer that is the id of the `NFT` token;
- `Approval`: This event will be emitted when an owner approved another account to transfer his token. It will receive two addresses, the owner and the `spender`, and an integer that is the id of the `NFT` token;
- `ApprovalForAll`: This event will be emitted when an owner sets or unsets the approval of a given operator to transfer any of his tokens. It will receive two addresses, the owner and the operator, and a boolean that represents the approval status.

```solidity
event Transfer(address indexed from, address indexed to, uint indexed id);
event Approval(address indexed owner, address indexed spender, uint indexed id);
event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
```
[Events](../contracts/NFT/NFT.sol#L9)

**Note**: Have a look at the [events explanation](./HelloWorld.md#L101) in the HelloWorld tutorial if you need to remind yourself.


#### 2.1.2 - State Variables

We will begin by declaring the state variables that will be used in the contract, which are all maps. Three of them will have an `internal` access level, meaning they cannot be accessed outside the contract, while one will be `public`. These variables are:

- _ownerOf: an `internal` map that links each existing token to an account. The map index is an integer, and the value is an address.
- _balanceOf: an `internal` map that records the number of tokens owned by each account. The map index is the account's address, and the value is an integer representing the account's balance.
- _approvals: an `internal` map that associates tokens with approved accounts. The map index is an integer representing the `NFT` index, and the value is the address of the account associated with the token.
- _isApprovedForAll: a `public` double map of addresses approved by the owner account to transfer all tokens. The first index is the owner account's address, which points to a second address index representing the operator's account. The value is a boolean that indicates whether the operator can transfer all of the owner's tokens.

**Note**: Have a look at the mapping explanation in the Voting tutorial.


#### 2.1.3 - Support Interfaces

Let's now create the function `supportsInterface` that we declared in the ERC165 interface. 

To adhere to the [interface ERC165](#122---erc165), the `supportsInterface` function is declared as `pure`, indicating that it doesn't modify or read the contract's state. This function takes a `bytes4` parameter called `interfaceId` that represents an interface. It then verifies whether the contract supports the interface identified by the interfaceId and returns a boolean value. If the `interfaceId` passed as an argument does not match the `ERC165` or `BEP721` interface id, the function returns false. To confirm this, you can check the interface id type of the `ERC165` and `BEP721` interfaces:
```solidity
function supportsInterface(bytes4 interfaceId) external pure returns (bool) {
    return
        interfaceId == type(IBEP721).interfaceId ||
        interfaceId == type(IBEP165).interfaceId;
}
```
[SupportsInterface function](../contracts/NFT/NFT.sol#L25)


#### 2.1.4 - View functions balanceOf and ownerOf

For these two functions, we check the internal state maps value and return a value from them.

Firstly, the `balanceOf` function retrieves the number of tokens held by a specific account. We need to check that a real address has been received before checking the `_balanceOf` map. To do so, we compare the received address to the `address(0)`. `Address(0)` is a special address that represents an empty or null address. We then return the value in the map assigned to the address received. If the address doesn't exist in the map, the result will be equal to 0:
```solidity
function balanceOf(address owner) external view returns (uint) {
    require(owner != address(0), "owner = zero address");
    return _balanceOf[owner];
}
```
[BalanceOf function](../contracts/NFT/NFT.sol#L31)

**Note**: `Address(0)` is commonly used in solidity programs to indicate the absence of an address.

Afterwards, the `ownerOf` function verifies the owner of a given token. This function accepts an integer representing the index of a token that already exists. The function assigns the value of the token's index in the `_ownerOf` map to a variable called `owner`, which is then returned. If the token index doesn't exist in the map, an empty or null address will be assigned to the `owner` variable. Therefore, we need to verify that `owner` is not equal to `address(0)`:
```solidity
function ownerOf(uint id) external view returns (address owner) {
    owner = _ownerOf[id];
    require(owner != address(0), "token doesn't exist");
}
```
[OwnerOf function](../contracts/NFT/NFT.sol#L36)


#### 2.1.5 - Safe Transfer From and Transfer From functions

Now, let's write the most important functions: `safeTransferFrom` and `transferFrom`.

We first declare the two `safeTransferFrom` functions. These functions takes three arguments: 
- `from`: address of the sender of the `NFT` transfer
- `to`: address of the receiver of the `NFT` transfer
- `id`: index of the `NFT` transfered

The two functions will call the `transferFrom` function. Afterwards, they check whether the receiver is a smart-contract (i.e. code size is greater than 0). If the receiver is a smart-contract, it calls the `onBEP721Received` function from the `IBEP721Receiver` interface on the receiver. If the returned value is not equal to `bytes4(keccak256("onBEP721Received(address,address,uint256,bytes)"))`, an error will be thrown.

One of the two function will add a `data` value when checking that the contacted smart-contract supports `BEP721` tokens. The `data` variable is a `bytes4` data sent to the smart-contract. This is an application-specific:
```solidity
function safeTransferFrom(address from, address to, uint id) external {
    transferFrom(from, to, id);

    require(
        to.code.length == 0 ||
            IBEP721Receiver(to).onBEP721Received(msg.sender, from, id, "") ==
            IBEP721Receiver.onBEP721Received.selector,
        "unsafe recipient"
    );
}

function safeTransferFrom(address from, address to, uint id, bytes calldata data) external {
    transferFrom(from, to, id);

    require(
        to.code.length == 0 ||
            IBEP721Receiver(to).onBEP721Received(msg.sender, from, id, data) ==
            IBEP721Receiver.onBEP721Received.selector,
        "unsafe recipient"
    );
}
```
[SafeTransferFrom functions](../contracts/NFT/NFT.sol#L41)

The `transferFrom` function requires several checks before executing the transaction. First, we need to confirm that the user who initiated the transaction is the token's owner or is approved by the owner to transfer the token. We can do this by calling the `_isApprovedOrOwner` function. Additionally, we need to ensure that the receiver's address is valid.

Once we have confirmed these details, we can update the `_balanceOf` state map by reducing the number of owned tokens of the sender and increasing the number owned by the receiver. The `_ownerOf` map value is also changed to the address of the receiver. Finally, we delete the approvals that were previously granted to transfer the token from the `_approvals` state map.

Finally the `Transfer` event is triggered with the address of the sender, the receiver's address and the id of the token transferred:
```solidity
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
```
[TransferFrom function](../contracts/NFT/NFT.sol#L63)


#### 2.1.6 - Approval's functions

In this part, we will explain 5 different functions related to the approval process:

1. The `approve` function enables the token owner or an authorized user with the ability to transfer all of the owner's tokens, to authorize another user to transfer a specific indexed token owned by the owner.

To do this, the function takes in the address of the new `spender` and the index of the token that the owner is granting permission for. Before proceeding, the function should check that the address associated with the token in the `_ownerOf` state map is that of the owner or a user authorized to transfer the token. If the token doesn't exist, an error message will be returned.

After confirming the details, the function assigns the new `spender` address to the token in the `_approvals` state map. Finally, the function emits the `Approval` event, which includes the `owner` address, the new `spender` address, and the index of the token:
```solidity
function approve(address spender, uint id) external {
    address owner = _ownerOf[id];
    require(
        msg.sender == owner || _isApprovedForAll[owner][msg.sender],
        "not authorized"
    );

    _approvals[id] = spender;

    emit Approval(owner, spender, id);
}
```
[Approve declaration](../contracts/NFT/NFT.sol#L78)

2. The `setApprovalForAll` function enables the message owner to grant an operator the ability to transfer any of their `NFTs` by changing the `operator`'s authorization status.

The function takes in the address of the `operator` and the desired authorization status. Upon execution, the status is updated in the `_isApprovedForAll` state map. Additionally, the function emits the `ApprovalForAll` event, which includes the address of the message sender, the `operator` address, and the updated status of the operator:
```solidity
function setApprovalForAll(address operator, bool approved) external {
    _isApprovedForAll[msg.sender][operator] = approved;
    emit ApprovalForAll(msg.sender, operator, approved);
}
```
[SetApprovalForAll function](../contracts/NFT/NFT.sol#L90)


3. The `getApproved` function is an `external view` function that checks whether an address has been granted permission to transfer a specific token. To do so, it takes the token's index as input. The function first checks whether the token exists by verifying whether there is an address associated with the token in the `_ownerOf` state map. If this check is successful, the function returns the address of the `spender` linked to the token in the `_approvals` state map:
```solidity
function getApproved(uint id) external view returns (address) {
    require(_ownerOf[id] != address(0), "token doesn't exist");
    return _approvals[id];
}
```
[GetApproved function](../contracts/NFT/NFT.sol#L96)

4. The `isApprovedForAll` function is an `external view` function that checks if an `operator` is approved to transfer all tokens owned by an owner. It takes the owner and `operator` addresses as input and returns a boolean value representing the status of approval. The value is retrieved from the state map `_isApprovedForAll`:
```solidity
function isApprovedForAll(address owner, address operator) external view returns (bool) {
    return _isApprovedForAll[owner][operator];
}
```
[IsApprovedForAll function](../contracts/NFT/NFT.sol#L101)

5. The `_isApprovedOrOwner` function is an `internal view` function that determines whether a `spender` is authorized to transfer a specific token. The function takes in the owner address, `spender` address, and token id as parameters. It checks whether the `spender` is the owner of the token or has been authorized by the owner to transfer any tokens or specifically the given token id. The function then returns a boolean value indicating whether the `spender` is approved or the owner of the token:
```solidity
function _isApprovedOrOwner(address owner, address spender, uint id) internal view returns (bool) {
    return (spender == owner ||
        _isApprovedForAll[owner][spender] ||
        spender == _approvals[id]);
}
```
[_IsApprovedOrOwner function](../contracts/NFT/NFT.sol#L105)

**Note**: `External` functions can only be called from outside the contract whereas `internal` functions can only be called from the contract.


#### 2.1.7 - Mint and burn functions

Last but not least, we will create two functions that will create new `NFT` or destroy `NFT`. These two functions will be called `mint` and `burn`.

The `mint` function creates a new `NFT` and takes two parameters - the address of the future token owner and the index of the new token. If the provided address is empty or the token is already minted, the function throws an exception. If not, the function increments the number of tokens owned by the user in the `_balanceOf` state map and assigns the token's id to the user's address in the `_ownerOf` state map. Finally, the `Transfer` event is emitted with an empty address for the sender, the new owner's address, and the id of the new token, signifying the creation of the new token:
```solidity
function mint(address to, uint id) external {
    require(to != address(0), "mint to zero address");
    require(_ownerOf[id] == address(0), "already minted");

    _balanceOf[to]++;
    _ownerOf[id] = to;

    emit Transfer(address(0), to, id);
}
```
[Mint function](../contracts/NFT/NFT.sol#L111)

On the other hand, the purpose of the `burn` function is to destroy an `NFT`. When this function is called, it takes in the ID of the token to be destroyed. If the message sender doesn't own the token or the token doesn't exist in the state map `_ownerOf`, an exception will be thrown. If the token exists and the sender owns it, the function decrements the amount of tokens in the state map `_balanceOf`, deletes the token's id from the state map `_ownerOf`, and removes the approval's address assigned to the deleted token. Finally, the event `Transfer` is triggered with the owner of the token as the sender, an empty address for the receiver address, since the token has been destroyed, and the id of the deleted token:
```solidity
function burn(uint id) external {
    require(msg.sender == _ownerOf[id], "not owner");
    address owner = _ownerOf[id];
    require(owner != address(0), "not minted");

    _balanceOf[owner] -= 1;

    delete _ownerOf[id];
    delete _approvals[id];

    emit Transfer(owner, address(0), id);
}
```
[Burn function](../contracts/NFT/NFT.sol#L121)


### 2.2 - Selector testing contract

To obtain the correct interface IDs for `ERC165` and `BEP721`, which can be passed to the `supportsInterface` function, we will create a contract named `Selector`. This contract will have four functions, two of which will be used to locate the interface IDs, while the other two will verify that the IDs are valid.

As explained in the [ERC165 part](#122---erc165), interface IDs can be calculated by taking the `XOR` of all `function selectors` in the interface. In our first function, we will get the interface id value of the interface `BEP721`. 

This interface contains all the following `function selectors`: 
- `balanceOf(address)`;
- `ownerOf(uint256)`;
- `approve(address,uint256)`;
- `getApproved(uint256)`;
- `setApprovalForAll(address,bool)`;
- `isApprovedForAll(address,address)`;
- `transferFrom(address,address,uint256)`;
- `safeTransferFrom(address,address,uint256)`;
- `safeTransferFrom(address,address,uint256,bytes)`.

As the `Ethereum ABI` takes the first four bytes of the Keccak-256 hash of the signature of the function for a function call specifies the function to be called, you will have to combine the first four bytes of the Keccak-256 hash of the signature of each function. ([Information](https://docs.soliditylang.org/en/develop/abi-spec.html#function-selector))

Here is the function:
```solidity
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
```
[calcIBEP721InterfaceId function](../contracts/NFT/Selector.sol#L21)

The second function will be simpler. We will generate a variable which will contain the interface `ERC165`. Then, we will return the 4 bytes of calldata that specifies the function `supportsInterface` in the `ERC165` interface. This 4 bytes is called a function selector:
```solidity
function calcIERC165InterfaceId() external pure returns (bytes4) {
    IBEP165 i;
    return i.supportsInterface.selector;
}
```
[calcIERC165InterfaceId function](../contracts/NFT/Selector.sol#L11)


## 3 - Compile and Migrate the contract

Now that we have created all our interfaces and contracts, let's compile and migrate the contracts `NFT` and `Selector` to the `BSC testnet` network.


### 3.1 - Initiation

At first, you should confirm that you have the following architecture:
```
.
├── config.js
├── contracts
│   ├── IERC165.sol
│   ├── IBEP721.sol
│   ├── NFT.sol
│   └── Selector.sol
├── migrations
│   └── 2_deploy_contracts.js
├── package-lock.json
├── package.json
├── test
└── truffle-config.js
```

**Note**: Make sure to have all dependencies saved in the `node_modules` directory before compiling:
```
npm install
```


### 3.2 - Compilation

To compile all the contracts, run the following command:
```
truffle compile
```

You should see the following output:
```
Compiling your contracts...
===========================
> Compiling ./contracts/IERC165.sol
> Compiling ./contracts/IBEP721.sol
> Compiling ./contracts/NFT.sol
> Compiling ./contracts/Selector.sol
> Artifacts written to /Users/user/Documents/program/developer_info/test/build/contracts
> Compiled successfully using:
   - solc: 0.8.18+commit.87f61d96.Emscripten.clang
```

The compilation should have created four different artifacts in the `contracts` folder: `IERC165.sol`, `IBEP721.sol`, `NFT.sol` and `Selector.sol`.


### 3.3 - Migration

Before migrating the two contracts, `NFT` and `Selector`, you will need to set the deployment file, `2_deploy_contracts.js`, in the `migrations` folder. To do the settings, you will need to import the two artifacts, `IERC165.sol` and `IBEP721.sol`, and deploy them:
```js
const NFT = artifacts.require("NFT");
const Selector = artifacts.require("Selector");

module.exports = function (deployer) {
    deployer.deploy(NFT);
    deployer.deploy(Selector);
}
```

Now that the settings are ready, you can migrate your contracts with the following command:
```
truffle migrate --network testnet
```

The command should return the following output:
```
Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.



Starting migrations...
======================
> Network name:    'testnet'
> Network id:      97
> Block gas limit: 50000000 (0x2faf080)


2_deploy_contracts.js
=====================

   Deploying 'NFT'
   ---------------
   > transaction hash:    0x131e597f4cd0903b33600ef1c10d5a12ede3f4fd5a62ec221e1f9f9fba5d84d4
   > Blocks: 0            Seconds: 0
   > contract address:    0xAEa8D0c6A99c861Bf6FAb68c44cE6BfA447c81ce
   > block number:        27802247
   > block timestamp:     1678094376
   > account:             0x9726a6a5a5ecaF2B7b22792cAA68Bdf0D68D9Ff3
   > balance:             27.347794727392176836
   > gas used:            1780619 (0x1b2b8b)
   > gas price:           10 gwei
   > value sent:          0 ETH
   > total cost:          0.01780619 ETH

   Pausing for 10 confirmations...
   -------------------------------
   > confirmation number: 1 (block: 27802248)
   > confirmation number: 3 (block: 27802250)
   > confirmation number: 4 (block: 27802251)
   > confirmation number: 5 (block: 27802252)
   > confirmation number: 7 (block: 27802254)
   > confirmation number: 8 (block: 27802255)
   > confirmation number: 9 (block: 27802256)
   > confirmation number: 11 (block: 27802258)

   Deploying 'Selector'
   --------------------
   > transaction hash:    0xb47cf12a3b0bf54ddbcdfdc4ddff0807d67cd34662d3abe8105da9a0d35b3278
   > Blocks: 0            Seconds: 0
   > contract address:    0x7A8a31CE2283384424d9907b9F761934A00D9ec7
   > block number:        27802259
   > block timestamp:     1678094412
   > account:             0x9726a6a5a5ecaF2B7b22792cAA68Bdf0D68D9Ff3
   > balance:             27.345651807392176836
   > gas used:            214292 (0x34514)
   > gas price:           10 gwei
   > value sent:          0 ETH
   > total cost:          0.00214292 ETH

   Pausing for 10 confirmations...
   -------------------------------
   > confirmation number: 1 (block: 27802260)
   > confirmation number: 3 (block: 27802262)
   > confirmation number: 4 (block: 27802263)
   > confirmation number: 5 (block: 27802264)
   > confirmation number: 6 (block: 27802265)
   > confirmation number: 8 (block: 27802267)
   > confirmation number: 9 (block: 27802268)
   > confirmation number: 10 (block: 27802269)
   > Saving artifacts
   -------------------------------------
   > Total cost:          0.01994911 ETH


Summary
=======
> Total deployments:   2
> Final cost:          0.01994911 ETH
```

**Note**: Although Truffle writes down all the fees in ether, the deployment fees are actually paid in BNB coins. Therefore, you don't need any ether in your Metamask account.

## 4 - Test the contract

### 4.1 - Console Test

The contracts are now are ready to be tested. To get started, let's connect to the `BSC testnet` network with the following command:
```
truffle console --network testnet
```

To obtain the interface IDs from the `Selector` contract, we need to deploy the contract using the following command:
```js
const Selector = await Selector.deployed();
```

With the `Selector` variable, we can call now the functions `calcIERC165InterfaceId` and `calcIBEP721InterfaceId` to get each interface's id:
```js
await Selector.calcIERC165InterfaceId();
```
```js
await Selector.calcIBEP721InterfaceId();
```

With the interfaces id now available, we can move on to working on the `NFT` contract. To begin, we'll need to retrieve the contract and create an `accounts` variable that will hold the different metamask accounts to be used for testing: 
```js
const NFT = await NFT.deployed();
```
```js
let accounts = await web3.eth.getAccounts();
```

To confirm that the `NFT` contract is using the `ERC165` and `BEP721` interfaces, we can interact with it and call the function `supportsInterface` with each interface ID number received from the `Selector` contract:
```js
await NFT.supportsInterface("0x80ac58cd");
```
```js
await NFT.supportsInterface("0x01ffc9a7");
```

You should expect to receive the value `true` twice. To verify the correct functioning of the function, you may send another interface id number and check if it returns a `false` value.:
```js
await NFT.supportsInterface("0xffffffff");
```

Now we can play with the `NFT` function. Let's first check that our main account doesn't own any `NFT`:
```js
(await NFT.balanceOf(accounts[0])).toNumber();
```

As the account doesn't own any `NFT`, we can create a new `NFT`:
```js
await NFT.mint(accounts[0], 0);
```

The `NFT` being created, we can verify that it is owned by our main account:
```js
await NFT.ownerOf(0);
```

To test the different functions of the smart-contract before we continue with the tutorial, let's create multiple tokens:
```js
await NFT.mint(accounts[0], 1);
```
```js
await NFT.mint(accounts[0], 2);
```

Now, we can let the account 1 get the approval to transfer the `NFT` 0 that we created:
```js
await NFT.approve(accounts[1], 0);
```

From the previous command, we should see now a result when checking approved accounts on the `NFT` 0:
```js
await NFT.getApproved(0);
```

Let's check that the account 1 can transfer the `NFT` 0 to another account:
```js
await NFT.safeTransferFrom(accounts[0], accounts[2], 0, {from: accounts[1]});
```

Now, we can give all the rights to transfer all the `NFT` from our main account on the account 1:
```js
await NFT.setApprovalForAll(accounts[1], true);
```

A `true` value should be returned from the following command:
```js
await NFT.isApprovedForAll(accounts[0], accounts[1]);
```

Since we didn't use the `approve` function to allow Account 1 to transfer Token 1, we can test the `setApprovalForAll` function by allowing Account 1 to transfer Token 1 using the `transferFrom` function:
```js
await NFT.transferFrom(accounts[0], accounts[1], 1, {from: accounts[1]});
```

Finally, let's burn the last `NFT` owned by our main account since they no longer need it:
```js
await NFT.burn(2);
```

Congratulations on completing the console testing! Now, it's time to move on to testing the smart-contract with test functions.

### 4.2 - Test functions

We can check each function and their errors by running test functions. You can find all the test functions in the [nft.js](../test/test/nft.js) file.
To compile the file, use the following command:
```
truffle test --network testnet
```


## 5 - Conclusion

In this page, we discovered and tested two of the most important proposals, ERC165 and BEP721, and how to create a `NFT` smart-contract and deploy it. In the next section, we will explore how to create `Multi Token Standard`, mix between ERC20 and BEP721.