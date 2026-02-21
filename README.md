# Clarity ✦
**Turn Overthinking Into One Clear Step.**

A minimal, production-grade AI tool that converts emotionally overloaded thoughts into a structured summary, one next action, and an optional reframe.

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
| Speed-first | Claude Haiku model, 10s timeout, stateless requests |
| Production realism | Rate limiting, env vars, health check endpoint |

---

## Architecture

```
/
├── client/               # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx           # Root — state machine (idle/loading/result/error/crisis)
│   │   ├── components/
│   │   │   ├── InputForm.jsx     # Textarea + submit, char limit, loading state
│   │   │   └── ResultCard.jsx    # Structured result display + actions
│   │   └── styles.css        # Full design system, mobile responsive
│   ├── index.html
│   ├── vite.config.js        # Dev proxy → Express on :3001
│   └── package.json
│
├── server/               # Node.js + Express backend
│   ├── server.js             # App bootstrap, middleware, static serving
│   ├── routes/
│   │   └── clarity.js        # POST /api/clarity — main route
│   └── utils/
│       ├── safetyCheck.js    # Crisis keyword detection (no AI involved)
│       └── promptBuilder.js  # System prompt + message formatting
│
├── .env.example
├── .gitignore
└── package.json
```

### Request Flow

```
User input
  → Client validates (non-empty, char limit)
  → POST /api/clarity
  → Rate limiter (10 req/min/IP)
  → Input validation (length, type)
  → Safety check (regex patterns)
      ↓ CRISIS → return { error: "CRISIS_DETECTED" } — no AI call
      ↓ SAFE → build prompt → Claude API (10s timeout)
          ↓ SUCCESS → parse → { summary, nextStep, reframe }
          ↓ TIMEOUT → return fallback static message
          ↓ API ERROR → return 502 with generic message
```

---

## Local Development

### Prerequisites
- Node.js 18+
- Anthropic API key from [console.anthropic.com](https://console.anthropic.com)

### Setup

```bash
# 1. Clone / download the project
cd clarity

# 2. Set up environment variables
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

# 3. Install server dependencies
npm install

# 4. Install client dependencies
cd client && npm install && cd ..

# 5. Run backend (terminal 1)
npm run dev        # runs on port 3001

# 6. Run frontend (terminal 2)
cd client && npm run dev    # runs on port 5173, proxies /api to :3001
```

Open [http://localhost:5173](http://localhost:5173)

---

## Deployment

### Option A — Render (recommended, free tier)

Render can serve both frontend and backend from one service.

**Step 1 — Build the client locally or in CI**
```bash
cd client && npm install && npm run build
```
The built files land in `client/dist/`.

**Step 2 — Push to GitHub**
```bash
git init
git add .
git commit -m "initial"
git remote add origin https://github.com/yourname/clarity.git
git push -u origin main
```

**Step 3 — Create a Web Service on Render**
1. Go to [render.com](https://render.com) → New → Web Service
2. Connect your GitHub repo
3. Configure:
   - **Root Directory:** *(leave blank)*
   - **Build Command:** `npm install && cd client && npm install && npm run build`
   - **Start Command:** `NODE_ENV=production node server/server.js`
   - **Environment:** Node

**Step 4 — Add Environment Variables in Render dashboard**
```
ANTHROPIC_API_KEY = sk-ant-your-key-here
NODE_ENV = production
```

**Step 5 — Deploy**
Click "Create Web Service". Render builds and deploys automatically.

Your app will be live at `https://clarity-xxxx.onrender.com`.

---

### Option B — Railway

1. Install Railway CLI: `npm install -g @railway/cli`
2. `railway login`
3. `railway init` in the project root
4. Set env vars: `railway variables set ANTHROPIC_API_KEY=sk-ant-...`
5. `railway up`

Railway auto-detects Node.js and uses the `start` script from `package.json`.

---

### Option C — Fly.io

1. Install: `brew install flyctl` (Mac) or see [fly.io/docs](https://fly.io/docs)
2. `fly auth login`
3. `fly launch` — follow prompts, choose Node.js
4. `fly secrets set ANTHROPIC_API_KEY=sk-ant-...`
5. Build client first: `cd client && npm run build && cd ..`
6. `fly deploy`

---

## Design Decisions

### Why stateless?
No database means no user data to breach, no schema to maintain, no auth to build. Each request is self-contained. Privacy is a feature, not an afterthought.

### Why safety check before AI?
An LLM is not equipped to handle crisis situations. Routing crisis content to an AI could cause harm — the model might minimize, misdirect, or engage in a way that makes things worse. The guardrail intercepts before any AI call.

### Why a fallback static response?
A blank error state breaks trust. If the API times out or fails, returning a calm, generic clarity message keeps the product feeling reliable. Users may not even notice the fallback.

### Why rate limiting in-memory?
For a portfolio/demo project, in-memory rate limiting is sufficient. If this scales, swap the store for Redis. The interface is identical — only the store changes.

### Why Claude Haiku?
Speed and cost. This use case doesn't need Opus-level reasoning. Haiku is fast, cheap, and more than capable of structured short-form output. Switching models is one line.

---

## Customization

**Change the AI model:** Edit `model` in `server/routes/clarity.js`

**Adjust rate limits:** Edit `windowMs` and `max` in `server/server.js`

**Add crisis keywords:** Edit `CRISIS_PATTERNS` in `server/utils/safetyCheck.js`

**Modify the prompt:** Edit `SYSTEM_PROMPT` in `server/utils/promptBuilder.js`

---

## License
MIT