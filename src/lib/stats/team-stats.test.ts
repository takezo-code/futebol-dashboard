import { describe, expect, it } from "vitest";
import bsaSeason from "@/lib/football-api/__fixtures__/matches-bsa-season.json";
import teamMatches from "@/lib/football-api/__fixtures__/team-matches.json";
import { matchesResponseSchema } from "@/lib/football-api/schemas";
import type { Match } from "@/lib/football-api/types";
import { computeTeamStats } from "./team-stats";

const FLAMENGO_ID = 1783;
const FLUMINENSE_ID = 1765;
const bsaMatches = matchesResponseSchema.parse(bsaSeason).matches;
const flamengoMatches = bsaMatches.filter(
  (m) => m.homeTeam.id === FLAMENGO_ID || m.awayTeam.id === FLAMENGO_ID,
);
const fluminenseMatches = matchesResponseSchema.parse(teamMatches).matches;

function synthetic(results: ("W" | "D" | "L")[]): Match[] {
  const template = flamengoMatches.find((m) => m.status === "FINISHED");
  if (!template) {
    throw new Error("fixture without finished match");
  }
  return results.map((result, index) => ({
    ...template,
    id: index,
    utcDate: `2026-01-${String(index + 10)}T20:00:00Z`,
    homeTeam: { ...template.homeTeam, id: FLAMENGO_ID },
    awayTeam: { ...template.awayTeam, id: 1 },
    score: {
      ...template.score,
      duration: "REGULAR",
      winner:
        result === "W" ? "HOME_TEAM" : result === "L" ? "AWAY_TEAM" : "DRAW",
      fullTime: {
        home: result === "W" ? 1 : 0,
        away: result === "L" ? 1 : 0,
      },
    },
  }));
}

describe("computeTeamStats", () => {
  it("matches the official table for a league-only season", () => {
    expect(computeTeamStats(flamengoMatches, FLAMENGO_ID).overall).toEqual({
      played: 34,
      won: 23,
      drawn: 7,
      lost: 4,
      points: 76,
      percentage: 75,
    });
  });

  it("splits home and away", () => {
    const { overall, home, away } = computeTeamStats(
      flamengoMatches,
      FLAMENGO_ID,
    );
    expect(home.played + away.played).toBe(overall.played);
    expect(home.points + away.points).toBe(overall.points);
  });

  it("averages goals per match", () => {
    const stats = computeTeamStats(flamengoMatches, FLAMENGO_ID);
    expect(stats.goalsForAverage).toBeCloseTo(71 / 34, 5);
    expect(stats.goalsAgainstAverage).toBeCloseTo(29 / 34, 5);
  });

  it("counts the longest win streak", () => {
    const matches = synthetic(["W", "W", "L", "W", "W", "W", "D"]);
    expect(computeTeamStats(matches, FLAMENGO_ID).longestWinStreak).toBe(3);
  });

  it("handles a team without finished matches", () => {
    const stats = computeTeamStats([], FLAMENGO_ID);
    expect(stats.overall.percentage).toBeNull();
    expect(stats.home.percentage).toBeNull();
    expect(stats.goalsForAverage).toBeNull();
    expect(stats.goalsAgainstAverage).toBeNull();
    expect(stats.longestWinStreak).toBe(0);
  });

  it("includes every competition it receives", () => {
    const finished = fluminenseMatches.filter((m) => m.status === "FINISHED");
    expect(
      computeTeamStats(fluminenseMatches, FLUMINENSE_ID).overall.played,
    ).toBe(finished.length);
  });
});
