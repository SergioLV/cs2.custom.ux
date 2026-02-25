import { useState, useRef } from "react";
import { balanceTeams } from "./api";
import type { BalanceResponse } from "./types";
import TeamCard from "./TeamCard";
import ParticleGrid from "./ParticleGrid";
import LoadingOverlay from "./LoadingOverlay";
import ScoreCompare from "./ScoreCompare";
import "./App.css";

const EMPTY_URLS = Array(10).fill("");

function App() {
  const [urls, setUrls] = useState<string[]>(EMPTY_URLS);
  const [result, setResult] = useState<BalanceResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLElement>(null);

  const filledCount = urls.filter((u) => u.trim()).length;

  const updateUrl = (i: number, val: string) => {
    setUrls((prev) => prev.map((u, idx) => (idx === i ? val : u)));
  };

  const handleSubmit = async () => {
    const filled = urls.map((u) => u.trim()).filter(Boolean);
    if (filled.length !== 10) {
      setError("Need exactly 10 vanity URLs");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);
    setShowResults(false);
    try {
      const data = await balanceTeams(filled);
      setResult(data);
      // Small delay for the reveal animation
      setTimeout(() => {
        setShowResults(true);
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }, 300);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <ParticleGrid />

      {/* Animated background orbs */}
      <div className="bg-orbs" aria-hidden="true">
        <div className="orb orb-ct" />
        <div className="orb orb-t" />
        <div className="orb orb-accent" />
      </div>

      {loading && <LoadingOverlay />}

      <header className="header">
        <div className="logo">
          <svg className="logo-crosshair" viewBox="0 0 48 48" width="52" height="52" aria-hidden="true">
            <circle cx="24" cy="24" r="20" fill="none" stroke="url(#grad)" strokeWidth="1" opacity="0.3" />
            <circle cx="24" cy="24" r="14" fill="none" stroke="url(#grad)" strokeWidth="1.5" opacity="0.6" />
            <circle cx="24" cy="24" r="8" fill="none" stroke="url(#grad)" strokeWidth="2" />
            <line x1="24" y1="2" x2="24" y2="14" stroke="url(#grad)" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="24" y1="34" x2="24" y2="46" stroke="url(#grad)" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="2" y1="24" x2="14" y2="24" stroke="url(#grad)" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="34" y1="24" x2="46" y2="24" stroke="url(#grad)" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="24" cy="24" r="2.5" fill="url(#grad)" />
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="48" y2="48">
                <stop offset="0%" stopColor="var(--ct)" />
                <stop offset="50%" stopColor="#fff" />
                <stop offset="100%" stopColor="var(--t)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="logo-text">
            <h1>CS2 Team Matcher</h1>
            <p className="subtitle">Drop 10 Steam profile URLs. Get two balanced squads.</p>
          </div>
        </div>
      </header>

      <section className="input-section">
        <div className="section-label">
          <span>Player Roster</span>
          <div className="fill-indicator">
            <div className="fill-bar-track">
              <div
                className="fill-bar-fill"
                style={{ width: `${(filledCount / 10) * 100}%` }}
              />
            </div>
            <span className={`fill-count ${filledCount === 10 ? "fill-ready" : ""}`}>
              {filledCount}/10
            </span>
          </div>
        </div>

        <div className="input-grid">
          {urls.map((url, i) => (
            <div key={i} className={`input-row ${url.trim() ? "has-value" : ""}`}>
              <span className={`player-num ${url.trim() ? "num-active" : ""}`}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <input
                type="text"
                value={url}
                onChange={(e) => updateUrl(i, e.target.value)}
                placeholder={`https://steamcommunity.com/id/player${i + 1}`}
                className="vanity-input"
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
              {url.trim() && (
                <span className="check-mark">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4dff88" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
              )}
            </div>
          ))}
        </div>

        {error && <p className="error">{error}</p>}

        <button
          className={`balance-btn ${filledCount === 10 ? "btn-ready" : ""}`}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <span className="spinner" />
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              Balance Teams
            </>
          )}
        </button>
      </section>

      {result && showResults && (
        <section className="results-wrapper" ref={resultsRef}>
          <ScoreCompare teamA={result.team_a} teamB={result.team_b} />
          <div className="results">
            <TeamCard label="Team A" players={result.team_a} color="ct" index={0} />
            <div className="vs-container">
              <div className="vs-line" />
              <div className="vs-badge">
                <span>VS</span>
              </div>
              <div className="vs-line" />
            </div>
            <TeamCard label="Team B" players={result.team_b} color="t" index={1} />
          </div>
        </section>
      )}
    </div>
  );
}

export default App;
