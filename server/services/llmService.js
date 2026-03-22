import Groq from "groq-sdk";

// ── System prompt ─────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are a helpful AI assistant for ThinklyLabs — a company that builds production-ready AI agents and knowledge systems for enterprise teams.

Your job is to answer questions about ThinklyLabs accurately and concisely using only the context provided.

Guidelines:
- Only answer using the provided context. Do not invent services, pricing, or details not in the context.
- If the answer is not in the context, say: "I don't have that information right now. You can reach the team at sachi@thinklylabs.com or book a demo at thinklylabs.com."
- Be conversational and clear. Write in short paragraphs, not walls of text.
- Never mention that you are using "context", "chunks", or a "knowledge base" — just answer naturally.
- Keep responses concise — 2 to 4 sentences unless a detailed answer is clearly needed.`;

// ── Call Groq with context + history ──────────────────────────────────────────
export async function callGroq(userMessage, retrievedChunks, conversationHistory = []) {
  // Initialize client here so dotenv is already loaded by the time this runs
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const contextBlock =
    retrievedChunks.length > 0
      ? retrievedChunks
          .map((c, i) => `[${i + 1}] (source: ${c.source})\n${c.text}`)
          .join("\n\n")
      : "No relevant context found.";

  const systemMessage = `${SYSTEM_PROMPT}

---
CONTEXT:
${contextBlock}
---`;

  const sanitizedHistory = conversationHistory
    .slice(-10)
    .filter((m) => m.role && m.content)
    .map((m) => ({ role: m.role, content: String(m.content) }));

  const messages = [
    { role: "system", content: systemMessage },
    ...sanitizedHistory,
    { role: "user", content: userMessage },
  ];

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages,
    temperature: 0.4,
    max_tokens: 512,
  });

  return (
    response.choices[0]?.message?.content?.trim() ||
    "I couldn't generate a response. Please try again."
  );
}