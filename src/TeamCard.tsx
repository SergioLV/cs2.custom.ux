import { Player } from "./types";

interface Props {
  label: string;
  players: Player[];
  color: "ct" | "t";
  index: number;
}

function statLabel(key: string): string {
  const map: Record<string, string> = {
    hours: "Hours",
    kd: "K/D",
    headshot_pct: "HS%",
    winrate: "Win%",
    accuracy: "Acc%",
    damage_per_round: "ADR",
    mvps_per_match: "MVPs",
  };
  return map[key] ?? key;
}

function fmtStat(key: string, val: number): string {
  if (key === "headshot_pct" || key === "winrate" || key === "accuracy")
    return `${(val * 100).toFixed(1)}%`;
  if (key === "hours") return val.toFixed(0);
  return val.toFixed(2);
}

function scoreRank(score: number): { label: string; cls: string } {
  if (score >= 1.5) return { label: "★★★", cls: "rank-elite" };
  if (score >= 1.0) return { label: "★★", cls: "rank-high" };
  if (score >= 0.5) return { label: "★", cls: "rank-mid" };
  return { label: "—", cls: "rank-low" };
}

export default function TeamCard({ label, players, color, index }: Props) {
  const avgScore =
    players.reduce((s, p) => s + p.score, 0) / (players.length || 1);
  const maxScore = Math.max(...players.map((p) => p.score), 1);

  return (
    <div
      className={`team-card team-${color}`}
      style={{ animationDelay: `${index * 0.15}s` }}
    >
      <div className="team-header">
        <div className="team-header-left">
          <div className={`team-dot team-dot-${color}`} />
          <h2>{label}</h2>
        </div>
        <div className="team-header-right">
          <span className="avg-score-label">AVG</span>
          <span className={`avg-score-val avg-score-${color}`}>{avgScore.toFixed(2)}</span>
        </div>
      </div>

      <div className="players">
        {players.map((p, i) => {
          const rank = scoreRank(p.score);
          const barPct = (p.score / maxScore) * 100;
          return (
            <div
              key={p.steam_id}
              className="player-card"
              style={{ animationDelay: `${index * 0.15 + i * 0.06}s` }}
            >
              <div className="player-top">
                <div className="player-identity">
                  <span className="player-rank-num">#{i + 1}</span>
                  <span className="player-name">{p.vanity_url}</span>
                  <span className={`player-rank-badge ${rank.cls}`}>{rank.label}</span>
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
                {Object.entries(p.stats).map(([k, v]) => (
                  <div key={k} className="stat">
                    <span className="stat-val">{fmtStat(k, v)}</span>
                    <span className="stat-label">{statLabel(k)}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
