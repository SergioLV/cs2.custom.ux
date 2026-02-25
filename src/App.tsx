import { useState } from "react";
import { balanceTeams } from "./api";
import type { BalanceResponse } from "./types";
import TeamCard from "./TeamCard";
import "./App.css";

const EMPTY_URLS = Array(10).fill("");

function App() {
  const [urls, setUrls] = useState<string[]>(EMPTY_URLS);
  const [result, setResult] = useState<BalanceResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    try {
      const data = await balanceTeams(filled);
      setResult(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      {/* Animated background orbs */}
      <div className="bg-orbs" aria-hidden="true">
        <div className="orb orb-ct" />
        <div className="orb orb-t" />
        <div className="orb orb-accent" />
      </div>

      <header className="header">
        <div className="logo">
          <svg className="logo-crosshair" viewBox="0 0 48 48" width="44" height="44" aria-hidden="true">
            <circle cx="24" cy="24" r="18" fill="none" stroke="url(#grad)" strokeWidth="1.5" opacity="0.5" />
            <circle cx="24" cy="24" r="10" fill="none" stroke="url(#grad)" strokeWidth="1.5" />
            <line x1="24" y1="4" x2="24" y2="16" stroke="url(#grad)" strokeWidth="1.5" />
            <line x1="24" y1="32" x2="24" y2="44" stroke="url(#grad)" strokeWidth="1.5" />
            <line x1="4" y1="24" x2="16" y2="24" stroke="url(#grad)" strokeWidth="1.5" />
            <line x1="32" y1="24" x2="44" y2="24" stroke="url(#grad)" strokeWidth="1.5" />
            <circle cx="24" cy="24" r="2" fill="url(#grad)" />
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="48" y2="48">
                <stop offset="0%" stopColor="var(--ct)" />
                <stop offset="100%" stopColor="var(--t)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="logo-text">
            <h1>CS2 Team Matcher</h1>
            <p className="subtitle">Enter 10 Steam vanity URLs to generate balanced teams</p>
          </div>
        </div>
      </header>

      <section className="input-section">
        <div className="section-label">
          <span>Player Roster</span>
          <span className={`fill-count ${filledCount === 10 ? "fill-ready" : ""}`}>
            {filledCount}/10
          </span>
        </div>

        <div className="input-grid">
          {urls.map((url, i) => (
            <div key={i} className={`input-row ${url.trim() ? "has-value" : ""}`}>
              <span className="player-num">{String(i + 1).padStart(2, "0")}</span>
              <input
                type="text"
                value={url}
                onChange={(e) => updateUrl(i, e.target.value)}
                placeholder={`Player ${i + 1} vanity URL`}
                className="vanity-input"
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
              {url.trim() && <span className="check-mark">✓</span>}
            </div>
          ))}
        </div>

        {error && <p className="error">{error}</p>}

        <button
          className="balance-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <span className="spinner" />
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              Balance Teams
            </>
          )}
        </button>
      </section>

      {result && (
        <section className="results">
          <TeamCard label="Team A" players={result.team_a} color="ct" index={0} />
          <div className="vs-container">
            <div className="vs-line" />
            <div className="vs">VS</div>
            <div className="vs-line" />
          </div>
          <TeamCard label="Team B" players={result.team_b} color="t" index={1} />
        </section>
      )}
    </div>
  );
}

export default App;
