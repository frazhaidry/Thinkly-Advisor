import { useState, useEffect, useRef } from "react";
import api from "../services/api";

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(true);
  const bottomRef = useRef(null);

  // ── Fetch suggested questions on mount ──────────────────────────────────────
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await api.get("/api/suggested-questions");
        setSuggestedQuestions(res.data.suggestions || []);
      } catch {
        // Silently fail — suggestions are non-critical
        setSuggestedQuestions([]);
      } finally {
        setIsFetchingSuggestions(false);
      }
    };
    fetchSuggestions();
  }, []);

  // ── Auto-scroll to latest message ────────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // ── Build conversation history for the API ───────────────────────────────────
  const buildHistory = () =>
    messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

  // ── Send a message ───────────────────────────────────────────────────────────
  const sendMessage = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || isLoading) return;

    // Clear error and input
    setError(null);
    setInput("");

    // Add user message immediately
    const userMessage = {
      id: Date.now(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const res = await api.post("/api/chat", {
        message: trimmed,
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
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ── Handle Enter key ─────────────────────────────────────────────────────────
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ── Clear chat ───────────────────────────────────────────────────────────────
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