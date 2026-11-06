import { describe, expect, it } from "vitest";
import standingsBsa from "@/lib/football-api/__fixtures__/standings-bsa.json";
import { standingsResponseSchema } from "@/lib/football-api/schemas";
import { compareLines, pickComparedTeams } from "./compare";

const rows =
  standingsResponseSchema.parse(standingsBsa).standings[0]?.table ?? [];

function names(a: string | undefined, b: string | undefined) {
  const picked = pickComparedTeams(rows, a, b);
  return [picked?.a.team.shortName, picked?.b.team.shortName];
}

describe("pickComparedTeams", () => {
  it("defaults to the top two", () => {
    expect(names(undefined, undefined)).toEqual(["Flamengo", "Palmeiras"]);
  });

  it("uses the requested teams", () => {
    expect(names("1765", undefined)).toEqual(["Fluminense", "Flamengo"]);
    expect(names("1765", "1783")).toEqual(["Fluminense", "Flamengo"]);
  });

  it("never compares a team with itself", () => {
    expect(names("1783", "1783")).toEqual(["Flamengo", "Palmeiras"]);
  });

  it("ignores ids that are invalid or outside the competition", () => {
    expect(names("999", undefined)).toEqual(["Flamengo", "Palmeiras"]);
    expect(names("abc", "xyz")).toEqual(["Flamengo", "Palmeiras"]);
  });

  it("needs at least two teams", () => {
    expect(
      pickComparedTeams(rows.slice(0, 1), undefined, undefined),
    ).toBeNull();
  });
});

describe("compareLines", () => {
  const picked = pickComparedTeams(rows, undefined, undefined);
  const lines = picked ? compareLines(picked.a, picked.b) : [];
  const line = (label: string) => lines.find((l) => l.label === label);

  it("marks the better value", () => {
    expect(line("Pontos")).toEqual({
      label: "Pontos",
      a: "76",
      b: "73",
      better: "a",
    });
    expect(line("Posição")?.better).toBe("a");
  });

  it("formats the points percentage", () => {
    expect(line("Aproveitamento")?.a).toBe("75%");
  });

  it("has no winner for draws", () => {
    expect(line("Empates")?.better).toBeNull();
  });
});
