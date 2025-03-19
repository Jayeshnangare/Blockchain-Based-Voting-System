const mongoose = require("mongoose");

const CandidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  party: { type: String, required: true },
  city: { type: String, required: true },
  district: { type: String, required: true },
  state: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  aadhar: { type: String, unique: true },
}, { timestamps: true });

module.exports = mongoose.model("Candidate", CandidateSchema);
