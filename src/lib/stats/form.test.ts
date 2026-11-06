import { describe, expect, it } from "vitest";
import bsaSeason from "@/lib/football-api/__fixtures__/matches-bsa-season.json";
import cliSeason from "@/lib/football-api/__fixtures__/matches-cli.json";
import { matchesResponseSchema } from "@/lib/football-api/schemas";
import { matchResultFor, recentForm } from "./form";

const bsaMatches = matchesResponseSchema.parse(bsaSeason).matches;
const cliMatches = matchesResponseSchema.parse(cliSeason).matches;
const FLAMENGO_ID = 1783;

describe("recentForm", () => {
  it("returns the last five finished matches in chronological order", () => {
    const form = recentForm(bsaMatches, FLAMENGO_ID);
    expect(form).toHaveLength(5);
    expect(form.every((e) => e.match.status === "FINISHED")).toBe(true);
    const dates = form.map((e) => e.match.utcDate);
    expect(dates).toEqual([...dates].sort());
    const lastFinished = bsaMatches
      .filter(
        (m) =>
          m.status === "FINISHED" &&
          (m.homeTeam.id === FLAMENGO_ID || m.awayTeam.id === FLAMENGO_ID),
      )
      .map((m) => m.utcDate)
      .sort()
      .at(-1);
    expect(dates.at(-1)).toBe(lastFinished);
  });

  it("returns an empty list for a team without matches", () => {
    expect(recentForm(bsaMatches, 999)).toEqual([]);
  });
});

describe("matchResultFor", () => {
  it("reads wins and losses from the winner", () => {
    const match = bsaMatches.find(
      (m) => m.status === "FINISHED" && m.score.winner === "HOME_TEAM",
    );
    expect(match && matchResultFor(match, match.homeTeam.id ?? 0)).toBe("W");
    expect(match && matchResultFor(match, match.awayTeam.id ?? 0)).toBe("L");
  });

  it("ignores the penalty shootout and uses the match score", () => {
    const shootout = cliMatches.find(
      (m) => m.score.duration === "PENALTY_SHOOTOUT",
    );
    expect(
      shootout && matchResultFor(shootout, shootout.homeTeam.id ?? 0),
    ).toBe("W");
    expect(
      shootout && matchResultFor(shootout, shootout.awayTeam.id ?? 0),
    ).toBe("L");
  });

  it("counts a level match decided on penalties as a draw", () => {
    const shootout = cliMatches.find(
      (m) => m.score.duration === "PENALTY_SHOOTOUT",
    );
    if (!shootout) {
      throw new Error("fixture without shootout");
    }
    const level = {
      ...shootout,
      score: {
        ...shootout.score,
        winner: "AWAY_TEAM" as const,
        fullTime: { home: 3, away: 5 },
        regularTime: { home: 1, away: 1 },
        penalties: { home: 2, away: 4 },
      },
    };
    expect(matchResultFor(level, level.homeTeam.id ?? 0)).toBe("D");
  });

  it("returns null for matches not finished", () => {
    const timed = bsaMatches.find((m) => m.status === "TIMED");
    expect(timed && matchResultFor(timed, timed.homeTeam.id ?? 0)).toBeNull();
  });
});
