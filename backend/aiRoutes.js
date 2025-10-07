import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper to safely get GPT content
const extractContent = (choice) => {
  return (
    choice?.message?.content?.trim() ||
    choice?.content?.[0]?.text?.trim() ||
    null
  );
};

router.post("/", async (req, res) => {
  try {
    const { type, prompt } = req.body;
    console.log("🛰️ [AI Route] Incoming request:", { type, prompt });

    if (!prompt) return res.status(400).json({ error: "Prompt is required" });
    if (!type) return res.status(400).json({ error: "Type is required" });

    // --- TEXT ---
    if (type === "text") {
      const response = await openai.chat.completions.create({
        model: "gpt-4",  // ✅ Fallback to gpt-4 for broader access
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt },
        ],
        max_tokens: 1000,
      });

      console.log("🔍 [TEXT] Raw OpenAI response:", JSON.stringify(response, null, 2));

      const output = extractContent(response.choices?.[0]);
      if (!output) {
        return res.json({ type: "text", result: "❌ Model returned no content." });
      }
      return res.json({ type: "text", result: output });
    }

    // --- IMAGE ---
    if (type === "image") {
      const result = await openai.images.generate({
        model: "dall-e-3",
        prompt,
        size: "1024x1024",
      });

      console.log("🖼️ [IMAGE] Raw OpenAI response:", result);

      const imageUrl = result.data?.[0]?.url;
      if (!imageUrl) {
        return res.status(500).json({ error: "Image failed to generate" });
      }
      return res.json({ type: "image", imageUrl });
    }

    // --- UI (React JSX generation) ---
    if (type === "ui") {
      // Step 1: Prepare the GPT prompt
      const uiPrompt = `
    You are a professional React developer. Generate a single functional React component named "GeneratedUI" based on the user's requirements:

    USER REQUIREMENTS:
    "${prompt}"

    RULES:
    - Output ONLY ONE React functional component named GeneratedUI.
    - Wrap all JSX in a single root element (use <div> if needed).
    - Include mock interactivity (buttons, forms, lists, useState, etc.) inside the component only.
    - Use Tailwind CSS for all styling.
    - Use proper JSX syntax: all attributes in quotes, onClick handlers as arrow functions, no dangling commas, no multiple top-level elements.
    - Do NOT include import/export statements (we will wrap it ourselves), markdown, or explanations.
    - Output only JSX code of the component (no extra text).
    - Wrap the return value in parentheses for multi-line JSX.
    `;

      // Step 2: Call OpenAI
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a professional React developer who writes clean JSX code only." },
          { role: "user", content: uiPrompt },
        ],
        max_tokens: 1500,
      });

      console.log("🧠 [UI] Raw OpenAI response:", JSON.stringify(response, null, 2));

      // Step 3: Extract GPT output
      let code = extractContent(response.choices?.[0]);
      if (!code) {
        return res.json({ type: "text", result: "❌ UI generation failed. No code returned." });
      }

      // Step 4: Clean up code
      code = code.replace(/```jsx?/gi, "").replace(/```/g, "").trim();

      // Wrap multi-line JSX in parentheses
      if (!code.startsWith("(") && code.includes("\n")) {
        code = `(${code})`;
      }

      // Ensure single root element
      if (!code.startsWith("<") || !code.endsWith(">")) {
        code = `(<div>${code}</div>)`;
      }

      // Wrap in default export for react-live
      if (!/export\s+default\s+function\s+GeneratedUI/.test(code)) {
        code = `
        export default function GeneratedUI() {
          return ${code};
        }
            `;
      }

      // Step 5: Return sanitized code
      return res.json({ type: "ui", code });
    }


    return res.status(400).json({ error: "Invalid type. Use text | image | ui." });

  } catch (error) {
    console.error("❌ [AI Route Error]:", error.response?.data || error.message);
    return res.status(500).json({ error: "AI request failed" });
  }
});

export default router;
