const HelloWorld = artifacts.require("HelloWorld");
const Ballot = artifacts.require("Ballot");
const FungibleToken = artifacts.require("FungibleToken");
const NFT = artifacts.require("NFT");
const Selector = artifacts.require("Selector");

module.exports = function(deployer) {
    // Deployer is the Truffle wrapper for deploying
    // contracts to the network

    // Deploy the contract to the network
    deployer.deploy(HelloWorld);
    deployer.deploy(Ballot,
        [
            "Alice",
            "Bob",
            "Charlie",
            "David",
            "Eve",
        ]
    );
    deployer.deploy(FungibleToken, 
        "TestToken",
        "TT",
        10000,
        18,
    );
    deployer.deploy(NFT);
    deployer.deploy(Selector);
}