import type { Match } from "@/lib/football-api/types";
import { scoreLine } from "./rounds";

export type FormResult = "W" | "D" | "L";

export type FormEntry = {
  result: FormResult;
  match: Match;
};

export function matchResultFor(
  match: Match,
  teamId: number,
): FormResult | null {
  if (match.status !== "FINISHED") {
    return null;
  }
  const isHome = match.homeTeam.id === teamId;
  if (match.score.duration === "PENALTY_SHOOTOUT") {
    const { home, away } = scoreLine(match);
    if (home === null || away === null) {
      return null;
    }
    if (home === away) {
      return "D";
    }
    return home > away === isHome ? "W" : "L";
  }
  if (match.score.winner === "DRAW") {
    return "D";
  }
  if (match.score.winner === null) {
    return null;
  }
  return (match.score.winner === "HOME_TEAM") === isHome ? "W" : "L";
}

export function recentForm(
  matches: Match[],
  teamId: number,
  limit = 5,
): FormEntry[] {
  return matches
    .filter(
      (match) => match.homeTeam.id === teamId || match.awayTeam.id === teamId,
    )
    .sort((a, b) => a.utcDate.localeCompare(b.utcDate))
    .flatMap((match) => {
      const result = matchResultFor(match, teamId);
      return result === null ? [] : [{ result, match }];
    })
    .slice(-limit);
}
