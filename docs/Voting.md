# Voting

In this page, we will demonstrate:
- how to create a simple ballot the blockchain that contains a list of different representatives;
- Add new voters to the ballot;
- Let voters vote or delegate their vote to other voters;
- Get the winner of the election.

Additionally, we'll cover some basic Solidity code that will help you to write your own smart contracts. ([whole contract](../contracts/Voting.sol))

## Requirement

In this project, we will create a ballot where up to five representatives can be nominated. Initially, only the user who creates the ballot will be allowed to elect a representative. However, the user can add an unlimited number of voters to the ballot. Voters will have two options: they can vote for a representative or delegate their vote to another voter. The representative with the most votes wins the election.

At any time, we'll be able to check which representative is winning the election, the status of each voter, the list of each voter's public address, the public address of the ballot's creator, and the standing of each representative.

## Settings

To deploy this contract, the following settings are required:
- Node v18.14.0:
    - [Homebrew](https://formulae.brew.sh/formula/node)
    - [Node Page](https://nodejs.org/en/download/)
- Truffle v5.4.18 (core: 5.4.18):
    - `npm install -g truffle@5.4.18`
    - [Truffle page](https://trufflesuite.com/docs/truffle/how-to/install/)
    - [M1 installation](https://github.com/trufflesuite/truffle/issues/4431#issuecomment-969520019)
- Metamask Account:
    - [MetaMask For BNB Smart Chain](https://docs.bnbchain.org/docs/wallet/metamask/)
    - [Create an additional account](https://metamask.zendesk.com/hc/en-us/articles/360015289452-How-to-create-an-additional-account-in-your-wallet)

Note: It is required to have 3 different accounts in your metamask wallet that owns BNB tokens. We would suggest you to [airdrop BNB tokens](https://testnet.bnbchain.org/faucet-smart) to one of your metamask's account and then transfer some founds (at least 0.1 BNB) to your other accounts.


## Initiation

Before starting to write the content of our smart-contract, we will need to specify the compiler version to be used in our Solidity file:
```
pragma solidity ^0.8.18;
```
[compiler version](../contracts/Voting.sol#l2)

For more explanations, check the explanation for the [HelloWorld smart-contract](./HelloWorld.md#Imports).


## 1 - Create Smart-contract Ballot

After creating our new smart-contract, `Ballot`, let's write the state variables of the contract.


### 1.1 - Declare the state variables

In solidity, there are different type of variables: 
- `State Variables` - are stored permanently in the contract's storage, and their values are preserved across function calls;
- `Local Variables` - are declared and used within a function's scope, and are not stored in contract storage on the blockchain. They are temporary in nature and have a limited lifespan;
- `Global Variables` - exists in the global namespace and are used to retrieve information about the blockchain. 

Note: At the destruction of the smart-contract, the `State variables` will stay in old blocks of the Blockchain. ([More information](https://ethereum.stackexchange.com/a/10794))

Let's start by declaring the structures used in our contract.

#### Structure

A struct is a custom data type that lets us define a composite data structure by grouping variables of different types under a single name. This makes it easier to pass around related data as a single variable. The members of a struct can be any type of data except another struct. Defining structs is more efficient than objects, since it can help reduce gas consumption. In Solidity, structs can be mapped as value types, which makes it possible to track information for each member of the struct.

In our smart-contract, we create two structure: `Voter` and `Representative`.

The first structure, `Voter`, represents the voter's status by 4 parameters:
- `Weight`: A number that indicates the amount of votes the voter owns. When a user becomes a voter, they gain one vote;
- `Voted`: A boolean value that tells us whether the voter has already voted or not;
- `Delegates`: The address of the voter to whom the current voter has delegated their vote;
- `Vote`: A number that indicates the index of the representative that the voter has voted for.

```
struct Voter {
    uint weight;
    bool voted;
    address delegate;
    uint vote;
}
```
[Structure Voter](../contracts/Voting.sol#l13)

The second structure, `Representative`, is the combination of the vote count with the name of the representative:
- `name`: The Name of the representative
- `voteCount`: The number of vote that the representatif received

```
struct Representative {
    string name;
    uint voteCount;
}
```
[Structure Representative](../contracts/Voting.sol#l25)


#### Mapping

A mapping is a data structure that allows you to map a unique key to a value. It's similar to an associative array or a hash table in other programming languages. The key can be any type except for a mapping, and the value can be any type including other mappings or structs.

In our contract, we created a new mapping called `voters` that takes the address of the user as the key and the voter status as the value. The variable is oublic because it should be accessed by anyone:
```
mapping(address => Voter) public voters;
```
[Mapping voters](../contracts/Voting.sol#l32)


#### Address

`Address` is a variable type that represents a 20-byte Blockchain address. An Blockchain address is used to identify an account, and it is derived from the public key of the account. An Blockchain address starts with '0x' and is usually represented as a string of 40 hexadecimal characters.

In our contract, we use two state address variables:
- `chairperson` is the account's address of the user who created the ballot
- `voterAddress` is the array containing the address of every voters

```
address public chairperson;
address[] public voterAddress;
```
[Address variables](../contracts/Voting.sol#l34)


#### Other Data

Here is a list of other `State Variables` used in the contract:
- `Representatives` is an array of structure `Representative` to save each representative for the election;
- `nbrVotes` is the number of voters which already voted for a representative

```
Representative[] public representatives;
uint public nbrVotes;
```
[Other variables](../contracts/Voting.sol#l38)


### 1.2 - Create the event

To have more information on events in solidity, have a look at [HelloWorld Events](./HelloWorld.md#Events)

In our case, we created an event, called `MessageSender`, to know which address voted for which representative when the `vote` function is triggered:
```
event MessageSender(address sender, string representativeName);
```
[Event](../contracts/Voting.sol#l42)


### 1.3 - Add a constructor

A constructor is a special function that is executed once during the contract creation process, when the contract is being deployed to the blockchain. The constructor is used to initialize the state variables of the contract and can be used to set default values for them. The constructor has the same name as the contract, and does not have a return type. It can have parameters, which can be used to set the initial state of the contract.

In this project, we will set the `chairperson` variable to the person who creates the smart-contract, add that person to the list of voters, and also add a list of representatives that the contract creator specifies at the time of contract creation. We will impose two conditions on this list of representatives:

- It cannot contain more than 6 representatives.
- Each representative's name cannot be longer than 32 characters."

We will add these constraints by using the `require` functions.


#### Require function

A `require` function is an error handling statement that revert the transaction if the condition is not validated before executing the rest of a function's code. The function will immediately stop executing and any state changes made to the contract will be reverted. It can be used to check inputs, state conditions, and other requirements to ensure that the function can continue executing safely. The `require` function can return a message to indicate the problem, if any.

In our case, the first condition is that the amount of representative should be lower than 6. If it is not the case, a message saying `Too many representatives` will be returned. For the second condition, each representative's name will be checked before saving the representative in the `representatives` array. If the name is too long, the following error message will be returned: `Name too long`.

```
constructor(string[] memory representativeNames) {
    require(representativeNames.length < 6, "Too many representatives");
    nbrVotes = 0;
    chairperson = msg.sender;
    voters[chairperson].weight = 1;
    voterAddress.push(chairperson);


    for (uint i = 0; i < representativeNames.length; i++) {
        require(bytes(representativeNames[i]).length < 32, "Name too long");
        representatives.push(Representative({
            name: representativeNames[i],
            voteCount: 0
        }));
    }
}
```
[Constructor](../contracts/Voting.sol#l50)

To know who created the smart-contract, we use the variable `msg.sender`. `msg.sender` is a special variable in Solidity that represents the address of the account that called the function or transaction that is currently being executed on the blockchain. `msg.sender` is often used to restrict access to certain functions or operations based on the sender's address. 
This value is assigned to `chairperson` variable.

Now that we created the contract, let's add the function needed to vote, add new voters and delegate votes.


### 1.4 - Add new voters

The ballot has been created but there is only one person who can vote, the `chairperson`. To grow the community of voters, the `chairperson` will need to add every new voters. Two conditions should be respected:
- The person whom is adding new voter should be the `chairperson`. A message saying `Only chairperson can give right to vote` should else be returned;
- The user that will become a voter shouldn't be a voter. A message saying `The user is already a voter` should else be returned.

```
function giveRightToVote(address voter) external {
    require(msg.sender == chairperson, "Only chairperson can give right to vote");
    require(voters[voter].weight == 0, "The user is already a voter");

    voters[voter].weight = 1;
    voterAddress.push(voter);
}
```
[giveRightToVote function](../contracts/Voting.sol#l73)


### 1.5 - Add voters action

Now that we can have new voters, they should be able to do two different actions: vote or delegate.


#### Vote for a representative

To cast a vote, the index of a representative should be sent as an argument to the `vote` function. The function checks two conditions before registering the vote:

- The sender of the message has the right to vote. If not, the function returns a message saying `You have no right to vote`;
- The sender of the message has not voted yet. If they have, the function returns a message saying `You have already voted`.

If both conditions are met, the `voted` status of the voter is set to true, and their `vote` is recorded by setting the vote value to the index of the representative they voted for in their voter profile. The `voterCount` of the chosen representative's account is incremented, as well as the `nbrVotes` variable, by the number of votes the voter holds.

```
function vote(uint representativeIndex) external {
    Voter storage sender = voters[msg.sender];

    emit MessageSender(msg.sender, representatives[representativeIndex].name);
    require(sender.weight != 0, "Has no right to vote");
    require(!sender.voted, "Already voted");

    sender.voted = true;
    sender.vote = representativeIndex;
    representatives[representativeIndex].voteCount += sender.weight;
    nbrVotes += sender.weight;
}
```
[vote function](../contracts/Voting.sol#l88)

The function is made `external`. `External` functions are the type of functions that are part of the contract but can only be used externally and called outside the contract by the other contracts. This means that an `external` function can only be called by an external account, such as an blockchain address, and not by other functions in the same contract or other contracts.

We also emit the event `MessageSender` to show the address of the message sender and the name of the representative they voted for.

The voter can otherwise delegate his vote.


#### Delegate a vote to another voter

To delegate their vote, the voter must send the address of the voter who will receive it. When the voter calls the `delegate` function, multiple conditions must be met:

- The voter must have the right to vote. If not, they will receive the message: `You have no right to vote`;
- The voter must not have already voted. If they have, they will receive the message: `You already voted`;
- The voter cannot delegate their vote to themselves. If they try to do so, they will receive the message: `Self-delegation is disallowed`;
- The voter who is receiving the vote must have the right to vote. If not, they will receive the message: `Delegated user can't vote`.

If all of these requirements are met, the `voted` value of the sender will be set to true and the `delegate` value will be set to the address of the delegated voter. Depending on whether the delegated voter has already voted, either the `voteCount` of the representative profile or the amount of votes held by the delegated voter will be incremented by the number of votes held by the sender.

```
function delegate(address to) external {
    Voter storage sender = voters[msg.sender];
    require(sender.weight != 0, "You have no right to vote");
    require(!sender.voted, "You already voted");
    require(to != msg.sender, "Self-delegation is disallowed");

    while (voters[to].delegate != address(0)) {
        to = voters[to].delegate;
        require(to != msg.sender, "Found loop in delegation");
    }

    Voter storage delegate_ = voters[to];
    require(delegate_.weight >= 1, "Delegated user can't vote");
    sender.voted = true;
    sender.delegate = to;

    if (delegate_.voted) {
        representatives[delegate_.vote].voteCount += sender.weight;
    } else {
        delegate_.weight += sender.weight;
    }
}
```
[delegate function](../contracts/Voting.sol#l111)

The function is again `external` as it doesn't need to be called in the smart-contract.


### 1.6 - See the results

Now that the user can interact with the contract, we will need function to see who is leading the election and who won the election.
To do so, we will use `view` functions.


#### View functions

A `view` Function is a function that only reads but doesn't alter the state variables defined in the contract. When a function is declared as `view`, it cannot modify any state variables or emit any events. This means that it is a "read-only" function and does not require any gas to be executed. `View` functions can be called by other contracts or off-chain applications to retrieve information from the blockchain without incurring any gas costs.

There are three functions related to determining the winner of the ballot:

- `winningRepresentative()` is a private view function that checks the `voteCount` value of each representative and returns the index of the representative with the highest `voteCount` value.

```
function winningRepresentative() private view returns (uint winningRepresentative_) {
    uint winningVoteCount = 0;
    for (uint p = 0; p < representatives.length; p++) {
        if (representatives[p].voteCount > winningVoteCount) {
            winningVoteCount = representatives[p].voteCount;
            winningRepresentative_ = p;
        }
    }
}
```
[winningRepresentative function](../contracts/Voting.sol#l139)

- `winningName()` is an external view function that returns the name of the current leading representative in terms of `voteCount`. If no one has voted yet, an error message `No one has voted yet` is returned. If there are votes, it returns the name of the representative whose index is returned by `winningRepresentative()`.

```
function winningName() external view returns (string memory winnerName_) {
    require(nbrVotes > 0, "No one has voted yet");
    winnerName_ = representatives[winningRepresentative()].name;
}
```
[winningName function](../contracts/Voting.sol#l155)

In this function, we can return a variable without writting return by mentioning it in the statement block.


- `winnerName()` is another external view function that returns the name of the winner of the ballot. If no one has voted, the message `No one has voted yet` is returned. If the leading representative does not have more than 50% of the votes, the message `Not enough vote`s is returned. If there are no errors, the name of the winner is returned.

```
function winnerName() external view returns (string memory) {
    require(nbrVotes > 0, "No one has voted yet");
    uint leadingRepresentative = winningRepresentative();
    require(representatives[leadingRepresentative].voteCount > (voterAddress.length/2), "Not enough votes");
    return representatives[leadingRepresentative].name;
}
```
[winnerName function](../contracts/Voting.sol#l165)


#### Getter functions

Finally, for this test, we will create multiple getter functions:

- The first one retrieves the details of a designed voter. It receives the address of the voter and returns the object `Voter`.

```
function getVoterDetails(address addr) public view returns(Voter memory) {
    Voter memory voterDetails = voters[addr];
    return voterDetails;
}
```
[getVoterDetails function](../contracts/Voting.sol#l178)

- The second getter function retrieves the addresses of every voters.

```
function getVoterAddress() public view returns(address[] memory) {
    return voterAddress;
}
```
[getVoterAddress function](../contracts/Voting.sol#l197)

- The last getter function returns the list of representatives and the amount of votes they received.

```
function getRepresentatives() public view returns(Representative[] memory) {
    return representatives;
}
```
[getRepresentatives function](../contracts/Voting.sol#l206)

Note: `Solidity` creates getter functions automatically for public variables. For arrays, the generated getter function is used to access the array variables directly and not for retrieving the array itself. Thus, the getter function requires an integer parameter to denote the index to access. To get the full values of the array `voterAddress` and `representatives`, we therefore generated our own getter function. We also created a getter function for the `voters` map as the returned value is more readable.

## 2 - Compile and Migrate the contract

After we finished to create the contract, we need to compile and migrate it to the Blockchain. To do so, run at first this command:
```
truffle compile --network testnet
```

Now that you have the new instance, add to your contract migration's file the Ballot instance:
```
const Ballot = artifacts.require("Ballot");
``` 

As there is a constructor in the contract, we will not be able to follow the same method than the one used for the [`HelloWorld`](./HelloWorld.md#Migrate) instance. For the `Ballot` contract, we need the name of the different representatives that voters will be able to vote for: [representativeNames](../contracts/Voting.sol#l50).

To do so, write the following lines:
```
deployer.deploy(Ballot,
    [
        "Alice",
        "Bob",
        "Charlie",
        "David",
        "Eve",
    ]
);
```
We choose the 5 following representatives: `Alice`, `Bob`, `Charlie`, `David`, `Eve`.

Now that the migration file is ready, let's run it:
```
truffle migration --network testnet
```


## 3 - Test the contract

### 3.1 - Console Test

After you migrated your contract, you can start to test your contract in the truffle's console.
```
truffle console --network testnet
```

At first, you will create a variable called `accounts` that will contain all your metamask accounts:
```
let accounts = await web3.eth.getAccounts()
```

If you want to check every address you can run the following address:
```
accounts
```

Then you can create another variable called `instance` that will contain all the function of your deployed contract `ballot` (...more info):
```
const instance = await Ballot.deployed()
```

Now, you can interact with the contract. At first, check that the `chairperson` of the contract is your first metamask's account address:
```
instance.chairperson()
```

Then, check that all the representatives that you sent to the constructor are saved in your contract:
```
await instance.getRepresentatives()
```

Check if there is already a winner. You should receive an error as no one has already voted yet.
```
await instance.winningName()
```

To change that, let's vote for `Bob`:
```
await instance.vote(1)
```

Now, we can see `Bob` as the leading of the representative ballot
```
await instance.winningName()
```

We can also check the list of all voters. There should be only one address for now.
```
await instance.getVoterAddress()
```

Let's now check the status of another user.
```
await instance.getVoterDetails(accounts[1])
```

As there are no other voters in the list than the `chairperson`, you should receive the following data:
```
{
    weight: '0',
    voted: false,
    delegate: "0x0000000000000000000000000000000000000000",
    vote: '0'
}
```

To change the status of the user 1, you will have to call the `giveRightToVote()` function:
```
await instance.giveRightToVote(accounts[1], {from: accounts[0]})
```

The status should have now changed, and we should receive a different solution when checking the status of the `user 1`:
```
await instance.getVoterDetails(accounts[1])
```

The result should look the following:
```
{
    weight: '1',
    voted: false,
    delegate: "0x0000000000000000000000000000000000000000",
    vote: '0'
}
```

Let's give the right to vote to the `user 2`:
```
await instance.giveRightToVote(accounts[2])
```

Now that we have multiple voters, we can test the `delegate()` function. Let's ask the `user 1` to delegate his vote to the `user 2`:
```
await instance.delegate(accounts[2], {from: accounts[1]})
```

Now have a look at each users status.
```
await instance.getVoterDetails(accounts[1])
```
```
await instance.getVoterDetails(accounts[2])
```

The first user status should look as the following:
```
{
    weight: '1',
    voted: true,
    delegate: "accounts[2] address",
    vote: '0'
}
```

The second user status should also have changed:
```
{
    weight: '2',
    voted: false,
    delegate: "0x0000000000000000000000000000000000000000",
    vote: '0'
}
```

The `user 2` will now use his two votes to elect another representative. Let's vote for `David`: 
```
await instance.vote(3, {from: accounts[2]});
```

After this vote, we should see the name `David` when calling the `winningName()` function:
```
await instance.winningName()
```

You can also check all the representative amount of votes by running the function `getRepresentatives()`:
```
await instance.getRepresentatives()
```


### 3.2 - Test functions

We can test the function by running test functions to check each smart-contract's functions. You can find all the test functions in  the [ballot.js](../test/test/ballot.js) file.

We can run the following command to compile the test functions:
```
truffle test --network testnet
```

## 4 - Conclusion

In this tutorial, we have learned how to create a ballot with voters that can either vote or delegate their vote. We have learned basic data type in solidity like `mapping` or `address`. We have also reviewed basic solidity tools like the `require` functions or the `view` functions.

In the next tutorial, we will learn how to create a non-fungible token's contract.
