import { describe, expect, it } from "vitest";
import standingsBsa from "@/lib/football-api/__fixtures__/standings-bsa.json";
import standingsCl from "@/lib/football-api/__fixtures__/standings-cl.json";
import { COMPETITIONS } from "@/lib/competitions";
import { standingsResponseSchema } from "@/lib/football-api/schemas";
import { standingsPreview } from "./standings-preview";

function table(data: unknown) {
  return standingsResponseSchema.parse(data).standings[0]?.table ?? [];
}

describe("standingsPreview", () => {
  it("shows the top and the relegation zone of a league", () => {
    const preview = standingsPreview(table(standingsBsa), COMPETITIONS.BSA);
    expect(preview.map((p) => p.row.position)).toEqual([
      1, 2, 3, 4, 5, 6, 17, 18, 19, 20,
    ]);
    expect(
      preview.filter((p) => p.gapBefore).map((p) => p.row.position),
    ).toEqual([17]);
  });

  it("shows only the top when there is no relegation", () => {
    const preview = standingsPreview(table(standingsCl), COMPETITIONS.CL);
    expect(preview).toHaveLength(6);
    expect(preview.some((p) => p.gapBefore)).toBe(false);
  });

  it("does not duplicate small tables", () => {
    const rows = table(standingsBsa).slice(0, 4);
    const preview = standingsPreview(rows, COMPETITIONS.BSA);
    expect(preview.map((p) => p.row.position)).toEqual([1, 2, 3, 4]);
    expect(preview.some((p) => p.gapBefore)).toBe(false);
  });
});
