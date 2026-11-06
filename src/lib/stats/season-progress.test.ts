import { describe, expect, it } from "vitest";
import bsaSeason from "@/lib/football-api/__fixtures__/matches-bsa-season.json";
import cliSeason from "@/lib/football-api/__fixtures__/matches-cli.json";
import { matchesResponseSchema } from "@/lib/football-api/schemas";
import type { Season } from "@/lib/football-api/types";
import { seasonProgress } from "./season-progress";

const bsaMatches = matchesResponseSchema.parse(bsaSeason).matches;
const cliMatches = matchesResponseSchema.parse(cliSeason).matches;
const now = new Date("2026-11-06T12:00:00Z");

const bsa: Season = {
  id: 2474,
  startDate: "2026-01-28",
  endDate: "2026-12-02",
  currentMatchday: 34,
  winner: null,
};
const cli: Season = {
  id: 2466,
  startDate: "2026-02-04",
  endDate: "2026-11-28",
  currentMatchday: 6,
  winner: null,
};

describe("seasonProgress", () => {
  it("counts rounds and finished matches in a league", () => {
    const finished = bsaMatches.filter((m) => m.status === "FINISHED").length;
    expect(seasonProgress(bsa, bsaMatches, now)).toEqual({
      label: "Rodada 34",
      detail: "de 38",
      percent: Math.round((finished / bsaMatches.length) * 100),
    });
  });

  it("uses the current stage and elapsed time in a cup", () => {
    const progress = seasonProgress(cli, cliMatches, now);
    expect(progress.label).toBe("Final");
    expect(progress.detail).toBeNull();
    expect(progress.percent).toBeGreaterThan(80);
    expect(progress.percent).toBeLessThan(100);
  });

  it("announces a season that has not started", () => {
    expect(
      seasonProgress(bsa, bsaMatches, new Date("2026-01-10T12:00:00Z")),
    ).toEqual({ label: "Começa em 28/01", detail: null, percent: 0 });
  });

  it("is complete after the end date", () => {
    expect(
      seasonProgress(cli, cliMatches, new Date("2027-01-10T12:00:00Z")).percent,
    ).toBe(100);
  });

  it("omits the total when rounds have no number", () => {
    const base = bsaMatches[0];
    if (!base) {
      throw new Error("no matches");
    }
    const progress = seasonProgress(bsa, [{ ...base, matchday: null }], now);
    expect(progress.detail).toBeNull();
  });

  it("never returns NaN without matches", () => {
    const progress = seasonProgress(bsa, [], now);
    expect(Number.isNaN(progress.percent)).toBe(false);
    expect(progress.label).not.toContain("NaN");
  });
});
