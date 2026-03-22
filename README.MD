# ThinklyAdvisor — RAG-based AI Chatbot

A production-ready RAG (Retrieval-Augmented Generation) chatbot built for ThinklyLabs as part of an assignment. It answers questions about ThinklyLabs' agents, solutions, pricing, and more — grounded entirely in a curated knowledge base with no hallucination.

**Live Demo:** [thinkly-advisor.vercel.app](https://thinkly-advisor.vercel.app)  
**Backend API:** [thinkly-advisor.onrender.com](https://thinkly-advisor.onrender.com)

---

## What is RAG?

RAG (Retrieval-Augmented Generation) is a technique where instead of relying on an LLM's training data, you:

1. Build a knowledge base from your own documents
2. Convert every document chunk into a vector (embedding)
3. When a user asks a question, embed the question too
4. Find the most similar chunks using cosine similarity
5. Inject those chunks into the LLM prompt as context
6. Let the LLM generate a grounded, accurate answer

This means the chatbot only answers based on ThinklyLabs' actual data — not guesses.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + TailwindCSS |
| Backend | Node.js + Express.js |
| Embeddings | Xenova Transformers (`all-MiniLM-L6-v2`) |
| LLM | Groq API (`llama3-8b-8192`) |
| Vector Store | In-memory (no DB needed) |
| Frontend Deploy | Vercel |
| Backend Deploy | Render |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        Frontend                         │
│         React + Vite (Vercel)                           │
│  Hero Page  →  Slide-in Chat Panel  →  useChat Hook     │
└─────────────────────┬───────────────────────────────────┘
                      │ POST /api/chat
                      ▼
┌─────────────────────────────────────────────────────────┐
│                        Backend                          │
│              Express.js MVC (Render)                    │
│                                                         │
│  Route → Middleware (validate + rate limit)             │
│        → Controller → Services                          │
│                                                         │
│  ┌──────────────────────────────────────────────┐       │
│  │              RAG Pipeline                    │       │
│  │                                              │       │
│  │  JSON files → Chunk → Embed (Xenova)         │       │
│  │       ↓                                      │       │
│  │  In-memory Vector Store (48 chunks)          │       │
│  │       ↓                                      │       │
│  │  User Query → Embed → Cosine Similarity      │       │
│  │       ↓                                      │       │
│  │  Top-5 Chunks + History → Groq LLM           │       │
│  │       ↓                                      │       │
│  │  Grounded Response → Frontend                │       │
│  └──────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
Thinkly-Advisor/
├── client/                          # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   └── Chat/
│   │   │       ├── chatWindow.jsx       # Main chat container
│   │   │       ├── chatMessage.jsx      # Message bubble component
│   │   │       ├── chatInput.jsx        # Input bar + send button
│   │   │       └── suggestedQuestions.jsx # Starter question chips
│   │   ├── hooks/
│   │   │   └── useChat.js              # All chat logic + API calls
│   │   ├── services/
│   │   │   └── api.js                  # Axios instance
│   │   ├── Home/
│   │   │   └── Hero.jsx                # Landing page
│   │   ├── App.jsx                     # Root — slide-in panel logic
│   │   └── index.css                   # Global styles + animations
│   └── package.json
│
└── server/                          # Backend (Express MVC)
    ├── controllers/
    │   └── chatController.js           # Handles req/res
    ├── knowledge/                      # Knowledge base JSON files
    │   ├── agents.json
    │   ├── faq.json
    │   ├── solution.json
    │   ├── testimonials.json
    │   └── use_cases.json
    ├── middleware/
    │   ├── validateChat.js             # Input validation
    │   └── rateLimiter.js              # Rate limiting
    ├── routes/
    │   └── chat.js                     # API routes
    ├── services/
    │   ├── embeddingService.js         # Xenova + vector store
    │   ├── retrievalService.js         # Cosine similarity search
    │   └── llmService.js               # Groq API call
    └── server.js                       # Entry point + boot sequence
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/chat` | Send a message, get a reply |
| `GET` | `/api/suggested-questions` | Get starter questions |

### POST `/api/chat`

**Request:**
```json
{
  "message": "What does ThinklyLabs do?",
  "conversationHistory": [
    { "role": "user", "content": "previous message" },
    { "role": "assistant", "content": "previous reply" }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "reply": "ThinklyLabs builds production-ready AI agents...",
  "sources": ["faq", "agents"],
  "retrievedCount": 4
}
```

---

## Knowledge Base

The chatbot is grounded in 5 JSON files (48 total chunks):

| File | Chunks | Content |
|---|---|---|
| `agents.json` | 24 | All AI agent details |
| `faq.json` | 8 | Frequently asked questions |
| `solution.json` | 5 | Service offerings |
| `testimonials.json` | 3 | Client testimonials |
| `use_cases.json` | 8 | Industry use cases |

---

## Features

- **RAG pipeline** — grounded answers, no hallucination
- **Multi-turn conversation** — remembers last 10 messages
- **In-memory vector store** — no database needed
- **Rate limiting** — 100 req/15min globally, 10 messages/min on chat
- **Input validation** — sanitized, length-capped requests
- **Slide-in chat panel** — non-intrusive UI over the hero page
- **Loading / error / empty states** — all handled gracefully
- **Source attribution** — every reply shows which knowledge files were used
- **Suggested questions** — starter prompts for new users
- **Responsive** — works on mobile and desktop

---

## Running Locally

### Prerequisites
- Node.js v18+
- Groq API key (free at [console.groq.com](https://console.groq.com))

### Backend

```bash
cd server
npm install
```

Create `.env`:
```
PORT=5000
GROQ_API_KEY=your_groq_api_key
CLIENT_URL=http://localhost:5173
```

```bash
npm run dev
```

First boot downloads the Xenova model (~23MB). You'll see:
```
✅ Vector store ready. Total chunks: 48
✅ Server ready on http://localhost:5000
```

### Frontend

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`

---

## Deployment

| Service | Platform | URL |
|---|---|---|
| Frontend | Vercel | [thinkly-advisor.vercel.app](https://thinkly-advisor.vercel.app) |
| Backend | Render (Free tier) | [thinkly-advisor.onrender.com](https://thinkly-advisor.onrender.com) |

> **Note:** Render free tier spins down after 15 minutes of inactivity. First request after spin-down takes ~60 seconds (model reload). Subsequent requests are fast.

---

## Constraints

- No authentication
- No database
- No vector database
- No user accounts
- In-memory only — vector store resets on server restart

---

## Built By

**Fraz** — Final year Software Engineering student, Integral University, Lucknow.  
Built as an assignment for ThinklyLabs.

---

## License

MIT