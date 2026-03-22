import { embedText, getVectorStore } from "./embeddingService.js";

// ── Cosine similarity between two vectors ─────────────────────────────────────
function cosineSimilarity(a, b) {
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// ── Retrieve top-K most relevant chunks for a query ───────────────────────────
/**
 * @param {string} query  - raw user message
 * @param {number} topK   - number of chunks to return (default 5)
 * @returns {Array}       - [{ text, source, score }]
 */
export async function retrieveRelevantChunks(query, topK = 5) {
  const queryEmbedding = await embedText(query);
  const store = getVectorStore();

  const scored = store.map((chunk) => ({
    text: chunk.text,
    source: chunk.source,
    score: cosineSimilarity(queryEmbedding, chunk.embedding),
  }));

  // Sort by score descending, take top K, filter out noise
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .filter((c) => c.score > 0.25);
}