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

  return (
    <div className="min-h-screen flex flex-col overflow-auto relative bg-gradient-to-br from-[#0A0A0A] via-[#0F0F0F] to-[#0A0A0A]">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-100%); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseSlow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        @keyframes pulseSlower {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%) rotate(45deg); }
          100% { transform: translateX(200%) rotate(45deg); }
        }
        @keyframes borderPulse {
          0%, 100% { border-color: rgba(239, 68, 68, 0.3); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
          50% { border-color: rgba(239, 68, 68, 0.8); box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.2); }
        }
        button:active { transform: scale(0.98); }
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      {/* Background Orbs */}
      <div className="fixed top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 blur-[120px] animate-[pulseSlow_6s_ease-in-out_infinite] pointer-events-none" />
      <div className="fixed bottom-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full bg-gradient-to-br from-purple-600/20 to-pink-500/20 blur-[120px] animate-[pulseSlower_8s_ease-in-out_infinite] pointer-events-none" />
      
      {/* Grid Pattern */}
      <div className="fixed inset-0 opacity-30 pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='rgba(255,255,255,0.03)' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`,
      }} />

      {/* Navigation */}
      <nav className="sticky top-0 z-20 flex items-center justify-between px-6 sm:px-8 py-6 animate-[slideDown_0.5s_ease-out] bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-3 cursor-pointer transition-transform duration-300 hover:scale-105 group">
          <div className="w-8 h-8 bg-gradient-to-br from-white to-white/80 rounded-lg flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:rotate-180">
            <div className="w-4 h-4 bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] rounded" />
          </div>
          <span className="text-lg font-semibold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            ThinklyAdvisor
          </span>
        </div>

        <div 
          className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-white/5 backdrop-blur-lg border border-white/10 transition-all duration-300 hover:scale-105 hover:bg-white/10"
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
          }}
        >
          <div className="relative">
            <div 
              className={`w-2.5 h-2.5 rounded-full ${
                apiStatus === "checking" ? "bg-yellow-500 animate-[pulse_1.5s_infinite]" :
                apiStatus === "online" ? "bg-emerald-500" : "bg-red-500"
              }`}
            />
            {apiStatus === "online" && (
              <div className="absolute inset-0 rounded-full bg-emerald-500 animate-[pulse_2s_infinite] opacity-75" />
            )}
          </div>
          <span className="text-xs font-medium text-white/70">
            {apiStatus === "checking" ? "Connecting... it can take 2 minutes" : apiStatus === "online" ? "API Online" : "API Offline"}
          </span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 py-16 sm:px-8 lg:px-16 min-h-[calc(100vh-200px)]">
        {/* Badge */}
        <div className="px-3 sm:px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-lg mb-6 sm:mb-8 animate-[fadeInUp_0.6s_ease-out]">
          <span className="text-[10px] sm:text-xs text-white/60 uppercase tracking-[0.2em] font-medium">
            Powered by RAG · Built for ThinklyLabs
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.2] max-w-[1200px] mb-4 sm:mb-6 animate-[fadeInUp_0.6s_ease-out_0.2s_forwards] opacity-0">
          Find your{" "}
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent bg-[length:300%] animate-[gradientShift_3s_ease_infinite]">
              AI agent
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 blur-2xl opacity-50 animate-[pulseSlow_3s_ease-in-out_infinite]" />
          </span>{" "}
          in minutes.
        </h1>

        {/* Description */}
        <p className="text-lg sm:text-xl md:text-2xl text-white/50 max-w-[800px] mb-8 sm:mb-10 leading-relaxed animate-[fadeInUp_0.6s_ease-out_0.4s_forwards] opacity-0">
          Describe your operational bottleneck and get a grounded recommendation
          from ThinklyLabs' agent portfolio.
        </p>

        {/* Disclaimer Box - Xenova Embedding Notice */}
        <div className="w-full max-w-3xl mx-auto mb-6 sm:mb-8 animate-[fadeInUp_0.6s_ease-out_0.45s_forwards] opacity-0">
          <div className="relative group">
            {/* Animated border effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 via-orange-500 to-red-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300 animate-[borderPulse_2s_ease-in-out_infinite]" />
            
            <div className="relative bg-gradient-to-r from-red-950/90 via-red-900/90 to-orange-950/90 backdrop-blur-lg rounded-xl border border-red-500/50 p-4 sm:p-5 shadow-lg shadow-red-500/20">
              <div className="flex items-start gap-3 sm:gap-4">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-red-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                
                {/* Content */}
                <div className="flex-1 text-left">
                  <h3 className="text-sm sm:text-base font-semibold text-red-300 mb-1">
                    ⚡ Initial Setup Notice
                  </h3>
                  <p className="text-xs sm:text-sm text-red-200/80 leading-relaxed">
                    The first request may take up to 2 minutes as the Xenova Node.js library initializes 
                    and downloads embedding models. This is a one-time setup per session. Subsequent 
                    responses will be instant. Thank you for your patience! 🚀
                  </p>
                </div>
                
                {/* Optional: Dismiss button (uncomment if needed) */}
                {/* <button className="flex-shrink-0 text-red-400 hover:text-red-300 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button> */}
              </div>
            </div>
          </div>
        </div>

        {/* Talk to Thinkly Button */}
        <div className="mb-6 sm:mb-8 animate-[fadeInUp_0.6s_ease-out_0.5s_forwards] opacity-0">
          <button
            className="relative px-8 sm:px-12 py-4 sm:py-5 rounded-full text-base sm:text-lg font-semibold cursor-pointer overflow-hidden bg-gradient-to-r from-purple-600/90 to-blue-600/90 shadow-lg shadow-purple-500/30 transition-all duration-300 hover:scale-105 active:scale-95"
            onMouseEnter={() => setIsThinklyHovered(true)}
            onMouseLeave={() => setIsThinklyHovered(false)}
            onClick={() => onStart && onStart()}
          >
            <div className={`absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-xl transition-opacity duration-400 ${isThinklyHovered ? 'opacity-80' : 'opacity-0'}`} />
            <div className="relative flex items-center justify-center gap-2 sm:gap-3 z-10">
              <svg 
                className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 ${isThinklyHovered ? 'scale-110' : 'scale-100'}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span className="text-white font-semibold tracking-wide">Talk to Thinkly</span>
              <svg 
                className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 ${isThinklyHovered ? 'translate-x-1' : 'translate-x-0'}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
            {isThinklyHovered && (
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_1.5s_ease-in-out]" />
              </div>
            )}
          </button>
        </div>

        {/* Secondary CTA */}
        <button
          className="relative px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm font-medium border border-white/20 cursor-pointer transition-all duration-300 bg-white/5 backdrop-blur-lg hover:scale-105 hover:bg-white/10 active:scale-95 animate-[fadeInUp_0.6s_ease-out_0.7s_forwards] opacity-0"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={checkBackend}
        >
          <span className="relative text-white/80 font-medium z-10">
            {isHovered ? "🔄 Checking..." : "Check Backend Status"}
          </span>
        </button>

        {message && (
          <p className="mt-5 sm:mt-6 text-xs sm:text-sm text-white/40 font-mono animate-[fadeIn_0.4s_ease-out]">
            {message}
          </p>
        )}

        {/* Agents Grid */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-12 sm:mt-16 max-w-[1200px] animate-[fadeInUp_0.6s_ease-out_0.9s_forwards] opacity-0">
          {agents.map((agent, index) => (
            <div
              key={agent.name}
              className="relative"
              onMouseEnter={() => setHoveredAgent(index)}
              onMouseLeave={() => setHoveredAgent(null)}
            >
              <button
                className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-lg cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-white/10 flex items-center gap-1.5 sm:gap-2"
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
                  className="text-base sm:text-lg transition-transform duration-300 hover:scale-110 inline-block"
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.1)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                >
                  {agent.icon}
                </span>
                <span 
                  className="text-xs sm:text-sm text-white/70 font-medium transition-colors duration-300 hover:text-white/90"
                  onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255, 255, 255, 0.9)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)"; }}
                >
                  {agent.name}
                </span>
              </button>

              {hoveredAgent === index && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg bg-black/90 backdrop-blur-lg border border-white/10 whitespace-nowrap z-20 animate-[fadeInUp_0.2s_ease-out]">
                  <p className="text-xs text-white/80">{agent.description}</p>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-black/90 rotate-45 border-r border-b border-white/10" />
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-5 sm:py-6 border-t border-white/5 animate-[fadeIn_0.6s_ease-out]">
        <p className="text-[10px] sm:text-xs text-white/20">© 2025 ThinklyLabs LLP</p>
      </footer>
    </div>
  );
};

export default HeroScreen;