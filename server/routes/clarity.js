const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { isCrisisInput } = require("../utils/safetyCheck");
const { buildPrompt } = require("../utils/promptBuilder");

const router = express.Router();

// Check the key exists at startup so you know immediately if it's missing
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("[clarity] FATAL: GEMINI_API_KEY is not set in your .env file");
}

const genAI = new GoogleGenerativeAI(API_KEY);
const API_TIMEOUT_MS = 15000; // 15 seconds — gemini-2.0-flash can be slow on free tier

const FALLBACK_CLARITY = {
  summary: "Something is weighing on you and it feels hard to see a path forward right now.",
  nextStep: "Write down the one thing that feels most urgent, then set it aside for 10 minutes.",
  reframe: "Clarity often comes from pausing, not from solving everything at once.",
};

function parseResponse(text) {
  console.log("[clarity] Raw AI response:\n", text);

  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  const get = (label) => {
    const line = lines.find((l) =>
      l.toLowerCase().startsWith(label.toLowerCase() + ":")
    );
    if (!line) return null;
    return line.slice(label.length + 1).trim();
  };

  return {
    summary:  get("Summary")   || "Couldn't parse summary.",
    nextStep: get("Next Step")  || "Take one small step today.",
    reframe:  get("Reframe")   || null,
  };
}

router.post("/", async (req, res) => {
  const { input } = req.body;

  if (!input || typeof input !== "string" || input.trim().length === 0) {
    return res.status(400).json({ error: "Input is required." });
  }

  const trimmed = input.trim();

  if (trimmed.length > 2000) {
    return res.status(400).json({ error: "Input is too long." });
  }

  if (isCrisisInput(trimmed)) {
    return res.status(200).json({ error: "CRISIS_DETECTED" });
  }

  const { system, userMessage } = buildPrompt(trimmed);

  console.log("[clarity] Calling Gemini API...");

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: system,
    });

    const response = await Promise.race([
      model.generateContent(userMessage),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("TIMEOUT")), API_TIMEOUT_MS)
      ),
    ]);

    const rawText = response.response.text();
    const parsed = parseResponse(rawText);

    console.log("[clarity] Parsed result:", parsed);
    return res.status(200).json(parsed);

  } catch (err) {
    console.error("[clarity] ===== API ERROR =====");
    console.error("[clarity] Message:", err.message);
    console.error("[clarity] Status:", err.status);
    console.error("[clarity] Full error:", JSON.stringify(err, null, 2));
    console.error("[clarity] ======================");

    if (err.message === "TIMEOUT") {
      console.warn("[clarity] Request timed out after 15s");
      return res.status(200).json({ ...FALLBACK_CLARITY, _fallback: true });
    }

    return res.status(502).json({
      error: `API error: ${err.message}`,
    });
  }
});

module.exports = router;