// server.js
import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";
import aiRoutes from "./aiRoutes.js";


dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// Use AI routes
app.use("/api/ai", aiRoutes);


// MongoDB connection - URI in -> .env file
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) =>
    console.error("❌ MongoDB connection error: please try again later", err)
  );


// Schema
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true },
  password: String,
});
const User = mongoose.model("User", userSchema);


// User Account Registration 
app.post("/api/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    // Validate inputs
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ error: "Passwords do not match" });
    }

    // Check if email already exists BEFORE hashing or creating user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);

    // Use try/catch only around User.create to catch MongoDB errors separately
    try {
      await User.create({ firstName, lastName, email, password: hashedPassword });
      return res.status(201).json(
        { message: "User registered successfully" },
      );
    } catch (mongoErr) {
      console.error("❌ MongoDB error during registration:", mongoErr);
      return res.status(500).json({ error: "Failed to create user" });
    }

  } catch (err) {
    console.error("❌ Registration error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});


// Login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Return token AND user info
    res.json({ 
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Token verification
app.get("/api/me", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Missing token" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    res.json({ id: decoded.id });
  });
});

// Root test route
app.get("/", (req, res) => {
  res.send("🚀 Backend is running!");
});

// Start server
app.listen(5050, () => console.log("🚀 Backend running on port 5050"));
