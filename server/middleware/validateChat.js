// ── Validate POST /api/chat request body ──────────────────────────────────────
export const validateChat = (req, res, next) => {
  const { message, conversationHistory } = req.body;

  // message must exist and be a string
  if (!message || typeof message !== "string") {
    return res.status(400).json({
      success: false,
      message: "`message` is required and must be a string.",
    });
  }

  // message cannot be empty or just whitespace
  if (message.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "`message` cannot be empty.",
    });
  }

  // message cannot be too long
  if (message.trim().length > 1000) {
    return res.status(400).json({
      success: false,
      message: "Message too long. Please keep it under 1000 characters.",
    });
  }

  // conversationHistory must be an array if provided
  if (conversationHistory !== undefined && !Array.isArray(conversationHistory)) {
    return res.status(400).json({
      success: false,
      message: "`conversationHistory` must be an array.",
    });
  }

  // Trim the message before passing forward
  req.body.message = message.trim();

  next();
};