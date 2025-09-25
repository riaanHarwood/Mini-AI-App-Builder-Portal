// backend/server.js
//Note to self: 
//The server.js file is the backend production of the app. This store all the functionality and logic  
//for the app + API keys (using OpenAI GPT4o + DALL·E 3) --> refer to aiRoutes.js 

import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import aiRoutes from "./aiRoutes.js";




dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
//OpenAI AI API integration
// Use the AI routes
app.use("/api/ai", aiRoutes);


// Connect App to MongoDB server 
//Note: 
//Mongoose is a library for MongoDB and Node.JS 
//It provides a solution for modelling data and connecting the app to MongoDB database 
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error: please try again later", err));

// Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});
const User = mongoose.model("User", userSchema);



// Chat Page
// Need to implement logic here still 





// Registeration Page
app.post("/api/register", async (req, res) => {
  try { //variables to check 
    const { name, email, password, confirmPassword } = req.body;
    //conditional checks
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match, please re-enter the password" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login Page
//api route for verifying user authentication 
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required" });

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// Optional 1: To verify token endpoint - Valid/Invalid
app.get("/api/me", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Missing token" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    res.json({ id: decoded.id });
  });
});

// Start server
app.listen(5050, () => console.log("🚀 Backend running on port 5050"));


// For Testing Purposes** 
app.get("/", (req, res) => {
  res.send("🚀 Backend is running!");
});