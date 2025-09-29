import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * ---- UNIFIED AI ENDPOINT ----
 * I've updated the AI API endpoint so that is Supports both image and text generation rather than calling -generate & -generate/image:
 *   type: "text"  → GPT-4o
 *   type: "image" → DALL·E 3
 */
router.post("/", async (req, res) => {
  try {
    const { type, prompt } = req.body;

    if (!prompt) return res.status(400).json({ error: "Prompt is required" });
    if (!type) return res.status(400).json({ error: "Type is required (text | image)" });

    // --- TEXT ---
    if (type === "text") {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      const output = response.choices[0]?.message?.content || "No response from AI";
      return res.json({ type: "text", result: output });
    }

    // --- IMAGE ---
    if (type === "image") {
      const result = await openai.images.generate({
        model: "dall-e-3",
        prompt,
        size: "1024x1024",
      });

      const imageUrl = result.data?.[0]?.url;
      if (!imageUrl) {
        console.error("No image URL found in OpenAI response", result);
        return res.status(500).json({ error: "Image failed to generate" });
      }

      return res.json({ type: "image", imageUrl });
    }

    // --- INVALID TYPE ---
    return res.status(400).json({ error: "Invalid type. Use 'text' or 'image'." });

  } catch (error) {
    console.error("❌ Error in unified AI route:", error.response?.data || error.message || error);
    res.status(500).json({ error: "AI request failed" });
  }
});

export default router;
