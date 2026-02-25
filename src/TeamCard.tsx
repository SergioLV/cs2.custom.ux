import type { Player } from "./types";

interface Props {
  label: string;
  players: Player[];
  color: "ct" | "t";
  index: number;
}

const STAT_CONFIG: Record<string, { label: string; full: string; max: number; fmt: (v: number) => string }> = {
  hours: { label: "HRS", full: "Hours Played", max: 5000, fmt: (v) => v.toFixed(0) },
  kd: { label: "K/D", full: "Kill/Death Ratio", max: 2.0, fmt: (v) => v.toFixed(2) },
  headshot_pct: { label: "HS%", full: "Headshot Percentage", max: 1, fmt: (v) => `${(v * 100).toFixed(1)}%` },
  winrate: { label: "WIN", full: "Win Rate", max: 1, fmt: (v) => `${(v * 100).toFixed(1)}%` },
  accuracy: { label: "ACC", full: "Accuracy", max: 0.5, fmt: (v) => `${(v * 100).toFixed(1)}%` },
  damage_per_round: { label: "ADR", full: "Avg Damage/Round", max: 200, fmt: (v) => v.toFixed(1) },
  mvps_per_match: { label: "MVP", full: "MVPs per Match", max: 5, fmt: (v) => v.toFixed(1) },
};

function statColor(key: string, val: number): string {
  const cfg = STAT_CONFIG[key];
  if (!cfg) return "";
  const pct = Math.min(val / cfg.max, 1);
  if (pct >= 0.7) return "stat-hot";
  if (pct >= 0.4) return "stat-warm";
  return "stat-cold";
}

function scoreRank(score: number): { label: string; cls: string; title: string } {
  if (score >= 1.5) return { label: "★★★", cls: "rank-elite", title: "Elite" };
  if (score >= 1.0) return { label: "★★", cls: "rank-high", title: "High" };
  if (score >= 0.5) return { label: "★", cls: "rank-mid", title: "Average" };
  return { label: "—", cls: "rank-low", title: "Below Average" };
}

export default function TeamCard({ label, players, color, index }: Props) {
  const avgScore = players.reduce((s, p) => s + p.score, 0) / (players.length || 1);
  const maxScore = Math.max(...players.map((p) => p.score), 1);
  const totalScore = players.reduce((s, p) => s + p.score, 0);

  return (
    <div
      className={`team-card team-${color}`}
      style={{ animationDelay: `${index * 0.2}s` }}
    >
      {/* Animated glow border */}
      <div className={`card-glow card-glow-${color}`} />

      <div className="team-header">
        <div className="team-header-left">
          <div className={`team-dot team-dot-${color}`} />
          <h2>{label}</h2>
          <span className="team-player-count">{players.length} players</span>
        </div>
        <div className="team-header-right">
          <div className="team-scores">
            <div className="score-item">
              <span className="score-micro-label">AVG</span>
              <span className={`avg-score-val avg-score-${color}`}>{avgScore.toFixed(2)}</span>
            </div>
            <div className="score-divider" />
            <div className="score-item">
              <span className="score-micro-label">TOTAL</span>
              <span className={`avg-score-val avg-score-${color}`}>{totalScore.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="players">
        {players.map((p, i) => {
          const rank = scoreRank(p.score);
          const barPct = (p.score / maxScore) * 100;
          const profileUrl = `https://steamcommunity.com/id/${p.vanity_url}`;
          return (
            <div
              key={p.steam_id}
              className="player-card"
              style={{ animationDelay: `${index * 0.2 + i * 0.08}s` }}
            >
              <div className="player-top">
                <div className="player-identity">
                  <span className="player-rank-num">#{i + 1}</span>
                  <a
                    href={profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`player-name player-name-${color}`}
                    title={`Open ${p.vanity_url}'s Steam profile`}
                  >
                    {p.vanity_url}
                    <svg className="link-icon" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                  <span className={`player-rank-badge ${rank.cls}`} title={rank.title}>
                    {rank.label}
                  </span>
                </div>
                <span className="player-score">{p.score.toFixed(2)}</span>
              </div>

              <div className="score-bar-track">
                <div
                  className={`score-bar-fill score-bar-${color}`}
                  style={{ width: `${barPct}%` }}
                />
              </div>

              <div className="stat-grid">
                {Object.entries(p.stats).map(([k, v]) => {
                  const cfg = STAT_CONFIG[k];
                  if (!cfg) return null;
                  const pct = Math.min(v / cfg.max, 1) * 100;
                  return (
                    <div key={k} className={`stat ${statColor(k, v)}`} title={cfg.full}>
                      <span className="stat-val">{cfg.fmt(v)}</span>
                      <div className="stat-mini-bar">
                        <div
                          className={`stat-mini-fill stat-mini-${color}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="stat-label">{cfg.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
