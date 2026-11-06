import type { Match } from "@/lib/football-api/types";

export type TeamMatchesSummary = {
  lastResult: Match | null;
  upcoming: Match[];
};

const UPCOMING = new Set(["IN_PLAY", "PAUSED", "SCHEDULED", "TIMED"]);
const UPCOMING_LIMIT = 3;

export function summarizeTeamMatches(matches: Match[]): TeamMatchesSummary {
  const finished = matches
    .filter((match) => match.status === "FINISHED")
    .sort((a, b) => b.utcDate.localeCompare(a.utcDate));
  const upcoming = matches
    .filter((match) => UPCOMING.has(match.status))
    .sort((a, b) => a.utcDate.localeCompare(b.utcDate))
    .slice(0, UPCOMING_LIMIT);
  return { lastResult: finished[0] ?? null, upcoming };
}
