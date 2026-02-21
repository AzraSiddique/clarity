require("dotenv").config();
const express = require("express");
const path = require("path");
const rateLimit = require("express-rate-limit");

const clarityRouter = require("./routes/clarity");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json({ limit: "50kb" }));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "RATE_LIMITED" },
  skip: (req) => req.path === "/health",
});

app.use("/api", limiter);
app.use("/api/clarity", clarityRouter);

app.get("/health", (req, res) => res.json({ status: "ok" }));

if (process.env.NODE_ENV === "production") {
  const clientDist = path.join(__dirname, "../client/dist");
  app.use(express.static(clientDist));
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`[clarity] Server running on port ${PORT}`);
  if (!process.env.GEMINI_API_KEY) {
    console.warn("[clarity] WARNING: GEMINI_API_KEY is not set.");
  }
});