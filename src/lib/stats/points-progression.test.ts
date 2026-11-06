import { describe, expect, it } from "vitest";
import bsaSeason from "@/lib/football-api/__fixtures__/matches-bsa-season.json";
import cliSeason from "@/lib/football-api/__fixtures__/matches-cli.json";
import standingsCli from "@/lib/football-api/__fixtures__/standings-cli.json";
import {
  matchesResponseSchema,
  standingsResponseSchema,
} from "@/lib/football-api/schemas";
import { headToHead } from "./head-to-head";
import { pointsProgression } from "./points-progression";

const FLAMENGO_ID = 1783;
const FLUMINENSE_ID = 1765;
const bsaMatches = matchesResponseSchema.parse(bsaSeason).matches;
const cliMatches = matchesResponseSchema.parse(cliSeason).matches;

describe("pointsProgression", () => {
  it("accumulates points round by round", () => {
    const progression = pointsProgression(bsaMatches, FLAMENGO_ID);
    expect(progression).toHaveLength(34);
    expect(progression.at(-1)).toEqual({ round: 34, points: 76 });
    progression.forEach((point, index) => {
      expect(point.round).toBe(index + 1);
      if (index > 0) {
        expect(point.points).toBeGreaterThanOrEqual(
          progression[index - 1]?.points ?? 0,
        );
      }
    });
  });

  it("repeats the total on a round without a match", () => {
    const progression = pointsProgression(bsaMatches, FLUMINENSE_ID);
    expect(progression).toHaveLength(34);
    const repeated = progression.some(
      (point, index) =>
        index > 0 && point.points === progression[index - 1]?.points,
    );
    expect(repeated).toBe(true);
    expect(progression.at(-1)?.points).toBe(54);
  });

  it("uses only group stage rounds in cups", () => {
    const progression = pointsProgression(cliMatches, FLAMENGO_ID);
    const row = standingsResponseSchema
      .parse(standingsCli)
      .standings.find((s) => s.type === "TOTAL")
      ?.table.find((r) => r.team.id === FLAMENGO_ID);
    expect(progression.map((p) => p.round)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(progression.at(-1)?.points).toBe(row?.points);
  });

  it("returns nothing without matches", () => {
    expect(pointsProgression([], FLAMENGO_ID)).toEqual([]);
  });
});

describe("headToHead", () => {
  it("lists the meetings in date order with the tally", () => {
    const result = headToHead(bsaMatches, FLAMENGO_ID, FLUMINENSE_ID);
    expect(result.matches.map((m) => m.utcDate)).toEqual([
      "2026-04-12T21:00:00Z",
      "2026-10-11T20:30:00Z",
    ]);
    expect(result).toMatchObject({ aWins: 2, draws: 0, bWins: 0 });
  });

  it("is empty when the teams never met", () => {
    expect(headToHead(bsaMatches, FLAMENGO_ID, 999)).toEqual({
      matches: [],
      aWins: 0,
      draws: 0,
      bWins: 0,
    });
  });
});
