// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.18;

contract Ballot {
    /**
     * Voter structure that contains all details on the state of a single voter
     * 
     * @param weight - number showing how many votes hold the user
     * @param votes - boolean triggered if the user voted
     * @param delegate - address of the user to which the vote is delegated
     * @param vote - index of the voted proposal
     */
    struct Voter {
        uint weight;
        bool voted;
        address delegate;
        uint vote;
    }

    /**
     * Representative structure that contains all details needed on the representative
     *
     * @param name - hexadecimal strings (up to 32 bytes) that is the name of the representative 
     */
    struct Representative {
        string name;
        uint voteCount;
    }


    // State variable that stores a `Voter` struct for each possible address
    mapping(address => Voter) public voters;
    // Address of the user that creates the ballot
    address public chairperson;
    // List of all voters
    address[] public voterAddress;
    // Dynamically-sized array of `Representative` structs
    Representative[] public representatives;
    // Number of people who already voted
    uint public nbrVotes;
    // Logs the account that call the function
    event MessageSender(address sender, string representativeName);

    /**
     * Creates a new ballot with all the representative. Each representatives are added to the 
     * list of representative `representatives`. The address of the chairperson is also assigned in the creator.
     *
     * @param representativeNames - Array of hexadecimal strings (up to 32 bytes) that contains the name of all the ballot's representatives
     */
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

    /**
     * Gives a user the right to vote on this ballot. Only the `chairperson` can give this right to user that don't have the rights to vote
     *
     * @param voter - Address of the user that will become a new voter in the ballot
     */
    function giveRightToVote(address voter) external {
        require(msg.sender == chairperson, "Only chairperson can give right to vote");
        require(voters[voter].weight == 0, "The user is already a voter");

        voters[voter].weight = 1;
        voterAddress.push(voter);
    }

    /**
     * Sets the status of a voter that give is vote to a representative.
     * Confirm that the sender hasn't voted or has the right to vote. Add the amount of vote of the sender to the requested representative.
     * If the representative is out of the range of the array, the vote will be revert.
     *
     * @param representativeIndex - Index of the representative that the voter wants to vote for
     */
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

    /**
     * Delegates the vote a voter to another voter. The voter who delegates his vote need to have the right to vote, to have not yet voted or
     * to not delegate to himself the vote. The delegated voter should have the rights to vote. If he already voted, the new vote will be added
     * directly to the representative. Otherwise, the delegated voter get a new vote that he can give to any representative.
     * 
     * Important: Using while is dangerous as they run for a long time, they might nedd a lot of gas than is available in a block.
     * In this case, the delegation will not be executed, but in other situations, such loops might cause a contract to get "stuck" completely.
     *
     * @param to - Address of the user that gets the new vote
     */
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

    /**
     * Searches for the index of the representative who is winning the election. It takes into account all previous votes to determine the winner.
     *
     * @return winningRepresentative_ - Index in the representatives list of the representative who won
     */
    function winningRepresentative() private view returns (uint winningRepresentative_) {
        uint winningVoteCount = 0;
        for (uint p = 0; p < representatives.length; p++) {
            if (representatives[p].voteCount > winningVoteCount) {
                winningVoteCount = representatives[p].voteCount;
                winningRepresentative_ = p;
            }
        }
    }

    /**
     * Gives the name of the representative who is winning the election by getting the index of the winner with the function 
     * `winningRepresentative()`. If no one has voted yet, return an error.
     *
     * @return winnerName_ - Name of the winning representative
     */
    function winningName() external view returns (string memory winnerName_) {
        require(nbrVotes > 0, "No one has voted yet");
        winnerName_ = representatives[winningRepresentative()].name;
    }

    /**
     * Gives the name of the representative who won the election. If there are no majority, return an error.
     *
     * @return - Name of the representative who won the election
     */
    function winnerName() external view returns (string memory) {
        require(nbrVotes > 0, "No one has voted yet");
        uint leadingRepresentative = winningRepresentative();
        require(representatives[leadingRepresentative].voteCount > (voterAddress.length/2), "Not enough votes");
        return representatives[leadingRepresentative].name;
    }

    /**
     * Getter function to retrieve the details on a specific voter
     *
     * @param addr - address of the voter which we want details
     * @return voterDetails - Details on the voter
     */
    function getVoterDetails(address addr) public view returns(Voter memory) {
        Voter memory voterDetails = voters[addr];
        return voterDetails;
    }

    /**
     * Getter function to retrieve the address of the ballot's creator
     *
     * @return chairperson - Address of the user that created the ballot
     */
    function getChairperson() public view returns(address) {
        return chairperson;
    }

    /**
     * Getter function to retrieve the addresses of every voter
     *
     * @return voterAddress - List of every voter
     */
    function getVoterAddress() public view returns(address[] memory) {
        return voterAddress;
    }

    /**
     * Getter function to retrieve the details on each Representatives
     *
     * @return representatives - List of each representatives
     */
    function getRepresentatives() public view returns(Representative[] memory) {
        return representatives;
    }
}