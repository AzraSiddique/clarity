const express = require("express");
const Groq = require("groq-sdk");
const { isCrisisInput } = require("../utils/safetyCheck");
const { buildPrompt } = require("../utils/promptBuilder");

const router = express.Router();

const API_KEY = process.env.GROQ_API_KEY;
if (!API_KEY) {
  console.error("[clarity] FATAL: GROQ_API_KEY is not set in your .env file");
}

const groq = new Groq({ apiKey: API_KEY });
const API_TIMEOUT_MS = 20000;

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

  const result = {
    summary:  get("Summary")   || "Couldn't parse summary.",
    nextStep: get("Next Step") || "Take one small step today.",
    reframe:  get("Reframe")  || null,
  };

  console.log("[clarity] Parsed result:", result);
  return result;
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

  console.log("[clarity] Calling Groq API...");

  try {
    const completion = await Promise.race([
      groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: system },
          { role: "user",   content: userMessage },
        ],
        max_tokens: 200,
        temperature: 0.9,
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("TIMEOUT")), API_TIMEOUT_MS)
      ),
    ]);

    const rawText = completion.choices[0]?.message?.content || "";
    const parsed = parseResponse(rawText);

    return res.status(200).json(parsed);

  } catch (err) {
    console.error("[clarity] ===== API ERROR =====");
    console.error("[clarity] Message:", err.message);
    console.error("[clarity] ======================");

    if (err.message === "TIMEOUT") {
      console.warn("[clarity] Timed out — serving fallback");
      return res.status(200).json({ ...FALLBACK_CLARITY, _fallback: true });
    }

    console.warn("[clarity] API error — serving fallback. Error:", err.message);
    return res.status(200).json({ ...FALLBACK_CLARITY, _fallback: true });
  }
});

module.exports = router;