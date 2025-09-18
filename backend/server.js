import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI);

// Schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String, 
});
const User = mongoose.model("User", userSchema);

// Register form
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Checks if password and confirmPassword match 
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }
    
    // Checks if email already in use 
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // save the hashed password for security
    await User.create({ name, email, password: hashedPassword });

    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Login
//Inputs: Email and Password 
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.sendStatus(401);
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.sendStatus(401);
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// Start server
app.listen(5050, () => console.log("🚀 Backend running on port 5050"));
