const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ChatMessage = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: isUser ? "flex-end" : "flex-start",
        marginBottom: "16px",
        animation: "fadeInUp 0.3s ease-out",
      }}
    >
      {/* Role label */}
      <span
        style={{
          fontSize: "11px",
          color: "rgba(255,255,255,0.3)",
          marginBottom: "6px",
          marginLeft: isUser ? "0" : "4px",
          marginRight: isUser ? "4px" : "0",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          fontWeight: 500,
        }}
      >
        {isUser ? "You" : "Thinkly"}
      </span>

      {/* Bubble */}
      <div
        style={{
          maxWidth: "80%",
          padding: "14px 18px",
          borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          background: isUser
            ? "linear-gradient(135deg, rgba(139, 92, 246, 0.85), rgba(59, 130, 246, 0.85))"
            : "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(12px)",
          border: isUser
            ? "1px solid rgba(139, 92, 246, 0.3)"
            : "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: isUser
            ? "0 4px 24px rgba(139, 92, 246, 0.2)"
            : "0 4px 24px rgba(0, 0, 0, 0.2)",
        }}
      >
        <p
          style={{
            fontSize: "14px",
            lineHeight: "1.7",
            color: isUser ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.85)",
            margin: 0,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {message.content}
        </p>

        {/* Sources — only for assistant messages */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div
            style={{
              marginTop: "10px",
              paddingTop: "10px",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
            }}
          >
            {message.sources.map((source) => (
              <span
                key={source}
                style={{
                  fontSize: "10px",
                  padding: "3px 8px",
                  borderRadius: "9999px",
                  background: "rgba(139, 92, 246, 0.15)",
                  border: "1px solid rgba(139, 92, 246, 0.25)",
                  color: "rgba(192, 132, 252, 0.8)",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                }}
              >
                {source}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Timestamp */}
      <span
        style={{
          fontSize: "10px",
          color: "rgba(255,255,255,0.2)",
          marginTop: "4px",
          marginLeft: isUser ? "0" : "4px",
          marginRight: isUser ? "4px" : "0",
        }}
      >
        {formatTime(message.timestamp)}
      </span>
    </div>
  );
};

export default ChatMessage;