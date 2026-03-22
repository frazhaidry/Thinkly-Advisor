import { pipeline } from "@xenova/transformers";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── In-memory vector store ────────────────────────────────────────────────────
let vectorStore = [];
let embedder = null;

// ── 1. Load embedder once (cached after first call) ───────────────────────────
export async function loadEmbedder() {
  if (embedder) return embedder;
  console.log("⏳ Loading Xenova embedding model...");
  embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  console.log("✅ Embedding model loaded.");
  return embedder;
}

// ── 2. Embed a single string → plain JS array ─────────────────────────────────
export async function embedText(text) {
  const model = await loadEmbedder();
  const output = await model(text, { pooling: "mean", normalize: true });
  return Array.from(output.data);
}

// ── 3. Flatten nested JSON into readable plain text ───────────────────────────
function flattenObject(obj, prefix = "") {
  if (typeof obj === "string") return obj;
  if (typeof obj === "number" || typeof obj === "boolean") return String(obj);
  if (Array.isArray(obj)) {
    return obj.map((item) => flattenObject(item, prefix)).join(". ");
  }
  if (typeof obj === "object" && obj !== null) {
    return Object.entries(obj)
      .map(([k, v]) => {
        const label = prefix ? `${prefix} ${k}` : k;
        return `${label}: ${flattenObject(v, label)}`;
      })
      .join(". ");
  }
  return "";
}

// ── 4. Convert a JSON file's data into text chunks ────────────────────────────
function chunkJson(data, sourceFile) {
  const chunks = [];
  const source = path.basename(sourceFile, ".json");

  if (Array.isArray(data)) {
    data.forEach((item, idx) => {
      const text = flattenObject(item).trim();
      if (text) chunks.push({ text, source, index: idx });
    });
  } else if (typeof data === "object" && data !== null) {
    Object.entries(data).forEach(([key, value]) => {
      const text = flattenObject({ [key]: value }).trim();
      if (text) chunks.push({ text, source, index: key });
    });
  }

  return chunks;
}

// ── 5. Build vector store at startup ─────────────────────────────────────────
export async function buildVectorStore() {
  const knowledgeDir = path.resolve(__dirname, "../knowledge");

  if (!fs.existsSync(knowledgeDir)) {
    console.error(`❌ Knowledge directory not found at: ${knowledgeDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(knowledgeDir).filter((f) => f.endsWith(".json"));

  if (files.length === 0) {
    console.error("❌ No JSON files found in /knowledge.");
    process.exit(1);
  }

  console.log(`📚 Found ${files.length} knowledge file(s): ${files.join(", ")}`);

  for (const file of files) {
    const fullPath = path.join(knowledgeDir, file);
    let data;

    try {
      data = JSON.parse(fs.readFileSync(fullPath, "utf-8"));
    } catch {
      console.warn(`⚠️  Skipping ${file} — invalid JSON`);
      continue;
    }

    const chunks = chunkJson(data, file);
    console.log(`   → ${file}: ${chunks.length} chunk(s)`);

    for (const chunk of chunks) {
      const embedding = await embedText(chunk.text);
      vectorStore.push({ ...chunk, embedding });
    }
  }

  console.log(`✅ Vector store ready. Total chunks: ${vectorStore.length}`);
}

// ── 6. Expose store to retrieval service ──────────────────────────────────────
export function getVectorStore() {
  return vectorStore;
}