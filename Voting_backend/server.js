const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const voterRoutes = require("./Routes/voterRoutes");
const candidateRoutes = require("./Routes/candidateRoutes");
const votingEventRoutes = require("./Routes/VotingEventRoutes");

const cors = require("cors");


//const Web3 = require("web3");
const contractABI = require("D:/Blockchain-Based-Voting-System/Voting_frontend/build/contracts/Voting.json");  // ABI from Truffle
const contractAddress = "0x6754Cf3c8fB41A7205a8D02D4674EAa15FD63bea";  // Change to your deployed contract address

const { Web3 } = require("web3");  // Web3.js v4 requires destructuring

const web3 = new Web3("http://127.0.0.1:7545");


//const votingContract = new web3.eth.Contract(contractABI, contractAddress);
const votingContract = new web3.eth.Contract(contractABI.abi, contractAddress);


// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
app.use(express.json()); // Ensure JSON parsing
app.use(express.urlencoded({ extended: true })); // Handle URL-encoded data

app.use(cors({
    origin: "*", // Allow requests from any origin (for development)
    methods: "GET,POST",
    allowedHeaders: "Content-Type"
}));


// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Routes
app.use("/api/voters", voterRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/voting-events", votingEventRoutes);

console.log("✅ Voter routes registered");

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://192.168.0.103:${PORT}`));
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
