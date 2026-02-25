import type { Player } from "./types";

interface Props {
  teamA: Player[];
  teamB: Player[];
}

export default function ScoreCompare({ teamA, teamB }: Props) {
  const avgA = teamA.reduce((s, p) => s + p.score, 0) / (teamA.length || 1);
  const avgB = teamB.reduce((s, p) => s + p.score, 0) / (teamB.length || 1);
  const total = avgA + avgB || 1;
  const pctA = (avgA / total) * 100;
  const diff = Math.abs(avgA - avgB);

  return (
    <div className="score-compare">
      <div className="score-compare-header">
        <span className="sc-team sc-team-ct">Team A — {avgA.toFixed(2)}</span>
        <span className="sc-diff">Δ {diff.toFixed(2)}</span>
        <span className="sc-team sc-team-t">{avgB.toFixed(2)} — Team B</span>
      </div>
      <div className="sc-bar-track">
        <div className="sc-bar-a" style={{ width: `${pctA}%` }} />
        <div className="sc-bar-divider" />
        <div className="sc-bar-b" style={{ width: `${100 - pctA}%` }} />
      </div>
    </div>
  );
}
