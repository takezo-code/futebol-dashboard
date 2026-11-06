import type { Match } from "@/lib/football-api/types";
import { matchResultFor, type FormResult } from "./form";
import { scoreLine } from "./rounds";

export type SplitStats = {
  played: number;
  won: number;
  drawn: number;
  lost: number;
  points: number;
  percentage: number | null;
};

export type TeamStats = {
  overall: SplitStats;
  home: SplitStats;
  away: SplitStats;
  goalsForAverage: number | null;
  goalsAgainstAverage: number | null;
  longestWinStreak: number;
};

type Played = {
  result: FormResult;
  isHome: boolean;
  goalsFor: number;
  goalsAgainst: number;
};

function split(games: Played[]): SplitStats {
  const won = games.filter((game) => game.result === "W").length;
  const drawn = games.filter((game) => game.result === "D").length;
  const lost = games.filter((game) => game.result === "L").length;
  const points = won * 3 + drawn;
  const played = games.length;
  return {
    played,
    won,
    drawn,
    lost,
    points,
    percentage: played === 0 ? null : Math.round((points / (played * 3)) * 100),
  };
}

function average(total: number, count: number): number | null {
  return count === 0 ? null : total / count;
}

export function computeTeamStats(matches: Match[], teamId: number): TeamStats {
  const games: Played[] = [...matches]
    .sort((a, b) => a.utcDate.localeCompare(b.utcDate))
    .flatMap((match) => {
      const result = matchResultFor(match, teamId);
      const { home, away } = scoreLine(match);
      if (result === null || home === null || away === null) {
        return [];
      }
      const isHome = match.homeTeam.id === teamId;
      return [
        {
          result,
          isHome,
          goalsFor: isHome ? home : away,
          goalsAgainst: isHome ? away : home,
        },
      ];
    });

  let longestWinStreak = 0;
  let currentStreak = 0;
  for (const game of games) {
    currentStreak = game.result === "W" ? currentStreak + 1 : 0;
    longestWinStreak = Math.max(longestWinStreak, currentStreak);
  }

  const goalsFor = games.reduce((sum, game) => sum + game.goalsFor, 0);
  const goalsAgainst = games.reduce((sum, game) => sum + game.goalsAgainst, 0);

  return {
    overall: split(games),
    home: split(games.filter((game) => game.isHome)),
    away: split(games.filter((game) => !game.isHome)),
    goalsForAverage: average(goalsFor, games.length),
    goalsAgainstAverage: average(goalsAgainst, games.length),
    longestWinStreak,
  };
}
