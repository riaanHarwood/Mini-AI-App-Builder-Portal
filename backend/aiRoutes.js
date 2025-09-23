import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";


dotenv.config();
const router = express.Router();

// Note: This initialize's OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


// Send a promopt to GPT-4o
// Text generation 

router.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({
      output: response.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});


// Image generation route: DALL·E 3
// Image Generation 

router.post("/generate-image", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await client.images.generate({
      model: "gpt-image-1", // DALL·E 3
      prompt,
      size: "1024x1024" 
    });

    res.json({
      imageUrl: response.data[0].url,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Image failed to generate" });
  }
});


export default router;