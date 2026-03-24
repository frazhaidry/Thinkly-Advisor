import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { buildVectorStore } from "./services/embeddingService.js";
import chatRoutes from "./routes/chat.js";
import { apiLimiter } from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  "https://thinkly-advisor.vercel.app",
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests like Postman or server-to-server with no origin
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST"],
}));

app.use(express.json({ limit: "1mb" }));
app.use("/api", apiLimiter);

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

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.path} not found.`,
  });
});

async function start() {
  try {
    console.log("🚀 Starting ThinklyLabs RAG backend...");
    await buildVectorStore();
    app.listen(PORT, () => {
      console.log(`✅ Server ready on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

start();