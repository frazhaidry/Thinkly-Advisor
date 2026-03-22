import { embedText, getVectorStore } from "./embeddingService.js";

function cosineSimilarity(a, b) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// MMR — picks relevant chunks that aren't too similar to each other
function maximalMarginalRelevance(queryEmbedding, candidates, topK, lambda = 0.6) {
  if (candidates.length === 0) return [];

  const selected = [];
  const remaining = [...candidates];

  while (selected.length < topK && remaining.length > 0) {
    let bestScore = -Infinity;
    let bestIdx = 0;

    for (let i = 0; i < remaining.length; i++) {
      const relevance = cosineSimilarity(queryEmbedding, remaining[i].embedding);

      // Penalize if too similar to already selected chunks
      const maxSimilarityToSelected =
        selected.length === 0
          ? 0
          : Math.max(...selected.map((s) => cosineSimilarity(remaining[i].embedding, s.embedding)));

      const mmrScore = lambda * relevance - (1 - lambda) * maxSimilarityToSelected;

      if (mmrScore > bestScore) {
        bestScore = mmrScore;
        bestIdx = i;
      }
    }

    selected.push(remaining[bestIdx]);
    remaining.splice(bestIdx, 1);
  }

  return selected;
}

export async function retrieveRelevantChunks(query, topK = 4) {
  const queryEmbedding = await embedText(query);
  const store = getVectorStore();

  if (store.length === 0) {
    console.warn("⚠️  Vector store is empty");
    return [];
  }

  // Score all chunks
  const scored = store
    .map((chunk) => ({
      ...chunk,
      score: cosineSimilarity(queryEmbedding, chunk.embedding),
    }))
    .filter((c) => c.score > 0.2) // drop noise
    .sort((a, b) => b.score - a.score)
    .slice(0, 20); // candidate pool for MMR

  // Apply MMR on top candidates
  const diverse = maximalMarginalRelevance(queryEmbedding, scored, topK);

  return diverse.map(({ text, title, source, score, metadata }) => ({
    text,
    title,
    source,
    score: Math.round(score * 100) / 100,
    metadata,
  }));
}