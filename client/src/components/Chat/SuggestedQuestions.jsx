const SuggestedQuestions = ({ questions, onSelect, isLoading }) => {
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          justifyContent: "center",
          padding: "8px 0",
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              height: "36px",
              width: `${100 + i * 20}px`,
              borderRadius: "9999px",
              background: "rgba(255,255,255,0.05)",
              animation: "shimmerPulse 1.5s ease-in-out infinite",
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
    );
  }

  if (!questions || questions.length === 0) return null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
        padding: "24px 16px",
        animation: "fadeInUp 0.4s ease-out",
      }}
    >
      {/* Label */}
      <span
        style={{
          fontSize: "11px",
          color: "rgba(255,255,255,0.3)",
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          fontWeight: 500,
        }}
      >
        Ask me anything about ThinklyLabs
      </span>

      {/* Question chips */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          justifyContent: "center",
        }}
      >
        {questions.map((q, index) => (
          <button
            key={index}
            onClick={() => onSelect(q)}
            style={{
              padding: "8px 16px",
              borderRadius: "9999px",
              fontSize: "13px",
              fontWeight: 500,
              border: "1px solid rgba(139, 92, 246, 0.25)",
              background: "rgba(139, 92, 246, 0.08)",
              color: "rgba(192, 132, 252, 0.85)",
              cursor: "pointer",
              transition: "all 0.2s ease",
              backdropFilter: "blur(8px)",
              animation: "fadeInUp 0.4s ease-out",
              animationDelay: `${index * 0.05}s`,
              animationFillMode: "both",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(139, 92, 246, 0.2)";
              e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.5)";
              e.currentTarget.style.color = "rgba(216, 180, 254, 1)";
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(139, 92, 246, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(139, 92, 246, 0.08)";
              e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.25)";
              e.currentTarget.style.color = "rgba(192, 132, 252, 0.85)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedQuestions;