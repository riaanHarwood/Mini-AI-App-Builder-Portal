// aiRoutes.js
import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


// ---- FOR TEXT GENERATION ----
router.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ output: response.choices[0].message.content });
  } catch (error) {
    console.error("❌ Error generating text:", error.response?.data || error.message || error);
    res.status(500).json({ error: "Text generation failed" });
  }
});

// ---- FOR IMAGE GENERATION ----
router.post("/generate-image", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    const result = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      size: "1024x1024",
    });

    // Check the response structure
    const imageUrl = result.data?.[0]?.url;
    if (!imageUrl) {
      console.error("No image URL found in OpenAI response", result);
      return res.status(500).json({ error: "Image failed to generate" });
    }

    res.json({ imageUrl });
  } catch (error) {
    console.error("❌ Error generating image:", error.response?.data || error.message || error);
    res.status(500).json({ error: "Something went wrong generating the image" });
  }
});

export default router;
