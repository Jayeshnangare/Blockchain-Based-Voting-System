const mongoose = require("mongoose");
const Web3 = require("web3");
const Voter = require("../models/voterModel"); // MongoDB Voter Model
const Candidate = require("../models/candidateModel"); // MongoDB Candidate Model
const { abi, contractAddress } = require("../blockchain/contractConfig"); // Import Smart Contract Details

// Connect to Ganache (Ensure it's running)
const web3 = new Web3("http://127.0.0.1:7545");

// Load Smart Contract
const votingContract = new web3.eth.Contract(abi, contractAddress);

// ✅ Voter casts a vote
exports.castVote = async (req, res) => {
    try {
        const { voterID, candidateAadhar } = req.body;

        // 🔹 Validate Voter
        const voter = await Voter.findOne({ uniqueVoterID: voterID });
        if (!voter) {
            return res.status(404).json({ error: "Voter not found" });
        }
        if (voter.hasVoted) {
            return res.status(400).json({ error: "Voter has already voted" });
        }

        // 🔹 Validate Candidate
        const candidate = await Candidate.findOne({ aadharID: candidateAadhar });
        if (!candidate) {
            return res.status(404).json({ error: "Candidate not found" });
        }

        // 🔹 Fetch Blockchain Account
        const accounts = await web3.eth.getAccounts();
        const adminAccount = accounts[0]; // Ensure this is correct

        // 🔹 Call Smart Contract to Cast Vote
        await votingContract.methods.vote(voterID, candidateAadhar).send({ from: adminAccount });

        // 🔹 Mark Voter as Voted in MongoDB
        voter.hasVoted = true;
        await voter.save();

        return res.json({ message: "Vote cast successfully on blockchain!" });

    } catch (error) {
        console.error("Voting Error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// ✅ Get election results
exports.getResults = async (req, res) => {
    try {
        const { state, district, city } = req.query;

        // Fetch candidates from MongoDB based on state, district, city
        const candidates = await Candidate.find({ state, district, city });

        if (!candidates.length) {
            return res.status(404).json({ error: "No candidates found in this location" });
        }

        // Get vote counts from blockchain
        const { 0: candidateIds, 1: votes } = await votingContract.methods.getResults().call();

        // Map votes to candidates
        const results = candidates.map((candidate) => {
            const index = candidateIds.indexOf(candidate.aadharID);
            return {
                name: candidate.name,
                city: candidate.city,
                votes: index !== -1 ? parseInt(votes[index]) : 0,
            };
        });

        res.json(results);
    } catch (error) {
        console.error("Error fetching results:", error);
        res.status(500).json({ error: "Server error" });
    }
};
