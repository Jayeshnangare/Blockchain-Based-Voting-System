const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const voterRoutes = require("./Routes/voterRoutes");

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
app.use(express.json()); // Ensure JSON parsing
app.use(express.urlencoded({ extended: true })); // Handle URL-encoded data

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Routes
app.use("/api/voters", voterRoutes);

console.log("✅ Voter routes registered");

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
