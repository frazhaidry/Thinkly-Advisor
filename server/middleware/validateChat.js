// ── Blocked patterns — prompt injection + malicious input ─────────────────────
const BLOCKED_PATTERNS = [
  // Prompt injection
  /ignore\s+(previous|above|all)\s+instructions?/i,
  /forget\s+(everything|all|previous)/i,
  /you\s+are\s+now\s+(a|an)/i,
  /act\s+as\s+(a|an)/i,
  /pretend\s+(you\s+are|to\s+be)/i,
  /jailbreak/i,
  /dan\s+mode/i,
  /developer\s+mode/i,
  /override\s+(your\s+)?(instructions?|rules?|guidelines?)/i,
  /reveal\s+(your\s+)?(prompt|instructions?|system)/i,
  /what\s+are\s+your\s+instructions/i,
  /repeat\s+(your\s+)?(system|instructions?|prompt)/i,
  /show\s+(me\s+)?(your\s+)?(system\s+)?prompt/i,

  // Harmful content
  /how\s+to\s+(make|build|create)\s+(bomb|weapon|malware|virus)/i,
  /\b(hack|exploit|ddos|phishing|ransomware)\b/i,

  // Data extraction attempts
  /give\s+me\s+(all\s+)?(user|customer|employee)\s+data/i,
  /dump\s+(the\s+)?(database|db)/i,
  /select\s+\*\s+from/i,         // SQL injection attempt
  /<script[\s\S]*?>/i,           // XSS attempt
  /javascript:/i,                // XSS via protocol
  /on\w+\s*=\s*["']?[\w\s]/i,   // inline event handlers
];

// ── Check for invisible / control characters ──────────────────────────────────
function hasInvalidChars(str) {
  return /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(str);
}

// ── Check if message matches any blocked pattern ──────────────────────────────
function isBlocked(str) {
  return BLOCKED_PATTERNS.some((pattern) => pattern.test(str));
}

// ── Validate conversation history entries ─────────────────────────────────────
function isValidHistory(history) {
  if (!Array.isArray(history)) return false;

  // Cap history length
  if (history.length > 20) return false;

  return history.every(
    (entry) =>
      typeof entry === "object" &&
      entry !== null &&
      ["user", "assistant"].includes(entry.role) &&
      typeof entry.content === "string" &&
      entry.content.length <= 2000 // cap per message
  );
}

// ── Main validation middleware ─────────────────────────────────────────────────
export const validateChat = (req, res, next) => {
  const { message, conversationHistory } = req.body;

  // ── 1. message must exist and be a string ──────────────────────────────────
  if (!message || typeof message !== "string") {
    return res.status(400).json({
      success: false,
      message: "`message` is required and must be a string.",
    });
  }

  const trimmed = message.trim();

  // ── 2. message cannot be empty ────────────────────────────────────────────
  if (trimmed.length === 0) {
    return res.status(400).json({
      success: false,
      message: "`message` cannot be empty.",
    });
  }

  // ── 3. message length cap ─────────────────────────────────────────────────
  if (trimmed.length > 1000) {
    return res.status(400).json({
      success: false,
      message: "Message too long. Please keep it under 1000 characters.",
    });
  }

  // ── 4. reject invisible / control characters ──────────────────────────────
  if (hasInvalidChars(trimmed)) {
    return res.status(400).json({
      success: false,
      message: "Message contains invalid characters.",
    });
  }

  // ── 5. block prompt injection + malicious patterns ────────────────────────
  if (isBlocked(trimmed)) {
    return res.status(400).json({
      success: false,
      message: "Message not allowed.",
    });
  }

  // ── 6. conversationHistory validation ────────────────────────────────────
  if (conversationHistory !== undefined) {
    if (!isValidHistory(conversationHistory)) {
      return res.status(400).json({
        success: false,
        message:
          "`conversationHistory` must be an array of up to 20 entries, each with role ('user' | 'assistant') and content (string, max 2000 chars).",
      });
    }
  }

  // ── 7. Pass sanitized values forward ──────────────────────────────────────
  req.body.message = trimmed;
  req.body.conversationHistory = conversationHistory || [];

  next();
};
