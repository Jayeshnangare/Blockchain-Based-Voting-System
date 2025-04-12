// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        uint256 aadharID;
        string name;
        string state;
        string district;
        string city;
    }

    mapping(uint256 => uint256) public candidateVotes;
    mapping(uint256 => Candidate) public candidates;
    mapping(string => bool) public hasVoted;
    uint256[] public candidateIds;

    event VoteCasted(string voterID, uint256 candidateAadhar, uint256 newVoteCount);

    function vote(string memory _voterID, uint256 _candidateAadhar) public {
        require(!hasVoted[_voterID], "Voter has already voted");

        candidateVotes[_candidateAadhar] += 1;
        hasVoted[_voterID] = true;

        emit VoteCasted(_voterID, _candidateAadhar, candidateVotes[_candidateAadhar]);
    }

    function getResults() public view returns (uint256[] memory, uint256[] memory) {
        uint256[] memory votes = new uint256[](candidateIds.length);
        for (uint256 i = 0; i < candidateIds.length; i++) {
            votes[i] = candidateVotes[candidateIds[i]];
        }
        return (candidateIds, votes);
    }

    // Function to add a single candidate
    function addCandidate(uint256 _aadharID, string memory _name, string memory _state, string memory _district, string memory _city) public {
        require(candidates[_aadharID].aadharID == 0, "Candidate already exists");

        candidates[_aadharID] = Candidate(_aadharID, _name, _state, _district, _city);
        candidateIds.push(_aadharID);

        emit CandidateAdded(_aadharID, _name, _city);
    }
}
