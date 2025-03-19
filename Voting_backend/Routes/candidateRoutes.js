const express = require("express");
const Candidate = require("../Models/Candidate.js");

const router = express.Router();

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
  
      res.status(201).json({ message: "Candidate added successfully!", candidate: newCandidate });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error });
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