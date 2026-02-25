import type { BalanceResponse } from "./types";

export async function balanceTeams(vanityUrls: string[]): Promise<BalanceResponse> {
  const res = await fetch("/balance", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ vanity_urls: vanityUrls }),
  });
  if (!res.ok) throw new Error(`Server error: ${res.status}`);
  return res.json();
}
