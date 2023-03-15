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

    it('Should return an error as the balance of account 1 is insufficient', async () => {
        try {
            await instance.transfer(accounts[0], 10, { from: accounts[1] });
            assert.fail("Expected an error to be thrown");
        } catch (error) {
            assert.include(error.message, "Insufficient balance");
        }
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

    it('Should return an error as the balance of account 0 is insufficient', async () => {
        try {
            await instance.transferFrom(accounts[0], accounts[1], 10000);
            assert.fail("Expected an error to be thrown");
        } catch (error) {
            assert.include(error.message, "Insufficient balance");
        }
    });

    it('Should return an error as the balance of account 1s allowance is lower', async () => {
        try {
            await instance.transferFrom(accounts[0], accounts[1], 300, { from: accounts[1] });
            assert.fail("Expected an error to be thrown");
        } catch (error) {
            assert.include(error.message, "Insufficient allowance");
        }
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