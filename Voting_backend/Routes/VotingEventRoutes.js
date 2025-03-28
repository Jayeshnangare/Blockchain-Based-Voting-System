const express = require("express");
const router = express.Router();
const VotingEvent = require("../Models/VotingEvent.js");
const Voter = require('../Models/Voter.js')



// Create Voting Event
router.post("/create", async (req, res) => {
  try {
    const { state, district, city, date, startTime, endTime } = req.body;

    // Validate input data
    if (!state?.trim() || !district?.trim() || !city?.trim() || !date || !startTime || !endTime) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Validate date format
    const eventDate = new Date(date);
    if (isNaN(eventDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    // Check if an event already exists for the given location and date
    const existingEvent = await VotingEvent.findOne({ state, district, city, date: eventDate });
    if (existingEvent) {
      return res.status(409).json({ error: "A voting event already exists for this city on the selected date." });
    }

    // Create and store event
    const newEvent = new VotingEvent({
      state: state.trim(),
      district: district.trim(),
      city: city.trim(),
      date: eventDate,
      startTime,
      endTime,
    });

    await newEvent.save();
    res.status(201).json({ message: "Voting event created successfully", event: newEvent });

  } catch (error) {
    console.error("Error creating voting event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get All Voting Events
router.get("/", async (req, res) => {
  try {
    const events = await VotingEvent.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});


// Backend: Express API for retrieving voting event details based on voter ID
// API to fetch voting event details based on voter ID
router.get("/voting-id/:voterID", async (req, res) => {
  try {
    const { voterID } = req.params;
    console.log(voterID)
    console.log(typeof voterID)
    // Fetch voter details
    const voter = await Voter.findOne({ voter_id: voterID });
    if (!voter) {
      return res.status(404).json({ message: "Voter not found" });
    }

    // Fetch voting event for the voter's city
    const event = await VotingEvent.findOne({ city: voter.city });
    
    if (!event) {
      return res.status(404).json({ message: "No voting event available for your city." });
    }

    res.json({
      city: event.city,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
    });
  } catch (error) {
    console.error("Error fetching voting event details:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

module.exports = router;

