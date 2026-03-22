import { retrieveRelevantChunks } from "../services/retrievalService.js";
import { callGroq } from "../services/llmService.js";

// ── POST /api/chat ────────────────────────────────────────────────────────────
export const chat = async (req, res) => {
  const { message, conversationHistory = [] } = req.body;

  try {
    // 1. Retrieve relevant chunks from vector store
    const relevantChunks = await retrieveRelevantChunks(message, 5);

    // 2. Call Groq with chunks + history
    const reply = await callGroq(message, relevantChunks, conversationHistory);

    // 3. Deduplicate sources for the response
    const sources = [...new Set(relevantChunks.map((c) => c.source))];

    return res.status(200).json({
      success: true,
      reply,
      sources,
      retrievedCount: relevantChunks.length,
    });
  } catch (err) {
    console.error("❌ chat controller error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while processing your message.",
    });
  }
};

// ── GET /api/suggested-questions ──────────────────────────────────────────────
export const getSuggestedQuestions = (req, res) => {
  const suggestions = [
    "What does ThinklyLabs do?",
    "What AI agents do you offer?",
    "How long does a project take to deploy?",
    "What industries do you work with?",
    "How does pricing work?",
    "Who are the founders of ThinklyLabs?",
    "What is the AI SDR agent?",
    "How do I get started with ThinklyLabs?",
  ];

  return res.status(200).json({ success: true, suggestions });
};