import { describe, expect, it } from "vitest";
import bsaSeason from "@/lib/football-api/__fixtures__/matches-bsa-season.json";
import { matchesResponseSchema } from "@/lib/football-api/schemas";
import { formatDayHeading } from "@/lib/format";
import { groupMatchesByDay } from "./matches-by-day";

const round34 = matchesResponseSchema
  .parse(bsaSeason)
  .matches.filter((m) => m.matchday === 34);
const now = new Date("2026-11-06T12:00:00Z");

describe("groupMatchesByDay", () => {
  it("groups by the day in Brasília, in order", () => {
    const groups = groupMatchesByDay(round34);
    const days = groups.map((g) => g.day);
    expect(days).toEqual([...days].sort());
    expect(groups.reduce((sum, g) => sum + g.matches.length, 0)).toBe(10);
  });

  it("puts a late night UTC kickoff on the previous Brazilian day", () => {
    const base = round34[0];
    if (!base) {
      throw new Error("no matches");
    }
    const groups = groupMatchesByDay([
      { ...base, utcDate: "2026-11-07T02:30:00Z" },
    ]);
    expect(groups[0]?.day).toBe("2026-11-06");
  });
});

describe("formatDayHeading", () => {
  it("uses relative names around today", () => {
    expect(formatDayHeading("2026-11-06T23:00:00Z", now)).toBe("Hoje");
    expect(formatDayHeading("2026-11-07T19:00:00Z", now)).toBe("Amanhã");
    expect(formatDayHeading("2026-11-05T22:00:00Z", now)).toBe("Ontem");
  });

  it("names other days with weekday and date", () => {
    expect(formatDayHeading("2026-11-08T19:00:00Z", now)).toBe(
      "Domingo, 08/11",
    );
  });
});
