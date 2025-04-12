// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        string name;
        string state;
        string district;
        string city;
        bool exists;
    }

    struct Vote {
        string voterID;
        uint256 candidateAadhar;
        uint256 voteCount;
    }

    mapping(uint256 => Candidate) public candidates; // Aadhar -> Candidate Info
    mapping(uint256 => uint256) public candidateVotes; // Aadhar -> Vote Count
    mapping(string => bool) public hasVoted; // Voter ID -> Has voted or not
    uint256[] public candidateIds; // List of all Aadhar IDs

    event CandidateAdded(uint256 aadhar, string name, string state, string district, string city);
    event VoteCasted(string voterID, uint256 candidateAadhar, uint256 newVoteCount);

    // ✅ Add a candidate
    function addCandidate(
        uint256 _aadhar,
        string memory _name,
        string memory _state,
        string memory _district,
        string memory _city
    ) public {
        require(!candidates[_aadhar].exists, "Candidate already exists");

        candidates[_aadhar] = Candidate(_name, _state, _district, _city, true);
        candidateIds.push(_aadhar);

        emit CandidateAdded(_aadhar, _name, _state, _district, _city);
    }

    // ✅ Cast vote
    function vote(string memory _voterID, uint256 _candidateAadhar) public {
        require(!hasVoted[_voterID], "Voter has already voted");
        require(candidates[_candidateAadhar].exists, "Candidate does not exist");

        candidateVotes[_candidateAadhar] += 1;
        hasVoted[_voterID] = true;

        emit VoteCasted(_voterID, _candidateAadhar, candidateVotes[_candidateAadhar]);
    }

    // ✅ Get all results
    function getResults() public view returns (uint256[] memory, uint256[] memory) {
        uint256[] memory votes = new uint256[](candidateIds.length);
        for (uint256 i = 0; i < candidateIds.length; i++) {
            votes[i] = candidateVotes[candidateIds[i]];
        }
        return (candidateIds, votes);
    }

    // ✅ Get candidate details + vote count
    function getCandidate(uint256 _aadhar) 
        public 
        view 
        returns (
            string memory name,
            string memory state,
            string memory district,
            string memory city,
            uint256 votes
        ) 
    {
        require(candidates[_aadhar].exists, "Candidate not found");
        Candidate memory c = candidates[_aadhar];
        return (c.name, c.state, c.district, c.city, candidateVotes[_aadhar]);
    }
}
