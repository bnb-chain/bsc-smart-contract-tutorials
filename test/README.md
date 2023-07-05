# smart-contract-tutorial-code

This repository contains a Truffle architecture to compile, migrate and test smart-contracts.

**Be careful**: Add your [metamask passphrase](https://metamask.zendesk.com/hc/en-us/articles/360015290032-How-to-reveal-your-Secret-Recovery-Phrase) to the `.secret` file before starting.

To use Truffle, you need NodeJS and npm.

Don't forget to install the dependencies by running the following command:
```
npm install
```

## Compile

To compile your smart-contracts, run the following command:
```
truffle compile
```

## Migrate

The following command will compile our contract and deploy it to the BNBe Smart Chain testnet. The deployment process may take a few minutes, and you will see a log of the status updates in your terminal.
```
truffle migration --network testnet
```

## Test

To test your contract, run the following command:
```
truffle test --network testnet
```

## Test console

For the `HelloWorld` console's test, follow these steps:

### Hello World

To access the Truffle environment, run the following command:
```
truffle console --network testnet
```
This will connect you to the `BNBe Smart Chain testnet`.

Next, retrieve your deployed `HelloWorld` smart contract:
```
const instance = await HelloWorld.deployed()
```

Now, let's test the `sayHelloWorld` function of our smart-contract by compile the function:
```
await instance.sayHelloWorld()
```

You can then test the `logMessage` function as well:
```
await instance.logMessage()
```

You can check the transaction info in the [`bsc testnet explorer`](https://testnet.bscscan.com/) by pasting the `transactionHash`.