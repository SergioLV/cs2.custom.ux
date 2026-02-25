export interface PlayerStats {
  hours: number;
  kd: number;
  headshot_pct: number;
  winrate: number;
  accuracy: number;
  damage_per_round: number;
  mvps_per_match: number;
}

export interface Player {
  vanity_url: string;
  steam_id: string;
  score: number;
  stats: PlayerStats;
}

export interface BalanceResponse {
  team_a: Player[];
  team_b: Player[];
}
