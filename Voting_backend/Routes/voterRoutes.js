const express = require("express");
const Voter = require("../Models/Voter.js");
const blockchain = require("../Blockchain/blockchain.js");

const router = express.Router();


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

module.exports = router;
