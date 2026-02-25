import { useEffect, useState } from "react";

const PHASES = [
  { text: "Fetching player profiles", icon: "🔍" },
  { text: "Analyzing stats", icon: "📊" },
  { text: "Balancing teams", icon: "⚖️" },
  { text: "Almost there", icon: "⚡" },
];

export default function LoadingOverlay() {
  const [phase, setPhase] = useState(0);
  const [dots, setDots] = useState("");

  useEffect(() => {
    const phaseTimer = setInterval(() => {
      setPhase((p) => (p + 1) % PHASES.length);
    }, 1800);
    const dotTimer = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 400);
    return () => {
      clearInterval(phaseTimer);
      clearInterval(dotTimer);
    };
  }, []);

  const current = PHASES[phase];

  return (
    <div className="loading-overlay">
      <div className="loading-card">
        <div className="loading-rings">
          <div className="ring ring-outer" />
          <div className="ring ring-middle" />
          <div className="ring ring-inner" />
          <span className="loading-icon">{current.icon}</span>
        </div>
        <p className="loading-text">
          {current.text}
          <span className="loading-dots">{dots}</span>
        </p>
        <div className="loading-bar-track">
          <div className="loading-bar-fill" />
        </div>
      </div>
    </div>
  );
}
