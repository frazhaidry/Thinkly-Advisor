import { useState } from "react";
import HeroScreen from "./Home/Hero";
import ChatWindow from "./components/Chat/ChatWindow.jsx";

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      {/* Hero is always mounted — slides left when chat opens */}
      <HeroScreen onStart={() => setIsChatOpen(true)} />

      {/* Backdrop overlay */}
      <div
        onClick={() => setIsChatOpen(false)}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(4px)",
          zIndex: 40,
          opacity: isChatOpen ? 1 : 0,
          pointerEvents: isChatOpen ? "all" : "none",
          transition: "opacity 0.35s ease",
        }}
      />

      {/* Slide-in chat panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          width: "min(480px, 100vw)",
          zIndex: 50,
          transform: isChatOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)",
          boxShadow: isChatOpen
            ? "-8px 0 48px rgba(0,0,0,0.6), -1px 0 0 rgba(255,255,255,0.06)"
            : "none",
        }}
      >
        <ChatWindow onClose={() => setIsChatOpen(false)} />
      </div>
    </div>
  );
}

export default App;