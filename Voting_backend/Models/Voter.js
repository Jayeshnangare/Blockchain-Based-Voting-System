const mongoose = require("mongoose");

const VoterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    state: { type: String, required: true },
    district: { type: String, required: true },
    city: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    voter_id: { type: String, unique: true }, // Block hash from Blockchain
    
    otp: { type: String, default: "000000" },

    // Store OTP expiry with a past date as a dummy value
    otpExpiry: { type: Date, default: new Date(0) } // January 1, 1970
});

module.exports = mongoose.model("Voter", VoterSchema);
