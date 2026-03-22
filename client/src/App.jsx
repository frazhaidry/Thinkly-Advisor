import { useState } from "react";
import HeroScreen from "./Home/Hero";

function App() {
  const [started, setStarted] = useState(false);

  // ChatWindow will be swapped in here once built
  return (
    <div>
      {!started ? (
        <HeroScreen onStart={() => setStarted(true)} />
      ) : (
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
          <p className="text-white/40 font-mono text-sm">
            Chat coming soon — hero confirmed working ✓
          </p>
        </div>
      )}
    </div>
  );
}

export default App;