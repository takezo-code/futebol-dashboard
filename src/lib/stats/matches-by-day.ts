import type { Match } from "@/lib/football-api/types";
import { brasiliaDayKey } from "@/lib/format";

export type MatchDay = {
  day: string;
  matches: Match[];
};

export function groupMatchesByDay(matches: Match[]): MatchDay[] {
  const byDay = new Map<string, Match[]>();
  for (const match of [...matches].sort((a, b) =>
    a.utcDate.localeCompare(b.utcDate),
  )) {
    const day = brasiliaDayKey(new Date(match.utcDate));
    byDay.set(day, [...(byDay.get(day) ?? []), match]);
  }
  return [...byDay.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, dayMatches]) => ({ day, matches: dayMatches }));
}
