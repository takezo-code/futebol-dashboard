import { describe, expect, it } from "vitest";
import teamMatches from "@/lib/football-api/__fixtures__/team-matches.json";
import { matchesResponseSchema } from "@/lib/football-api/schemas";
import { summarizeTeamMatches } from "./summary";

const matches = matchesResponseSchema.parse(teamMatches).matches;

describe("summarizeTeamMatches", () => {
  it("picks the latest result and up to three next matches", () => {
    const { lastResult, upcoming } = summarizeTeamMatches(matches);
    const latestFinished = matches
      .filter((m) => m.status === "FINISHED")
      .map((m) => m.utcDate)
      .sort()
      .at(-1);
    expect(lastResult?.utcDate).toBe(latestFinished);
    expect(upcoming.length).toBeLessThanOrEqual(3);
    expect(upcoming.length).toBeGreaterThan(0);
    const dates = upcoming.map((m) => m.utcDate);
    expect(dates).toEqual([...dates].sort());
    expect(
      upcoming.every((m) =>
        ["SCHEDULED", "TIMED", "IN_PLAY", "PAUSED"].includes(m.status),
      ),
    ).toBe(true);
  });

  it("handles a team without matches", () => {
    expect(summarizeTeamMatches([])).toEqual({
      lastResult: null,
      upcoming: [],
    });
  });
});
