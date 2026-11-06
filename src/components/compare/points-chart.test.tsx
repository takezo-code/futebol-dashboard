import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import bsaSeason from "@/lib/football-api/__fixtures__/matches-bsa-season.json";
import { matchesResponseSchema } from "@/lib/football-api/schemas";
import { pointsProgression } from "@/lib/stats/points-progression";
import { PointsChart } from "./points-chart";

const matches = matchesResponseSchema.parse(bsaSeason).matches;
const flamengo = { name: "Flamengo", points: pointsProgression(matches, 1783) };
const palmeiras = {
  name: "Palmeiras",
  points: pointsProgression(matches, 1769),
};

describe("PointsChart", () => {
  it("names both teams in the legend", () => {
    render(<PointsChart a={flamengo} b={palmeiras} />);
    const legend = screen.getByRole("list", { name: "Legenda" });
    expect(within(legend).getByText("Flamengo")).toBeInTheDocument();
    expect(within(legend).getByText("Palmeiras")).toBeInTheDocument();
  });

  it("offers the same data as a table", () => {
    render(<PointsChart a={flamengo} b={palmeiras} />);
    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row").slice(1);
    expect(rows).toHaveLength(34);
    const last = rows.at(-1);
    if (!last) {
      throw new Error("no rows");
    }
    expect(within(last).getByText("76")).toBeInTheDocument();
    expect(within(last).getByText("73")).toBeInTheDocument();
  });

  it("explains when there are no rounds yet", () => {
    render(
      <PointsChart
        a={{ name: "A", points: [] }}
        b={{ name: "B", points: [] }}
      />,
    );
    expect(
      screen.getByText("Ainda não há rodadas disputadas."),
    ).toBeInTheDocument();
  });
});
