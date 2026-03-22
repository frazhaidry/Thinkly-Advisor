import express from "express";
import { chat, getSuggestedQuestions } from "../controllers/chatController.js";
import { validateChat } from "../middleware/validateChat.js";
import { chatLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// POST /api/chat
router.post("/chat", chatLimiter, validateChat, chat);

// ─── GET /api/suggested-questions ────────────────────────────────────────────
/**
 * Returns a static list of starter questions shown before the user types.
 * These are designed around the ThinklyLabs knowledge base.
 */
router.get("/suggested-questions", getSuggestedQuestions);

export default router;