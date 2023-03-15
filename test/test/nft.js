const NFT = artifacts.require("NFT");
const Selector = artifacts.require("Selector");

contract('ERC165', function () {
    let instance;

    before(async () => {
        instance = await Selector.deployed();
        accounts = await web3.eth.getAccounts()
    });

    it('should return the number 0x01ffc9a7 for the 165 interface id', async () => {
        const num = await instance.calcIERC165InterfaceId();
        assert.equal(num, '0x01ffc9a7', 'Function should support interface 165');
    });

    it('should return the number 0x80ac58cd for the 721 interface id ', async () => {
        const num = await instance.calcIBEP721InterfaceId();
        assert.equal(num, '0x80ac58cd', 'Function should support interface 165');
    });
})

contract('NonFungibleToken', function () {
    let instance;
    let accounts;

    before(async () => {
        instance = await NFT.deployed();
        accounts = await web3.eth.getAccounts()
    });

    it('should say that the interface 165 and 721 are used in the contract', async () => {
        const interface165 = await instance.supportsInterface('0x01ffc9a7');
        const interface721 = await instance.supportsInterface('0x80ac58cd');

        assert.equal(interface165, true, 'Function should support interface 165');
        assert.equal(interface721, true, 'Function should support interface 721');
    });

    it('should return an error as the interface is not used in the contract', async () => {
        const interface = await instance.supportsInterface('0xffffffff');

        assert.equal(interface, false, 'Function should not support interface 0xffffffff');
    });

    it('should return an error `owner = zero address` as the address sent is empty', async () => {
        try {
            await instance.balanceOf("0x0000000000000000000000000000000000000000");
            assert.fail("Expected an error to be thrown");
        } catch (error) {
            assert.include(error.message, "owner = zero address");
        }
    });

    it('should return a balance of 0 NFTs', async () => {
        const balanceOf = await instance.balanceOf(accounts[0]);

        assert.equal(balanceOf, 0, 'Balance of account 0 should be equal to 0');
    });

    it('should return an error `token doesnt exist` as the sent NFT doesnt exist', async () => {
        try {
            await instance.ownerOf(0);
            assert.fail("Expected an error to be thrown");
        } catch (error) {
            assert.include(error.message, "token doesn't exist");
        }
    });

    it('should return an error `mint to zero address` as the future owner account sent is empty', async () => {
        try {
            await instance.mint("0x0000000000000000000000000000000000000000", 0);
            assert.fail("Expected an error to be thrown");
        } catch (error) {
            assert.include(error.message, "mint to zero address");
        }
    });

    it('should mint new NFTs', async () => {
        await instance.mint(accounts[0], 0);
        const mint = await instance.mint(accounts[0], 1);

        assert.equal(mint.logs[0].event, 'Transfer', 'Transfer event should fire');
    });

    it('should return an error `already minted` as the NFT id sent is already minted', async () => {
        try {
            await instance.mint(accounts[0], 0);
            assert.fail("Expected an error to be thrown");
        } catch (error) {
            assert.include(error.message, "already minted");
        }
    });

    it('should return the address of the account that owning the token 0', async () => {
        const ownerOf = await instance.ownerOf(0);

        assert.equal(ownerOf, accounts[0]);
    });

    it('should return a balance of 2 NFTs', async () => {
        const balanceOf = await instance.balanceOf(accounts[0]);

        assert.equal(balanceOf, 2);
    });

    it('should return an error as the user sending the message doesnt have the rights to give approval on the token 0', async () => {
        try {
            await instance.approve(accounts[1], 0, { from: accounts[1] });
            assert.fail("Expected an error to be thrown");
        } catch (error) {
            assert.include(error.message, "not authorized");
        }
    });

    it('should return an error as the token doesnt exist', async () => {
        try {
            await instance.approve(accounts[1], 2);
            assert.fail("Expected an error to be thrown");
        } catch (error) {
            assert.include(error.message, "not authorized");
        }
    });

    it('should give the approval to the transfer the token 0 to account 1', async () => {
        const approve = await instance.approve(accounts[1], 0);
        const getApproved = await instance.getApproved(0);

        assert.equal(approve.logs[0].event, 'Approval', 'Approval event should fire');
        assert.equal(getApproved, accounts[1], 'Account 1 should be approved to transfer token 0');
    });

    it('should return an error as the token doesnt exist', async () => {
        try {
            await instance.getApproved(2);
            assert.fail("Expected an error to be thrown");
        } catch (error) {
            assert.include(error.message, "token doesn't exist");
        }
    });

    it('should return an error as the transfer is not done from the owner of the token', async () => {
        try {
            await instance.transferFrom(accounts[1], accounts[2], 0);
            assert.fail("Expected an error to be thrown");
        } catch (error) {
            assert.include(error.message, "from != owner");
        }
    });

    it('should return an error as the NFT is sent to an empty address', async () => {
        try {
            await instance.transferFrom(accounts[0], "0x0000000000000000000000000000000000000000", 0);
            assert.fail("Expected an error to be thrown");
        } catch (error) {
            assert.include(error.message, "transfer to zero address");
        }
    });

    it('should return an error as the account 2 is not authorized to make the transfer of token 0', async () => {
        try {
            await instance.transferFrom(accounts[0], accounts[1], 0, { from: accounts[2] });
            assert.fail("Expected an error to be thrown");
        } catch (error) {
            assert.include(error.message, "not authorized");
        }
    });

    it('should make the transfer of token 0 from account 0 to account 1', async () => {
        const transfer = await instance.transferFrom(accounts[0], accounts[1], 0, { from: accounts[1] });
        const balanceOfAccount0 = await instance.balanceOf(accounts[0]);
        const balanceOfAccount1 = await instance.balanceOf(accounts[1]);
        const ownerOf = await instance.ownerOf(0);
        const getApproved = await instance.getApproved(0);

        assert.equal(transfer.logs[0].event, 'Transfer', 'Transfer event should fire');
        assert.equal(balanceOfAccount0, 1, "Account 0's balance should be 1");
        assert.equal(balanceOfAccount1, 1, "Account 1's balance should be 1");
        assert.equal(ownerOf, accounts[1], "NFT 0's owner should be account 1");
        assert.equal(getApproved, "0x0000000000000000000000000000000000000000", "There shouldn't be any approvals");
    });

    it('should change the status of account 1 to transfer any tokens from account 0', async () => {
        const setApprovalForAll = await instance.setApprovalForAll(accounts[1], true, { from: accounts[0] });
        const isApprovedForAllTrue = await instance.isApprovedForAll(accounts[0], accounts[1]);

        assert.equal(setApprovalForAll.logs[0].event, 'ApprovalForAll', 'ApprovalForAll event should fire');
        assert.equal(isApprovedForAllTrue, true, 'Account 1 should have the rights to transfer any tokens from account 0');
    });

    it('should change the account approved to transfer token 0', async () => {
        await instance.approve(accounts[2], 0, { from: accounts[1] });
        const approve = await instance.approve(accounts[0], 0, { from: accounts[1] });
        const getApproved = await instance.getApproved(0);

        assert.equal(approve.logs[0].event, 'Approval', 'Approval event should fire');
        assert.equal(getApproved, accounts[0], 'Account 1 should be approved to transfer token 0');
    });

    it('should transfer the token 1 from account 0 to account 2 when account 1 is asking', async () => {
        // const transfer = await instance.safeTransferFrom(accounts[0], accounts[2], 1,  web3.utils.utf8ToHex('Test'), { from: accounts[1] });
        const transfer = await instance.safeTransferFrom(accounts[0], accounts[2], 1, { from: accounts[1] });
        const balanceOfAccount0 = await instance.balanceOf(accounts[0]);
        const balanceOfAccount2 = await instance.balanceOf(accounts[2]);
        const ownerOf = await instance.ownerOf(1);
        const getApproved = await instance.getApproved(1);

        assert.equal(transfer.logs[0].event, 'Transfer', 'Transfer event should fire');
        assert.equal(balanceOfAccount0, 0, "Account 0's balance should be 0");
        assert.equal(balanceOfAccount2, 1, "Account 2's balance should be 1");
        assert.equal(ownerOf, accounts[2], "NFT 1's owner should be account 2");
        assert.equal(getApproved, "0x0000000000000000000000000000000000000000", "There shouldn't be any approvals");
    });

    it('should change the status of account 1 to transfer any tokens from account 0', async () => {
        const setApprovalForAll = await instance.setApprovalForAll(accounts[1], false, { from: accounts[0] });
        const isApprovedForAllFalse = await instance.isApprovedForAll(accounts[0], accounts[1]);

        assert.equal(setApprovalForAll.logs[0].event, 'ApprovalForAll', 'ApprovalForAll event should fire');
        assert.equal(isApprovedForAllFalse, false, 'Account 1 should have the rights to transfer any tokens from account 0');
    });

    it('should return an error as the sender doesnt own the NFT', async () => {
        try {
            await instance.burn(0);
            assert.fail("Expected an error to be thrown");
        } catch (error) {
            assert.include(error.message, "not owner");
        }
    });

    it('should return an error as the NFT is not minted', async () => {
        try {
            await instance.burn(2);
            assert.fail("Expected an error to be thrown");
        } catch (error) {
            assert.include(error.message, "not owner");
        }
    });

    it('should burn a token', async () => {
        const burn = await instance.burn(1, {from: accounts[2]});
        const balanceOfAccount2 = await instance.balanceOf(accounts[2]);

        assert.equal(burn.logs[0].event, 'Transfer', 'Transfer event should fire');
        assert.equal(balanceOfAccount2, 0, "Account 2's balance should be 0");
    });

    it('should return an error as the token is burned', async () => {
        try {
            await instance.ownerOf(1);
            assert.fail("Expected an error to be thrown");
        } catch (error) {
            assert.include(error.message, "token doesn't exist");
        }
    });

    it('should return an error as the token is burned', async () => {
        try {
            await instance.getApproved(1);
            assert.fail("Expected an error to be thrown");
        } catch (error) {
            assert.include(error.message, "token doesn't exist");
        }
    });
});