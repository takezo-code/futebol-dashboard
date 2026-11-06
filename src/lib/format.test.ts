import { describe, expect, it } from "vitest";
import {
  formatGoalDifference,
  formatMatchDate,
  formatMatchTime,
  matchStatusLabel,
  seasonLabel,
} from "./format";

describe("format", () => {
  it("formats match dates in Brasília time", () => {
    expect(formatMatchDate("2026-11-06T23:00:00Z")).toBe("sex., 06/11 · 20:00");
  });

  it("formats match times in Brasília time", () => {
    expect(formatMatchTime("2026-11-06T23:00:00Z")).toBe("20:00");
    expect(formatMatchTime("2026-11-07T02:30:00Z")).toBe("23:30");
  });

  it("translates match statuses", () => {
    expect(matchStatusLabel("TIMED")).toBe("Agendado");
    expect(matchStatusLabel("SCHEDULED")).toBe("Agendado");
    expect(matchStatusLabel("FINISHED")).toBe("Finalizado");
    expect(matchStatusLabel("POSTPONED")).toBe("Adiado");
    expect(matchStatusLabel("CANCELLED")).toBe("Cancelado");
    expect(matchStatusLabel("IN_PLAY")).toBe("Em andamento");
    expect(matchStatusLabel("SOMETHING_NEW")).toBe("A confirmar");
  });

  it("formats goal difference with sign", () => {
    expect(formatGoalDifference(42)).toBe("+42");
    expect(formatGoalDifference(-21)).toBe("−21");
    expect(formatGoalDifference(0)).toBe("0");
  });

  it("labels single-year and split seasons", () => {
    expect(seasonLabel("2026-01-28", "2026-12-02")).toBe("2026");
    expect(seasonLabel("2025-08-15", "2026-05-24")).toBe("2025/26");
  });
});
