import { useState, useEffect, useRef } from "react";
import api from "../services/api";

// ── Input sanitization ────────────────────────────────────────────────────────

// Strip all HTML and script tags
const stripHtml = (str) =>
  str.replace(/<[^>]*>/g, "").replace(/&[a-z]+;/gi, "");

// Remove dangerous patterns — script injections, event handlers, urls with javascript:
const removeMalicious = (str) =>
  str
    .replace(/javascript\s*:/gi, "")
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/(<script[\s\S]*?>[\s\S]*?<\/script>)/gi, "")
    .replace(/(eval|alert|confirm|prompt|document\.|window\.)\s*\(/gi, "");

// Check if message is just gibberish — only symbols with no letters or digits
const isGibberish = (str) => {
  const alphanumericCount = (str.match(/[a-zA-Z0-9]/g) || []).length;
  return alphanumericCount < 2;
};

// Check for spam — same character repeated excessively (e.g. "aaaaaaaaaa")
const isSpam = (str) => {
  const cleaned = str.trim();
  if (cleaned.length < 6) return false;
  const uniqueChars = new Set(cleaned.replace(/\s/g, "")).size;
  return uniqueChars <= 2;
};

// Master sanitize function — returns { clean, error }
const sanitizeInput = (raw) => {
  // 1. Strip HTML tags and entities
  let clean = stripHtml(raw);

  // 2. Remove malicious patterns
  clean = removeMalicious(clean);

  // 3. Trim whitespace
  clean = clean.trim();

  // 4. Empty after sanitization
  if (!clean) {
    return { clean: null, error: "Message contains invalid content." };
  }

  // 5. Too short
  if (clean.length < 2) {
    return { clean: null, error: "Message is too short." };
  }

  // 6. Too long
  if (clean.length > 1000) {
    return { clean: null, error: "Message is too long. Please keep it under 1000 characters." };
  }

  // 7. Gibberish — only symbols, no real words
  if (isGibberish(clean)) {
    return { clean: null, error: "Please enter a valid message." };
  }

  // 8. Spam — same character repeated
  if (isSpam(clean)) {
    return { clean: null, error: "Please enter a meaningful message." };
  }

  return { clean, error: null };
};

// ── Hook ──────────────────────────────────────────────────────────────────────
export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(true);
  const bottomRef = useRef(null);

  // ── Fetch suggested questions on mount ────────────────────────────────────
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await api.get("/api/suggested-questions");
        setSuggestedQuestions(res.data.suggestions || []);
      } catch {
        setSuggestedQuestions([]);
      } finally {
        setIsFetchingSuggestions(false);
      }
    };
    fetchSuggestions();
  }, []);

  // ── Auto-scroll to latest message ─────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // ── Build conversation history for the API ────────────────────────────────
  const buildHistory = () =>
    messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

  // ── Send a message ─────────────────────────────────────────────────────────
  const sendMessage = async (text) => {
    const raw = (text || input).trim();
    if (!raw || isLoading) return;

    // ── Sanitize and validate ──────────────────────────────────────────────
    const { clean, error: validationError } = sanitizeInput(raw);

    if (validationError) {
      setError(validationError);
      return; // Block the request — don't hit the API
    }

    // Clear error and input
    setError(null);
    setInput("");

    // Add user message immediately (show sanitized version)
    const userMessage = {
      id: Date.now(),
      role: "user",
      content: clean,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const res = await api.post("/api/chat", {
        message: clean,
        conversationHistory: buildHistory(),
      });

      const assistantMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: res.data.reply,
        sources: res.data.sources || [],
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const status = err.response?.status;

      if (status === 429) {
        setError("You're sending messages too fast. Please wait a moment.");
      } else if (status === 400) {
        setError("Invalid message. Please try again.");
      } else if (status === 500) {
        setError("Server error. Please try again in a moment.");
      } else if (!navigator.onLine) {
        setError("No internet connection. Please check your network.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ── Handle Enter key ──────────────────────────────────────────────────────
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ── Clear chat ────────────────────────────────────────────────────────────
  const clearChat = () => {
    setMessages([]);
    setError(null);
    setInput("");
  };

  return {
    messages,
    input,
    setInput,
    isLoading,
    error,
    setError,
    suggestedQuestions,
    isFetchingSuggestions,
    sendMessage,
    handleKeyDown,
    clearChat,
    bottomRef,
  };
};