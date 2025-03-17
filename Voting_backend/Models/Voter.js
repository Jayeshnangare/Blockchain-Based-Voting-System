const mongoose = require("mongoose");

const VoterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    state: { type: String, required: true },
    district: { type: String, required: true },
    city: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    voter_id: { type: String, unique: true }, // Block hash from Blockchain
});

module.exports = mongoose.model("Voter", VoterSchema);
