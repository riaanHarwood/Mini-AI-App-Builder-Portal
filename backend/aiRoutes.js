import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper to safely get GPT-5 content
const extractContent = (choice) => {
  return (
    choice?.message?.content?.trim() ||
    choice?.content?.[0]?.text?.trim() ||
    "No response"
  );
};

router.post("/", async (req, res) => {
  try {
    const { type, prompt } = req.body;

    if (!prompt) return res.status(400).json({ error: "Prompt is required" });
    if (!type) return res.status(400).json({ error: "Type is required" });

    // --- TEXT ---
    if (type === "text") {
      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt },
        ],
        max_completion_tokens: 1000,
      });

      const output = extractContent(response.choices?.[0]);
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
      if (!imageUrl) return res.status(500).json({ error: "Image failed to generate" });
      return res.json({ type: "image", imageUrl });
    }

    // --- UI (React JSX generation) ---
    if (type === "ui") {
      const uiPrompt = `
You are a React developer. Generate a single functional React component in JSX for the following app idea:

"${prompt}"

Requirements:
- Component name: GeneratedUI
- Use Tailwind CSS for styling (no imports)
- Include mock interactivity (buttons, forms, state)
- RETURN ONLY JSX. NO EXPLANATIONS OR MARKDOWN.
`;

      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          { role: "system", content: "You are a React UI code generator." },
          { role: "user", content: uiPrompt },
        ],
        max_completion_tokens: 1500,
      });

      const code = extractContent(response.choices?.[0]);
      return res.json({ type: "ui", code });
    }

    return res.status(400).json({ error: "Invalid type. Use text | image | ui." });

  } catch (error) {
    console.error("❌ AI route error:", error.response?.data || error.message);
    res.status(500).json({ error: "AI request failed" });
  }
});

export default router;
