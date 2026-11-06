import { describe, expect, it } from "vitest";
import bsaSeason from "@/lib/football-api/__fixtures__/matches-bsa-season.json";
import cliSeason from "@/lib/football-api/__fixtures__/matches-cli.json";
import { matchesResponseSchema } from "@/lib/football-api/schemas";
import type { Match } from "@/lib/football-api/types";
import { buildRounds, pickRound, scoreLine } from "./rounds";

const bsaMatches = matchesResponseSchema.parse(bsaSeason).matches;
const cliMatches = matchesResponseSchema.parse(cliSeason).matches;
const now = new Date("2026-11-06T12:00:00Z");

function finished(matches: Match[]): Match[] {
  return matches.map((m) => ({ ...m, status: "FINISHED" }));
}

describe("buildRounds", () => {
  it("builds one round per league matchday", () => {
    const rounds = buildRounds(bsaMatches);
    expect(rounds).toHaveLength(38);
    expect(rounds[33]?.key).toBe("34");
    expect(rounds[33]?.label).toBe("Rodada 34");
    expect(rounds[33]?.matches).toHaveLength(10);
  });

  it("groups each knockout stage into one round", () => {
    const rounds = buildRounds(cliMatches);
    expect(rounds[0]?.label).toBe("Fase preliminar 1");
    expect(rounds[0]?.key).toBe("round_1");
    expect(rounds[0]?.matches).toHaveLength(6);
    const quarterFinals = rounds.find((r) => r.label === "Quartas de final");
    expect(quarterFinals?.matches).toHaveLength(8);
    expect(rounds.map((r) => r.label)).toContain("Rodada 6");
  });

  it("sorts matches inside a round by date", () => {
    const dates = buildRounds(bsaMatches)[0]?.matches.map((m) => m.utcDate);
    expect(dates).toEqual([...(dates ?? [])].sort());
  });
});

describe("pickRound", () => {
  const rounds = buildRounds(bsaMatches);

  it("returns the requested round when it exists", () => {
    expect(pickRound(rounds, "10", now)?.key).toBe("10");
  });

  it("falls back to the current round for unknown keys", () => {
    expect(pickRound(rounds, "abc", now)?.key).toBe("34");
    expect(pickRound(rounds, undefined, now)?.key).toBe("34");
  });

  it("returns the last round when the season is over", () => {
    expect(
      pickRound(
        buildRounds(finished(bsaMatches)),
        undefined,
        new Date("2027-01-01T12:00:00Z"),
      )?.key,
    ).toBe("38");
  });

  it("returns null without rounds", () => {
    expect(pickRound([], undefined, now)).toBeNull();
  });
});

describe("scoreLine", () => {
  it("separates regular time from the penalty shootout", () => {
    const shootout = cliMatches.find(
      (m) => m.score.duration === "PENALTY_SHOOTOUT",
    );
    expect(shootout && scoreLine(shootout)).toEqual({
      home: 1,
      away: 0,
      penalties: { home: 5, away: 3 },
    });
  });

  it("returns nulls for matches without score", () => {
    const unplayed = bsaMatches.find((m) => m.score.fullTime.home === null);
    expect(unplayed && scoreLine(unplayed)).toEqual({
      home: null,
      away: null,
      penalties: null,
    });
  });
});
