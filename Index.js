require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const authRoute = require("./Router/AuthRouter");
const goalRouter = require("./Router/GoalRouter");
const errorMiddleware = require("./Middlewares/errormiddleware");

// API Routes
app.use("/api/auth", authRoute);
app.use("/api/goals", goalRouter);

// Root Route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Error Middleware
app.use(errorMiddleware);

// MongoDB connection
const PORT = process.env.PORT || 8000;
const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/microproject";

mongoose.connect(MONGO_URL)
.then(() => {
  console.log("MongoDB Connected Successfully ✅");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} 🚀`);
  });
})
.catch((err) => {
  console.error("MongoDB Connection Failed ❌", err.message);
});