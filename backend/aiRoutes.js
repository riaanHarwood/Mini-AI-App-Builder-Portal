import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";


dotenv.config();
const router = express.Router();

// Note: This initialize's OpenAI client
const openai = new OpenAI({
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
// Image generation route: DALL·E 3

router.post("/generate-image", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // Call OpenAI image API — URL is returned by default
    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
    });

    console.log("OpenAI response:", result);

    if (result && result.data && result.data.length > 0) {
      return res.json({ imageUrl: result.data[0].url });
    } else {
      return res.status(500).json({ error: "Image failed to generate" });
    }
  } catch (error) {
    console.error("Error generating image:", error);
    return res.status(500).json({
      error: error.message || "Something went wrong generating the image",
    });
  }
});



export default router;


