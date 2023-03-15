const Ballot = artifacts.require("Ballot");

contract("Ballot", function () {
    let instance;
    let accounts;
    before(async () => {
        instance = await Ballot.deployed();
        accounts = await web3.eth.getAccounts();
    });

    it("Should return the details of the `chairperson`", async () => {
        const expectedDetails = [
            '1',
            false,
            "0x0000000000000000000000000000000000000000",
            '0'
        ];
        let voterDetails = await instance.getVoterDetails(accounts[0]);
        assert.deepEqual(voterDetails, expectedDetails, "Returned voter details do not match expected details");
    });

    it("Should return that no one has voted yet", async () => {
        try {
            await instance.winningName();
            assert.fail("Expected an error to be thrown");
        } catch (error) {
            assert.include(error.message, "No one has voted yet");
        }
    });

    it("Should return a changed status of the user when he voted", async () => {
        const expectedDetails = [
            '1',
            true,
            "0x0000000000000000000000000000000000000000",
            '1'
        ];
        await instance.vote(1, { from: accounts[0] });
        let voterDetails = await instance.getVoterDetails(accounts[0]);
        assert.deepEqual(voterDetails, expectedDetails, "Returned voter details do not match expected details");
    });

    it("Should return that user can't revote", async () => {
        try {
            await instance.vote(1, { from: accounts[0] });
            assert.fail("Expected an error to be thrown");
        } catch (error) {
            assert.include(error.message, "Already voted");
        }
    });

    it("Should return that user doesn't have the rigths to vote", async () => {
        try {
            await instance.vote(1, { from: accounts[1] });
            assert.fail("Expected an error to be thrown");
        } catch (error) {
            assert.include(error.message, "Has no right to vote");
        }
    });

    it("Should return the name of the winning representative", async () => {
        let winningName = await instance.winningName();
        assert.deepEqual(winningName, "Bob");
    });

    it("Should return the list of all voter's addresses", async () => {
        let listVoters = await instance.getVoterAddress();
        assert.deepEqual(listVoters.length, 1);
        assert.deepEqual(listVoters[0], accounts[0]);
    });

    it("Should return an error saying that only chairperson can add new voters", async () => {
        try {
            await instance.giveRightToVote(accounts[1], { from: accounts[2] });
            assert.fail("Expected an error to be thrown");
        } catch (error) {
            assert.include(error.message, "Only chairperson can give right to vote");
        }
    });

    it("Should return an error as the voter already voted", async () => {
        try {
            await instance.giveRightToVote(accounts[0], { from: accounts[0] });
            assert.fail("Expected an error to be thrown");
        } catch (error) {
            assert.include(error.message, "The voter already voted");
        }
    });

    it("Should grant the right to a user to vote", async () => {
        let expectedDetails = [
            '0',
            false,
            "0x0000000000000000000000000000000000000000",
            '0'
        ];
        let voterDetails = await instance.getVoterDetails(accounts[1]);
        assert.deepEqual(voterDetails, expectedDetails, "Returned voter details do not match expected details");

        expectedDetails = [
            '1',
            false,
            "0x0000000000000000000000000000000000000000",
            '0'
        ];
        await instance.giveRightToVote(accounts[1], { from: accounts[0] });
        voterDetails = await instance.getVoterDetails(accounts[1]);
        assert.deepEqual(voterDetails, expectedDetails, "Returned voter details do not match expected details");
    });

    it("Should return an error as the user is already a voter", async () => {
        try {
            await instance.giveRightToVote(accounts[1], { from: accounts[0] });
            assert.fail("Expected an error to be thrown");
        } catch (error) {
            assert.include(error.message, "The user is already a voter");
        }
    });

    it("Should return an error saying that the user can't vote", async () => {
        try {
            await instance.delegate(accounts[1], { from: accounts[2] });
            assert.fail("Expected an error to be thrown");
        } catch (error) {
            assert.include(error.message, "You have no right to vote");
        }
    });

    it("Should return an error saying that the user already voted", async () => {
        try {
            await instance.delegate(accounts[1], { from: accounts[0] });
            assert.fail("Expected an error to be thrown");
        } catch (error) {
            assert.include(error.message, "You already voted");
        }
    });

    it("Should return an error saying that the user can't delegate a vote to himself", async () => {
        try {
            await instance.delegate(accounts[1], { from: accounts[1] });
            assert.fail("Expected an error to be thrown");
        } catch (error) {
            assert.include(error.message, "Self-delegation is disallowed");
        }
    });

    it("Should return an error saying that the delegated user can't vote", async () => {
        try {
            await instance.delegate(accounts[2], { from: accounts[1] });
            assert.fail("Expected an error to be thrown");
        } catch (error) {
            assert.include(error.message, "Delegated user can't vote");
        }
    });

    it("Should add a vote to a representative", async () => {
        let listRepresentatives = await instance.getRepresentatives();
        assert.deepEqual(listRepresentatives[1][1], '1');

        await instance.delegate(accounts[0], { from: accounts[1] });
        listRepresentatives = await instance.getRepresentatives();

        assert.deepEqual(listRepresentatives[1][0], "Bob");
        assert.deepEqual(listRepresentatives[1][1], '2');
    });

    it("Should add a weight to the delegated user", async () => {
        const expectedDetailsUser2 = [
            '1',
            true,
            accounts[3],
            '0'
        ];

        const expectedDetailsUser3 = [
            '2',
            false,
            "0x0000000000000000000000000000000000000000",
            '0'
        ];
        await instance.giveRightToVote(accounts[2], { from: accounts[0] });
        await instance.giveRightToVote(accounts[3], { from: accounts[0] });

        await instance.delegate(accounts[3], { from: accounts[2] });


        let voter2Details = await instance.getVoterDetails(accounts[2]);
        let voter3Details = await instance.getVoterDetails(accounts[3]);

        assert.deepEqual(voter2Details, expectedDetailsUser2, "Returned voter details do not match expected details");
        assert.deepEqual(voter3Details, expectedDetailsUser3, "Returned voter details do not match expected details");
    });

    it("Should return an error as no representative has won the majority", async () => {
        try {
            await instance.giveRightToVote(accounts[4], { from: accounts[0] });
            await instance.winnerName();
            assert.fail("Expected an error to be thrown");
        } catch (error) {
            assert.include(error.message, "Not enough votes");
        }
    });

    // it("Should change the winners name", async () => {
    //     let winningName = await instance.winningName();
    //     assert.deepEqual(winningName, "Bob");

    //     await instance.delegate(accounts[3], {from: accounts[4]});
    //     await instance.vote(2, {from: accounts[3]});

    //     winningName = await instance.winningName();
    //     // const winner = await instance.winnerName();
    //     assert.deepEqual(winningName, "Charlie");
    //     assert.deepEqual(winner, "Charlie");
    // });
})