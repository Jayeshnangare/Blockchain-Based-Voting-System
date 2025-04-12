const express = require("express");
const Candidate = require("../Models/Candidate.js");

const router = express.Router();


//const Web3 = require("web3");
const contractABI = require("D:/Blockchain-Based-Voting-System/Voting_frontend/build/contracts/Voting.json"); // ABI from Truffle
const contractAddress = "0x43520CaD35b2d23f2a8d9538D63b775CA5A3BF6E";  // Change to your deployed contract address

const { Web3 } = require("web3");  // Web3.js v4 requires destructuring

const web3 = new Web3("http://127.0.0.1:7545");


//const votingContract = new web3.eth.Contract(contractABI, contractAddress);
const votingContract = new web3.eth.Contract(contractABI.abi, contractAddress);


router.post("/addCandidate", async (req, res) => {
  try {
      const { aadhar, name, state, district, city } = req.body;

      if (!aadhar || !name || !state || !district || !city) {
          return res.status(400).json({ message: "All candidate details are required" });
      }

      res.json({ message: "Candidate added successfully", transaction: tx });

  } catch (error) {
      console.error("Error adding candidate:", error);
      res.status(500).json({ message: "Error adding candidate", error: error.message });
  }
});

/** 🟢 Create a Candidate */
router.post("/add", async (req, res) => {
    try {
      const { name, party, city, district, state, phone, aadhar } = req.body;
      
      // Check if candidate already exists
      const existingCandidate = await Candidate.findOne({ phone });
      if (existingCandidate) {
        return res.status(400).json({ message: "Candidate already exists!" });
      }
  
      const newCandidate = new Candidate({ name, party, city, district, state, phone, aadhar });
      await newCandidate.save();

      const accounts = await web3.eth.getAccounts();
      const sender = accounts[0]; // Admin account

      // Call the Solidity function to add a single candidate
      const tx = await votingContract.methods.addCandidate(
          parseInt(aadhar, 10), name, state, district, city
      ).send({ from: sender, gas: 3000000 });

      console.log("Candidate added successfully:", tx);
  
      res.status(201).json({ message: "Candidate added successfully!", candidate: newCandidate });
    } catch (error) {
      console.error("Add Candidate Error:", error); // 👈 add this line
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  });
  
  /** 🟢 Get All Candidates */
  router.get("/all", async (req, res) => {
    try {
      const candidates = await Candidate.find();
      res.status(200).json(candidates);
    } catch (error) {
      res.status(500).json({ message: "Server Error", error });
    }
  });
  
  /** 🟢 Get Candidates by City */
  router.get("/city/:city", async (req, res) => {
    try {
      const { city } = req.params;
      const candidates = await Candidate.find({ city });
  
      if (!candidates.length) {
        return res.status(404).json({ message: "No candidates found in this city." });
      }
  
      res.status(200).json(candidates);
    } catch (error) {
      res.status(500).json({ message: "Server Error", error });
    }
  });
  
  /** 🟢 Get Candidates by State */
  router.get("/state/:state", async (req, res) => {
    try {
      const { state } = req.params;
      const candidates = await Candidate.find({ state });
  
      if (!candidates.length) {
        return res.status(404).json({ message: "No candidates found in this state." });
      }
  
      res.status(200).json(candidates);
    } catch (error) {
      res.status(500).json({ message: "Server Error", error });
    }
  });
  
  /** 🟢 Get Candidates by State, District, and City */
  router.get("/filter", async (req, res) => {
    try {
      const { state, district, city } = req.query;
      
      let filter = {};
      if (state) filter.state = state;
      if (district) filter.district = district;
      if (city) filter.city = city;
  
      const candidates = await Candidate.find(filter);
  
      if (!candidates.length) {
        return res.status(404).json({ message: "No candidates found for the given criteria." });
      }
      
      res.status(200).json(candidates);
    } catch (error) {
      res.status(500).json({ message: "Server Error", error });
    }
  });
  
  /** 🟢 Delete Candidate */
  router.delete("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await Candidate.findByIdAndDelete(id);
      res.status(200).json({ message: "Candidate deleted successfully!" });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error });
    }
  });
  
  module.exports = router;