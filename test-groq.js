// test-groq.js — run this to verify your Groq key works
// Command: node test-groq.js

require("dotenv").config();
const Groq = require("groq-sdk");

console.log("=== Groq API Test ===");
console.log("API Key:", process.env.GROQ_API_KEY
  ? `Found (starts with: ${process.env.GROQ_API_KEY.slice(0, 8)}...)`
  : "MISSING — check your .env file!");

if (!process.env.GROQ_API_KEY) {
  console.error("ERROR: Add GROQ_API_KEY=your-key to your .env file");
  process.exit(1);
}

async function test() {
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    console.log("✓ Groq SDK initialized");

    console.log("Sending test message...");
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You respond in exactly one sentence." },
        { role: "user",   content: "Say hello and confirm you are working." },
      ],
      max_tokens: 50,
    });

    const text = completion.choices[0]?.message?.content;
    console.log("✓ Response received:");
    console.log(text);
    console.log("\n=== TEST PASSED — Groq is working! ===");
  } catch (err) {
    console.error("✗ TEST FAILED");
    console.error("Error:", err.message);
    if (err.status === 401) {
      console.error("→ Invalid API key. Go to console.groq.com and create a new one.");
    } else if (err.status === 429) {
      console.error("→ Rate limited. Wait 1 minute and try again.");
    } else {
      console.error("→ Full error:", JSON.stringify(err, null, 2));
    }
  }
}

test();