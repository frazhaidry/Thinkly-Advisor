import { retrieveRelevantChunks } from "../services/retrievalService.js";
import {
  callGroq,
  isGreeting,
  getGreetingResponse,
} from "../services/llmService.js";

// ── POST /api/chat ────────────────────────────────────────────────────────────
export const chat = async (req, res) => {
  const { message, conversationHistory = [] } = req.body;

  try {
    // 1. Short-circuit greetings — no RAG, no LLM call
    if (isGreeting(message)) {
      return res.status(200).json({
        success: true,
        reply: getGreetingResponse(message),
        sources: [],
        retrievedCount: 0,
      });
    }

    // 2. Retrieve relevant chunks from vector store
    const relevantChunks = await retrieveRelevantChunks(message, 5);

    // 3. Call Groq with chunks + history
    const reply = await callGroq(message, relevantChunks, conversationHistory);

    // 4. Deduplicate sources
    const sources = [...new Set(relevantChunks.map((c) => c.source))];

    return res.status(200).json({
      success: true,
      reply,
      sources,
      retrievedCount: relevantChunks.length,
    });

  } catch (err) {
    console.error("❌ [chatController] error:", err?.message || err);
    return res.status(500).json({
      success: false,
      reply: "Something went wrong — try again or contact sachi@thinklylabs.com",
    });
  }
};

// ── GET /api/suggested-questions ─────────────────────────────────────────────
export const getSuggestedQuestions = (req, res) => {
  const suggestions = [
    "My sales team spends hours on cold emails every day",
    "Our support team is drowning in repetitive tickets",
    "I'm a founder stuck in emails and scheduling all week",
    "We compile reports manually every Monday — it's painful",
    "We have no visibility into what our competitors are doing",
    "Our hiring process takes forever and the team is stretched",
  ];

  return res.status(200).json({ success: true, suggestions });
};