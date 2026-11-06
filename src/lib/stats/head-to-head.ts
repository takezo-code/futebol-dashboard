import type { Match } from "@/lib/football-api/types";
import { matchResultFor } from "./form";

export type HeadToHead = {
  matches: Match[];
  aWins: number;
  draws: number;
  bWins: number;
};

export function headToHead(
  matches: Match[],
  aId: number,
  bId: number,
): HeadToHead {
  const meetings = matches
    .filter((match) => {
      const ids = [match.homeTeam.id, match.awayTeam.id];
      return ids.includes(aId) && ids.includes(bId);
    })
    .sort((a, b) => a.utcDate.localeCompare(b.utcDate));

  const tally = { aWins: 0, draws: 0, bWins: 0 };
  for (const match of meetings) {
    const result = matchResultFor(match, aId);
    if (result === "W") {
      tally.aWins += 1;
    } else if (result === "D") {
      tally.draws += 1;
    } else if (result === "L") {
      tally.bWins += 1;
    }
  }
  return { matches: meetings, ...tally };
}
