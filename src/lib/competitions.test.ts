import { describe, expect, it } from "vitest";
import {
  COMPETITION_CODES,
  COMPETITIONS,
  getZone,
  isCompetitionCode,
} from "./competitions";

describe("competitions", () => {
  it("lists only the 11 club competitions in display order", () => {
    expect(COMPETITION_CODES).toEqual([
      "BSA",
      "CLI",
      "PL",
      "PD",
      "SA",
      "BL1",
      "FL1",
      "CL",
      "DED",
      "PPL",
      "ELC",
    ]);
  });

  it("recognizes valid codes only", () => {
    expect(isCompetitionCode("CLI")).toBe(true);
    expect(isCompetitionCode("WC")).toBe(false);
    expect(isCompetitionCode("bsa")).toBe(false);
  });

  it("finds the zone of a position", () => {
    expect(getZone(COMPETITIONS.BSA, 18)?.tone).toBe("relegation");
    expect(getZone(COMPETITIONS.BSA, 1)?.label).toBe("Libertadores");
    expect(getZone(COMPETITIONS.BSA, 14)).toBeNull();
  });

  it("marks cups with the cup format", () => {
    expect(COMPETITIONS.CL.format).toBe("cup");
    expect(COMPETITIONS.CLI.format).toBe("cup");
    expect(COMPETITIONS.PL.format).toBe("league");
  });

  it("never overlaps zones", () => {
    for (const code of COMPETITION_CODES) {
      const zones = [...COMPETITIONS[code].zones].sort(
        (a, b) => a.from - b.from,
      );
      zones.forEach((zone, index) => {
        expect(zone.from).toBeLessThanOrEqual(zone.to);
        const next = zones[index + 1];
        if (next) {
          expect(zone.to).toBeLessThan(next.from);
        }
      });
    }
  });
});
