# Clarity ✦
**Turn Overthinking Into One Clear Step.**

A minimal AI tool that converts emotionally overloaded thoughts into a structured summary, one next action, and an optional reframe. Built with React, Node.js/Express, and Groq AI (free tier).

---

## What This Demonstrates

| Concern | Implementation |
|---|---|
| Product thinking | Single focused purpose, no feature bloat |
| Structured AI output | Parsed, labeled response fields |
| Safety guardrails | Keyword detection before any AI call |
| Trust calibration | Fallback message if API fails, timeout handling |
| Error handling | Graceful states for timeout, rate limit, API failure |
| Clean UX | Calm typography, minimal palette, mobile responsive |
| Speed-first | Groq LLaMA 3.3 model, 20s timeout, stateless requests |
| Production realism | Rate limiting, env vars, health check endpoint |

---

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **AI:** LLaMA 3.3 70B (free tier, no credit card required)

---

## File Structure

```
clarity/
├── .env                        ← your Groq API key (never commit this)
├── .gitignore
├── package.json                ← server dependencies
├── test-groq.js                ← run this first to test your API key
│
├── server/
│   ├── server.js
│   ├── routes/
│   │   └── clarity.js          ← main AI route
│   └── utils/
│       ├── safetyCheck.js      ← crisis keyword detection
│       └── promptBuilder.js    ← AI prompt
│
└── client/
    ├── index.html
    ├── package.json            ← frontend dependencies
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── styles.css
        └── components/
            ├── InputForm.jsx
            └── ResultCard.jsx
```

---

## Setup (Local Development)

### Step 1 — Get a free Groq API key
1. Go to **console.groq.com**
2. Sign up (Google login works, no credit card needed)
3. Click **API Keys** → **Create API Key**
4. Copy the key

### Step 2 — Create your .env file
Create a file called `.env` in the root `clarity/` folder:
```
GROQ_API_KEY=paste-your-key-here
NODE_ENV=development
PORT=3001
```

### Step 3 — Install dependencies
```bash
# In the clarity/ root folder:
npm install

# Then in the client/ folder:
cd client && npm install && cd ..
```

### Step 4 — Test your API key first
```bash
node test-groq.js
```
You should see `=== TEST PASSED ===`. Fix the key before continuing if not.

### Step 5 — Run the app (two terminals)

**Terminal 1 — backend:**
```bash
node server/server.js
```
Should show:
```
[clarity] Server running on port 3001
[clarity] Groq API key loaded OK.
```

**Terminal 2 — frontend:**
```bash
cd client && npm run dev
```
Open: http://localhost:5173

---

## Deployment (Render — free)

1. Push to GitHub (make sure `.env` is in `.gitignore` — it is by default)
2. Go to render.com → New → Web Service → connect your repo
3. Configure:
   - **Build Command:** `npm install && cd client && npm install && npm run build`
   - **Start Command:** `NODE_ENV=production node server/server.js`
4. Add environment variable in Render dashboard:
   - `GROQ_API_KEY` = your key
   - `NODE_ENV` = production
5. Click Deploy

---

## Design Decisions?

**Stateless:** No database = no user data to breach, zero maintenance, perfect privacy.

**Safety check before AI:** An LLM is not a crisis resource. We intercept before any AI call.

**Fallback on failure:** If the API times out, users get a calm generic message instead of a blank error.

**Groq free tier**: llama-3.3-70b-versatile is fast, capable, and costs nothing.