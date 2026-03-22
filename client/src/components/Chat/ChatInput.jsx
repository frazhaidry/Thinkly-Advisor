import { useRef, useEffect } from "react";

const ChatInput = ({ input, setInput, onSend, onKeyDown, isLoading }) => {
  const textareaRef = useRef(null);

  // Auto-resize textarea as user types
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [input]);

  // Focus input when panel opens
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  return (
    <div
      style={{
        padding: "16px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(10,10,10,0.6)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "10px",
          padding: "10px 14px",
          borderRadius: "16px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          transition: "border-color 0.2s ease",
        }}
        onFocusCapture={(e) => {
          e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.4)";
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(139, 92, 246, 0.08)";
        }}
        onBlurCapture={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask about ThinklyLabs agents, pricing, solutions..."
          rows={1}
          disabled={isLoading}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            resize: "none",
            fontSize: "14px",
            lineHeight: "1.6",
            color: "rgba(255,255,255,0.85)",
            fontFamily: "inherit",
            overflowY: "auto",
            maxHeight: "120px",
            caretColor: "#8b5cf6",
          }}
        />

        {/* Send button */}
        <button
          onClick={() => onSend()}
          disabled={isLoading || !input.trim()}
          style={{
            flexShrink: 0,
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            border: "none",
            cursor: isLoading || !input.trim() ? "not-allowed" : "pointer",
            background:
              isLoading || !input.trim()
                ? "rgba(255,255,255,0.06)"
                : "linear-gradient(135deg, #8b5cf6, #3b82f6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
            boxShadow:
              isLoading || !input.trim()
                ? "none"
                : "0 4px 12px rgba(139, 92, 246, 0.3)",
          }}
          onMouseEnter={(e) => {
            if (!isLoading && input.trim()) {
              e.currentTarget.style.transform = "scale(1.08)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(139, 92, 246, 0.45)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow =
              !isLoading && input.trim()
                ? "0 4px 12px rgba(139, 92, 246, 0.3)"
                : "none";
          }}
        >
          {isLoading ? (
            // Spinner
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="2"
              style={{ animation: "spin 1s linear infinite" }}
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          ) : (
            // Send arrow
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke={input.trim() ? "white" : "rgba(255,255,255,0.3)"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          )}
        </button>
      </div>

      {/* Hint */}
      <p
        style={{
          fontSize: "10px",
          color: "rgba(255,255,255,0.2)",
          textAlign: "center",
          marginTop: "8px",
        }}
      >
        Press Enter to send · Shift+Enter for new line
      </p>
    </div>
  );
};

export default ChatInput;