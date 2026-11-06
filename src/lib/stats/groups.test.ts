import { describe, expect, it } from "vitest";
import bsaSeason from "@/lib/football-api/__fixtures__/matches-bsa-season.json";
import cliSeason from "@/lib/football-api/__fixtures__/matches-cli.json";
import standingsBsa from "@/lib/football-api/__fixtures__/standings-bsa.json";
import standingsCli from "@/lib/football-api/__fixtures__/standings-cli.json";
import {
  matchesResponseSchema,
  standingsResponseSchema,
} from "@/lib/football-api/schemas";
import { splitIntoGroups } from "./groups";

function totalTable(data: unknown) {
  const { standings } = standingsResponseSchema.parse(data);
  return standings.find((s) => s.type === "TOTAL")?.table ?? [];
}

describe("splitIntoGroups", () => {
  it("splits libertadores into eight groups of four", () => {
    const groups = splitIntoGroups(
      totalTable(standingsCli),
      matchesResponseSchema.parse(cliSeason).matches,
    );
    expect(groups.map((g) => g.name)).toEqual([
      "Grupo A",
      "Grupo B",
      "Grupo C",
      "Grupo D",
      "Grupo E",
      "Grupo F",
      "Grupo G",
      "Grupo H",
    ]);
    for (const group of groups) {
      expect(group.rows.map((r) => r.position)).toEqual([1, 2, 3, 4]);
    }
  });

  it("keeps a league as a single unnamed group", () => {
    const groups = splitIntoGroups(
      totalTable(standingsBsa),
      matchesResponseSchema.parse(bsaSeason).matches,
    );
    expect(groups).toHaveLength(1);
    expect(groups[0]?.name).toBeNull();
    expect(groups[0]?.rows).toHaveLength(20);
  });
});
