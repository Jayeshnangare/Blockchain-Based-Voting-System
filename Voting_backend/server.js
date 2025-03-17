const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const voterRoutes = require("./Routes/voterRoutes");

const cors = require("cors");


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

console.log("✅ Voter routes registered");

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://192.168.0.103:${PORT}`));
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
