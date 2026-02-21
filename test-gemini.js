require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

console.log("Testing Gemini API...");
console.log("API Key:", process.env.GEMINI_API_KEY ? "Present" : "Missing");

try {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  console.log("✓ GoogleGenerativeAI initialized");

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: "You are a helpful assistant.",
  });
  console.log("✓ Model retrieved");

  model.generateContent("Hello, test")
    .then((response) => {
      console.log("✓ API call successful");
      console.log("Response:", response.response.text());
    })
    .catch((err) => {
      console.error("✗ API call failed:", err.message);
      console.error("Full error:", err);
    });
} catch (err) {
  console.error("✗ Initialization failed:", err.message);
  console.error("Full error:", err);
}
