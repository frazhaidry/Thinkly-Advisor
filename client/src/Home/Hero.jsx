import { useEffect, useState } from "react";
import api from "../services/api";

const HeroScreen = ({ onStart }) => {
  const agents = [
    { name: "AI SDR", icon: "🎯", description: "Sales Development" },
    { name: "AI Support Agent", icon: "💬", description: "Customer Support" },
    { name: "AI HR Agent", icon: "👥", description: "Human Resources" },
    { name: "AI Chief of Staff", icon: "📊", description: "Operations" },
    { name: "AI Competitor Analyst", icon: "🔍", description: "Market Intel" },
    { name: "AI Reporting Agent", icon: "📈", description: "Analytics" },
  ];

  const [apiStatus, setApiStatus] = useState("checking");
  const [message, setMessage] = useState("");
  const [hoveredAgent, setHoveredAgent] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isThinklyHovered, setIsThinklyHovered] = useState(false);

  const checkBackend = async () => {
    try {
      setApiStatus("checking");
      const response = await api.get("/api/health");
      setApiStatus("online");
      setMessage(response.data.message);
    } catch (error) {
      setApiStatus("offline");
      setMessage("Backend is not running");
      console.error(error);
    }
  };

  useEffect(() => {
    checkBackend();
  }, []);

  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      overflow: "auto",
      position: "relative",
      background: "linear-gradient(135deg, #0A0A0A 0%, #0F0F0F 50%, #0A0A0A 100%)",
    },
    backgroundOrb1: {
      position: "fixed",
      top: "-20%",
      right: "-10%",
      width: "800px",
      height: "800px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))",
      filter: "blur(120px)",
      animation: "pulseSlow 6s ease-in-out infinite",
      pointerEvents: "none",
    },
    backgroundOrb2: {
      position: "fixed",
      bottom: "-20%",
      left: "-10%",
      width: "800px",
      height: "800px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2))",
      filter: "blur(120px)",
      animation: "pulseSlower 8s ease-in-out infinite",
      pointerEvents: "none",
    },
    gridPattern: {
      position: "fixed",
      inset: 0,
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='rgba(255,255,255,0.03)' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`,
      opacity: 0.3,
      pointerEvents: "none",
    },
    nav: {
      position: "sticky",
      top: 0,
      zIndex: 20,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "24px 32px",
      animation: "slideDown 0.5s ease-out",
      background: "rgba(10, 10, 10, 0.8)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
    },
    logoContainer: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      cursor: "pointer",
      transition: "transform 0.3s ease",
    },
    logoBox: {
      width: "32px",
      height: "32px",
      background: "linear-gradient(135deg, white, rgba(255,255,255,0.8))",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      transition: "transform 0.3s ease",
    },
    logoInner: {
      width: "16px",
      height: "16px",
      background: "linear-gradient(135deg, #0A0A0A, #1A1A1A)",
      borderRadius: "4px",
    },
    logoText: {
      fontSize: "18px",
      fontWeight: 600,
      background: "linear-gradient(135deg, white, rgba(255,255,255,0.7))",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    },
    statusBadge: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 16px",
      borderRadius: "9999px",
      background: "rgba(255, 255, 255, 0.05)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      transition: "all 0.3s ease",
    },
    statusDot: {
      width: "10px",
      height: "10px",
      borderRadius: "50%",
      position: "relative",
    },
    statusText: {
      fontSize: "12px",
      color: "rgba(255, 255, 255, 0.7)",
      fontWeight: 500,
    },
    main: {
      position: "relative",
      zIndex: 10,
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "64px 24px",
      minHeight: "calc(100vh - 200px)",
    },
    badge: {
      padding: "8px 16px",
      borderRadius: "9999px",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      background: "rgba(255, 255, 255, 0.05)",
      backdropFilter: "blur(10px)",
      marginBottom: "32px",
      animation: "fadeInUp 0.6s ease-out",
    },
    badgeText: {
      fontSize: "12px",
      color: "rgba(255, 255, 255, 0.6)",
      textTransform: "uppercase",
      letterSpacing: "0.2em",
      fontWeight: 500,
    },
    heading: {
      fontSize: "clamp(48px, 8vw, 96px)",
      fontWeight: "bold",
      lineHeight: 1.2,
      maxWidth: "1200px",
      marginBottom: "24px",
      animation: "fadeInUp 0.6s ease-out 0.2s forwards",
      opacity: 0,
      animationFillMode: "forwards",
    },
    gradientText: {
      background: "linear-gradient(135deg, #c084fc, #60a5fa, #22d3ee)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      position: "relative",
      display: "inline-block",
    },
    description: {
      color: "rgba(255, 255, 255, 0.5)",
      fontSize: "clamp(18px, 2vw, 24px)",
      maxWidth: "800px",
      marginBottom: "40px",
      lineHeight: 1.6,
      animation: "fadeInUp 0.6s ease-out 0.4s forwards",
      opacity: 0,
      animationFillMode: "forwards",
    },
    thinklyButtonContainer: {
      marginBottom: "32px",
      animation: "fadeInUp 0.6s ease-out 0.5s forwards",
      opacity: 0,
      animationFillMode: "forwards",
    },
    thinklyButton: {
      position: "relative",
      padding: "18px 48px",
      borderRadius: "60px",
      fontSize: "18px",
      fontWeight: 600,
      border: "none",
      cursor: "pointer",
      transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      overflow: "hidden",
      background: "linear-gradient(135deg, rgba(139, 92, 246, 0.9), rgba(59, 130, 246, 0.9))",
      boxShadow: "0 8px 32px rgba(139, 92, 246, 0.3)",
    },
    thinklyGlow: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
      borderRadius: "60px",
      filter: "blur(20px)",
      opacity: 0,
      transition: "opacity 0.4s ease",
    },
    thinklyContent: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "12px",
      zIndex: 2,
    },
    thinklyIcon: {
      width: "24px",
      height: "24px",
      transition: "transform 0.3s ease",
    },
    thinklyText: {
      color: "white",
      fontWeight: 600,
      letterSpacing: "0.5px",
    },
    ctaButton: {
      position: "relative",
      padding: "14px 32px",
      borderRadius: "12px",
      fontSize: "14px",
      fontWeight: 500,
      border: "1px solid rgba(255, 255, 255, 0.2)",
      cursor: "pointer",
      transition: "all 0.3s ease",
      background: "rgba(255, 255, 255, 0.03)",
      backdropFilter: "blur(10px)",
      animation: "fadeInUp 0.6s ease-out 0.7s forwards",
      opacity: 0,
      animationFillMode: "forwards",
    },
    ctaText: {
      position: "relative",
      color: "rgba(255, 255, 255, 0.8)",
      fontWeight: 500,
      zIndex: 1,
    },
    message: {
      marginTop: "24px",
      fontSize: "14px",
      color: "rgba(255, 255, 255, 0.4)",
      fontFamily: "monospace",
      animation: "fadeIn 0.4s ease-out",
    },
    agentsContainer: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "12px",
      marginTop: "64px",
      maxWidth: "1200px",
      animation: "fadeInUp 0.6s ease-out 0.9s forwards",
      opacity: 0,
      animationFillMode: "forwards",
    },
    agentItem: {
      position: "relative",
    },
    agentButton: {
      padding: "10px 16px",
      borderRadius: "9999px",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      background: "rgba(255, 255, 255, 0.05)",
      backdropFilter: "blur(10px)",
      cursor: "pointer",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    agentIcon: {
      fontSize: "18px",
      transition: "transform 0.3s ease",
    },
    agentName: {
      fontSize: "14px",
      color: "rgba(255, 255, 255, 0.7)",
      fontWeight: 500,
      transition: "color 0.3s ease",
    },
    tooltip: {
      position: "absolute",
      bottom: "100%",
      left: "50%",
      transform: "translateX(-50%)",
      marginBottom: "8px",
      padding: "6px 12px",
      borderRadius: "8px",
      background: "rgba(0, 0, 0, 0.9)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      whiteSpace: "nowrap",
      zIndex: 20,
      animation: "fadeInUp 0.2s ease-out",
    },
    tooltipText: {
      fontSize: "12px",
      color: "rgba(255, 255, 255, 0.8)",
    },
    tooltipArrow: {
      position: "absolute",
      top: "100%",
      left: "50%",
      width: "8px",
      height: "8px",
      background: "rgba(0, 0, 0, 0.9)",
      transform: "rotate(45deg)",
      borderRight: "1px solid rgba(255, 255, 255, 0.1)",
      borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    },
    footer: {
      position: "relative",
      zIndex: 10,
      textAlign: "center",
      padding: "24px",
      borderTop: "1px solid rgba(255, 255, 255, 0.05)",
      animation: "fadeIn 0.6s ease-out",
    },
    footerText: {
      fontSize: "12px",
      color: "rgba(255, 255, 255, 0.2)",
    },
  };

  // ── Handle Talk to Thinkly click ─────────────────────────────────────────────
  const handleTalkToThinkly = () => {
    if (onStart) onStart();
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to   { opacity: 1; transform: translateY(0);    }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-100%); }
            to   { opacity: 1; transform: translateY(0);     }
          }
          @keyframes pulseSlow {
            0%, 100% { opacity: 0.3; transform: scale(1);    }
            50%       { opacity: 0.6; transform: scale(1.05); }
          }
          @keyframes pulseSlower {
            0%, 100% { opacity: 0.2; transform: scale(1);   }
            50%       { opacity: 0.5; transform: scale(1.1); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1);   opacity: 1;   }
            50%       { transform: scale(1.2); opacity: 0.7; }
          }
          @keyframes gradientShift {
            0%   { background-position: 0% 50%;   }
            50%  { background-position: 100% 50%; }
            100% { background-position: 0% 50%;   }
          }
          @keyframes shimmer {
            0%   { transform: translateX(-100%) rotate(45deg); }
            100% { transform: translateX(200%)  rotate(45deg); }
          }
          button:active { transform: scale(0.98); }
          @media (prefers-reduced-motion: reduce) {
            * {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
        `}
      </style>

      {/* Background */}
      <div style={styles.backgroundOrb1} />
      <div style={styles.backgroundOrb2} />
      <div style={styles.gridPattern} />

      {/* Nav */}
      <nav style={styles.nav}>
        <div
          style={styles.logoContainer}
          onMouseEnter={(e) => {
            e.currentTarget.querySelector(".logo-box").style.transform = "rotate(180deg)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.querySelector(".logo-box").style.transform = "rotate(0deg)";
          }}
        >
          <div className="logo-box" style={styles.logoBox}>
            <div style={styles.logoInner} />
          </div>
          <span style={styles.logoText}>ThinklyAdvisor</span>
        </div>

        <div
          style={styles.statusBadge}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
          }}
        >
          <div style={{ position: "relative" }}>
            <div
              style={{
                ...styles.statusDot,
                backgroundColor:
                  apiStatus === "checking"
                    ? "#facc15"
                    : apiStatus === "online"
                    ? "#10b981"
                    : "#ef4444",
                animation: apiStatus === "checking" ? "pulse 1.5s infinite" : "none",
              }}
            />
            {apiStatus === "online" && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  backgroundColor: "#10b981",
                  animation: "pulse 2s infinite",
                  opacity: 0.75,
                }}
              />
            )}
          </div>
          <span style={styles.statusText}>
            {apiStatus === "checking"
              ? "Connecting..."
              : apiStatus === "online"
              ? "API Online"
              : "API Offline"}
          </span>
        </div>
      </nav>

      {/* Main */}
      <main style={styles.main}>
        <div style={styles.badge}>
          <span style={styles.badgeText}>Powered by RAG · Built for ThinklyLabs</span>
        </div>

        <h1 style={styles.heading}>
          Find your{" "}
          <span style={{ position: "relative", display: "inline-block" }}>
            <span
              style={{
                ...styles.gradientText,
                backgroundSize: "300%",
                animation: "gradientShift 3s ease infinite",
              }}
            >
              AI agent
            </span>
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(135deg, #c084fc, #60a5fa, #22d3ee)",
                filter: "blur(24px)",
                opacity: 0.5,
                animation: "pulseSlow 3s ease-in-out infinite",
              }}
            />
          </span>{" "}
          in minutes.
        </h1>

        <p style={styles.description}>
          Describe your operational bottleneck and get a grounded recommendation
          from ThinklyLabs' agent portfolio.
        </p>

        {/* Talk to Thinkly Button */}
        <div style={styles.thinklyButtonContainer}>
          <button
            style={styles.thinklyButton}
            onMouseEnter={() => setIsThinklyHovered(true)}
            onMouseLeave={() => setIsThinklyHovered(false)}
            onClick={handleTalkToThinkly}
          >
            <div style={{ ...styles.thinklyGlow, opacity: isThinklyHovered ? 0.8 : 0 }} />
            <div style={styles.thinklyContent}>
              <svg
                style={{
                  ...styles.thinklyIcon,
                  transform: isThinklyHovered ? "scale(1.1)" : "scale(1)",
                }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              <span style={styles.thinklyText}>Talk to Thinkly</span>
              <svg
                style={{
                  ...styles.thinklyIcon,
                  transform: isThinklyHovered ? "translateX(4px)" : "translateX(0)",
                  transition: "transform 0.3s ease",
                }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </div>
            {isThinklyHovered && (
              <div style={{ position: "absolute", inset: 0, borderRadius: "60px", overflow: "hidden" }}>
                <div
                  style={{
                    position: "absolute",
                    top: "-50%",
                    left: "-50%",
                    width: "200%",
                    height: "200%",
                    background: "linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent)",
                    animation: "shimmer 1.5s ease-in-out",
                  }}
                />
              </div>
            )}
          </button>
        </div>

        {/* Secondary CTA */}
        <button
          style={styles.ctaButton}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
          }}
          onClick={checkBackend}
        >
          <span style={styles.ctaText}>
            {isHovered ? "🔄 Checking..." : "Check Backend Status"}
          </span>
        </button>

        {message && <p style={styles.message}>{message}</p>}

        <div style={styles.agentsContainer}>
          {agents.map((agent, index) => (
            <div
              key={agent.name}
              style={styles.agentItem}
              onMouseEnter={() => setHoveredAgent(index)}
              onMouseLeave={() => setHoveredAgent(null)}
            >
              <div
                style={styles.agentButton}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                }}
              >
                <span
                  style={styles.agentIcon}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.1)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                >
                  {agent.icon}
                </span>
                <span
                  style={styles.agentName}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255, 255, 255, 0.9)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)"; }}
                >
                  {agent.name}
                </span>
              </div>

              {hoveredAgent === index && (
                <div style={styles.tooltip}>
                  <p style={styles.tooltipText}>{agent.description}</p>
                  <div style={styles.tooltipArrow} />
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>© 2025 ThinklyLabs LLP</p>
      </footer>
    </div>
  );
};

export default HeroScreen;