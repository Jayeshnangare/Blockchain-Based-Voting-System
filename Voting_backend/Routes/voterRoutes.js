const express = require("express");
const Voter = require("../Models/Voter.js");
const blockchain = require("../Blockchain/blockchain.js");
const Candidate = require("../Models/Candidate.js");

const twilio = require("twilio");
const router = express.Router();

const dotenv = require("dotenv");
dotenv.config(); // Load .env file
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);


//const Web3 = require("web3");
const contractABI = require("D:/Blockchain-Based-Voting-System/Voting_frontend/build/contracts/Voting.json");  // ABI from Truffle
const contractAddress = "0x43520CaD35b2d23f2a8d9538D63b775CA5A3BF6E";  // Change to your deployed contract address

const { Web3 } = require("web3");  // Web3.js v4 requires destructuring

const web3 = new Web3("http://127.0.0.1:7545");


//const votingContract = new web3.eth.Contract(contractABI, contractAddress);
const votingContract = new web3.eth.Contract(contractABI.abi, contractAddress);



router.get('/test', (req, res) => {
    res.json({ message: 'Voter routes working!' });
});

// Register a voter
router.post("/register", async (req, res) => {
  try {

    console.log("Incoming Request Data:", req.body);

    const { name, age, state, district, city, phone } = req.body;

    if (!name || !age || !state || !city  || !district  || !phone) {
        console.log("❌ Missing fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingVoter = await Voter.findOne({ phone });
    if (existingVoter) {
        console.log("❌ Voter already exists");
      return res.status(400).json({ message: "Voter already registered" });
    }

    // Create a blockchain block for the voter
    const voterDetails = { name, age, state, district, city};
    const voter_id = blockchain.createBlock(voterDetails);
    console.log("✅ Voter Block Created:", voter_id);

    // Store voter details in MongoDB
    const newVoter = new Voter({ name, age, state, city, district, phone, voter_id });
    await newVoter.save();
    console.log("✅ Voter saved to MongoDB");

    res.status(201).json({ message: "Voter registered successfully", voter_id });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/test-twilio", async (req, res) => {
  try {
    const message = await client.messages.create({
      body: "Test message from Twilio hello jayesh!",
      from: process.env.TWILIO_PHONE_NUMBER,
      to: "+917666066156" // Replace with your actual phone number
    });

    res.json({ message: "Twilio test message sent!", sid: message.sid });
  } catch (error) {
    res.status(500).json({ message: "Twilio test failed", error: error.message });
  }
});

router.post("/send-otp", async (req, res) => {
  let { voterID } = req.body;
  voterID = voterID.trim().replace(/\\$/, ""); 
  console.log("Received Voter ID:", voterID);
  console.log("Type of Voter ID:", typeof voterID);

  try {
    // ✅ Correct Query: Find voter using `voter_id`
   
    const voter = await Voter.findOne({ voter_id: voterID });

    console.log("Voter Query Result:", voter);

    if (!voter) {
      return res.status(404).json({ message: "Voter not found" });
    }

    // ✅ Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiry = new Date(Date.now() + 5 * 60000); // OTP expires in 5 minutes

    // ✅ Update OTP in the database
    await Voter.updateOne({ voter_id: voterID }, { otp, otpExpiry });

    console.log("Generated OTP:", otp);

    // ✅ Send OTP via Twilio SMS
    await client.messages.create({
      body: `Your OTP for voting is: ${otp} \nvalid for 5 min`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: "+91"+voter.phone,
    });

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

router.post('/verify-otp', async (req, res) => {
  const { voterID, otp } = req.body;

  console.log("Received Voter ID:", voterID);
  console.log("Type of Voter ID:", typeof voterID);

  try {
    const voter = await Voter.findOne({ voter_id: voterID });

    if (!voter) return res.status(404).json({ message: 'Voter not found' });

    if (!voter.otp || !voter.otpExpiry) return res.status(400).json({ message: 'OTP not requested' });

    if (new Date() > voter.otpExpiry) return res.status(400).json({ message: 'OTP expired' });

    if (voter.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

    // OTP verified, clear OTP fields
    await Voter.updateOne({ voter_id: voterID }, { $unset: { otp: 1, otpExpiry: 1 } });

    // ✅ Send voter details in response
    res.json({
      message: 'OTP verified successfully',
      voter: {
        _id: voter._id,
        name: voter.name,
        state: voter.state,
        city: voter.city,
        district: voter.district,
        age: voter.age,
      },
    });

  } catch (error) {
    res.status(500).json({ message: 'Error verifying OTP', error });
  }
});


router.post("/vote", async (req, res) => {
  try {
      const { voterAddress, candidateId } = req.body;

      if (!voterAddress || candidateId === undefined) {
          return res.status(400).json({ message: "Missing voterAddress or candidateId" });
      }

      const accounts = await web3.eth.getAccounts();
      const sender = accounts[0]; // Use an account from Ganache

      // Convert candidateId to a string if necessary
      //const candidateIdStr = candidateId.toString();

      const candidateIdInt = parseInt(candidateId, 10);

      // Ensure that Web3 method matches Solidity contract
      const tx = await votingContract.methods.vote(voterAddress, candidateIdInt).send({
        from: sender,
        gas: 3000000
    });

      console.log("Transaction successful:", tx);
      res.json({ 
        message: "Vote cast successfully", 
        transaction: JSON.parse(JSON.stringify(tx, (key, value) =>
            typeof value === "bigint" ? value.toString() : value
        ))
    });
    
  } catch (error) {
      console.error("Error in voting:", error);
      res.status(500).json({ message: "Error in voting", error: error.message });
  }
});


// Route to get voting results based on location
router.get("/results", async (req, res) => {
  try {
      const { state, district, city } = req.query;

      // Fetch candidates from database based on location
      const candidates = await Candidate.find({ state, district, city });
      console.log("candidate: "+ candidates);

      if (!candidates.length) {
          return res.status(404).json({ error: "No candidates found in this location." });
      }

      // Fetch vote results from the blockchain
      const { 0: candidateIds, 1: votes } = await votingContract.methods.getResults().call();

      // Map votes to candidates
      const results = candidates.map((candidate) => {
          const index = candidateIds.indexOf(candidate.aadhar);
          return {
              name: candidate.name,
              city: candidate.city,
              votes: index !== -1 ? parseInt(votes[index]) : 0,
          };
      });

      console.log(results);
      
      res.json(results);
  } catch (error) {
      console.error("Error fetching results:", error);
      res.status(500).json({ error: "Internal server error." });
  }
});


// Get all voters
router.get("/", async (req, res) => {
  try {
      const voters = await Voter.find(); // Fetch all voters from MongoDB
      res.json(voters);
  } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
  }
});


module.exports = router;
