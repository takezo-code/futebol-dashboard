import { describe, expect, it } from "vitest";
import { parseTeamId } from "./team-id";

describe("parseTeamId", () => {
  it("accepts positive integers", () => {
    expect(parseTeamId("1765")).toBe(1765);
    expect(parseTeamId("7")).toBe(7);
  });

  it("rejects anything else", () => {
    for (const value of [
      "abc",
      "0",
      "012",
      "-1",
      "1.5",
      "9999999999",
      "",
      " 12",
    ]) {
      expect(parseTeamId(value)).toBeNull();
    }
  });
});
