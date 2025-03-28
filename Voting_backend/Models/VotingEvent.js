const mongoose = require("mongoose");

const VotingEventSchema = new mongoose.Schema({
  state: { type: String, required: true },
  district: { type: String, required: true },
  city: { type: String, required: true },
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
}, { timestamps: true });

const VotingEvent = mongoose.model("VotingEvent", VotingEventSchema);
module.exports = VotingEvent;
