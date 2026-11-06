import type { Match } from "@/lib/football-api/types";
import { matchResultFor } from "./form";

export type ProgressionPoint = {
  round: number;
  points: number;
};

const MATCHDAY_STAGES = new Set([
  "REGULAR_SEASON",
  "LEAGUE_STAGE",
  "GROUP_STAGE",
]);

const POINTS = { W: 3, D: 1, L: 0 } as const;

export function pointsProgression(
  matches: Match[],
  teamId: number,
): ProgressionPoint[] {
  const played = matches.filter(
    (match) =>
      match.status === "FINISHED" &&
      MATCHDAY_STAGES.has(match.stage) &&
      match.matchday !== null,
  );
  const teamPlayed = played.filter(
    (match) => match.homeTeam.id === teamId || match.awayTeam.id === teamId,
  );
  if (teamPlayed.length === 0) {
    return [];
  }

  const rounds = [...new Set(played.map((match) => match.matchday ?? 0))].sort(
    (a, b) => a - b,
  );
  const pointsByRound = new Map<number, number>();
  for (const match of teamPlayed) {
    const result = matchResultFor(match, teamId);
    const round = match.matchday ?? 0;
    if (result !== null) {
      pointsByRound.set(
        round,
        (pointsByRound.get(round) ?? 0) + POINTS[result],
      );
    }
  }

  let total = 0;
  return rounds.map((round) => {
    total += pointsByRound.get(round) ?? 0;
    return { round, points: total };
  });
}
