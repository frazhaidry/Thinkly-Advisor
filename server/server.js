import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { buildVectorStore } from "./services/embeddingService.js";
import chatRoutes from "./routes/chat.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  methods: ["GET", "POST"],
}));

app.use(express.json({ limit: "1mb" }));

// add this import at the top
import { apiLimiter } from "./middleware/rateLimiter.js";

// add this line after app.use(express.json(...))
app.use("/api", apiLimiter);

// ── Routes ────────────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "ThinklyLabs RAG API is running." });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend connected successfully.",
  });
});

app.use("/api", chatRoutes);

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.path} not found.`,
  });
});

// ── Boot sequence ─────────────────────────────────────────────────────────────
// Build vector store first, then start listening.
// No requests are accepted until embeddings are ready.
async function start() {
  try {
    console.log("🚀 Starting ThinklyLabs RAG backend...");
    await buildVectorStore();
    app.listen(PORT, () => {
      console.log(`\n✅ Server ready on http://localhost:${PORT}`);
      console.log(`   GET  /api/health`);
      console.log(`   POST /api/chat`);
      console.log(`   GET  /api/suggested-questions\n`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

start();