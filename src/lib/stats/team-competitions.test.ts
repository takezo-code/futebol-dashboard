import { describe, expect, it } from "vitest";
import teamMatches from "@/lib/football-api/__fixtures__/team-matches.json";
import { matchesResponseSchema } from "@/lib/football-api/schemas";
import {
  filterByCompetition,
  pickTeamCompetition,
  teamCompetitions,
} from "./team-competitions";

const matches = matchesResponseSchema.parse(teamMatches).matches;
const options = teamCompetitions(matches);

describe("teamCompetitions", () => {
  it("lists the competitions with the most played first", () => {
    expect(options.map((o) => o.code)).toEqual(["BSA", "CLI"]);
    expect(options[1]?.name).toBe("Copa Libertadores");
    expect(options.reduce((sum, o) => sum + o.matchCount, 0)).toBe(
      matches.length,
    );
  });

  it("returns an empty list without matches", () => {
    expect(teamCompetitions([])).toEqual([]);
  });
});

describe("pickTeamCompetition", () => {
  it("defaults to the competition with most matches", () => {
    expect(pickTeamCompetition(options, undefined)).toBe("BSA");
    expect(pickTeamCompetition(options, "XYZ")).toBe("BSA");
  });

  it("honors a valid request and the all option", () => {
    expect(pickTeamCompetition(options, "CLI")).toBe("CLI");
    expect(pickTeamCompetition(options, "todas")).toBeNull();
  });

  it("returns null without options", () => {
    expect(pickTeamCompetition([], undefined)).toBeNull();
  });
});

describe("filterByCompetition", () => {
  it("keeps only the chosen competition", () => {
    const cli = filterByCompetition(matches, "CLI");
    expect(cli.length).toBeGreaterThan(0);
    expect(cli.every((m) => m.competition.code === "CLI")).toBe(true);
  });

  it("keeps everything for null", () => {
    expect(filterByCompetition(matches, null)).toHaveLength(matches.length);
  });
});
