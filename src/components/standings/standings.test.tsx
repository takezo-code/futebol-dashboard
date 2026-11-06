import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import bsaSeason from "@/lib/football-api/__fixtures__/matches-bsa-season.json";
import standingsBsa from "@/lib/football-api/__fixtures__/standings-bsa.json";
import { COMPETITIONS } from "@/lib/competitions";
import {
  matchesResponseSchema,
  standingsResponseSchema,
} from "@/lib/football-api/schemas";
import { recentForm } from "@/lib/stats/form";
import { FormDots } from "./form-dots";
import { StandingsTable } from "./standings-table";
import { ZoneLegend } from "./zone-legend";

const rows =
  standingsResponseSchema.parse(standingsBsa).standings[0]?.table ?? [];
const matches = matchesResponseSchema.parse(bsaSeason).matches;
const FLAMENGO_ID = 1783;

describe("StandingsTable", () => {
  it("renders one row per team with stats and zones", () => {
    render(
      <StandingsTable
        rows={rows}
        config={COMPETITIONS.BSA}
        formByTeam={new Map()}
      />,
    );
    const bodyRows = screen.getAllByRole("row").slice(1);
    expect(bodyRows).toHaveLength(20);
    const first = bodyRows[0];
    if (!first) {
      throw new Error("no rows");
    }
    expect(within(first).getByText("Flamengo")).toBeInTheDocument();
    expect(
      within(first).getByRole("link", { name: /Flamengo/ }),
    ).toHaveAttribute("href", "/times/1783");
    expect(within(first).getByText("76")).toBeInTheDocument();
    expect(within(first).getByText("+42")).toBeInTheDocument();
    expect(bodyRows[17]).toHaveAttribute("data-zone", "relegation");
    expect(
      within(bodyRows[17] as HTMLElement).getByText("Rebaixamento"),
    ).toHaveClass("sr-only");
    expect(bodyRows[13]).not.toHaveAttribute("data-zone");
    expect(document.querySelectorAll("[data-zone-break]")).toHaveLength(4);
    expect(bodyRows[4]).toHaveAttribute("data-zone", "qualifier");
  });
});

describe("ZoneLegend", () => {
  it("lists the zones of the competition", () => {
    render(<ZoneLegend zones={COMPETITIONS.BSA.zones} />);
    expect(screen.getByText("Rebaixamento")).toBeInTheDocument();
    expect(screen.getByText("Libertadores")).toBeInTheDocument();
  });
});

describe("FormDots", () => {
  it("describes each result for screen readers and on hover", () => {
    const entries = recentForm(matches, FLAMENGO_ID);
    render(<FormDots entries={entries} teamId={FLAMENGO_ID} />);
    const labels = { W: "Vitória", D: "Empate", L: "Derrota" } as const;
    const last = entries.at(-1);
    if (!last) {
      throw new Error("no form");
    }
    const dots = screen.getAllByRole("listitem");
    expect(dots).toHaveLength(5);
    expect(dots.at(-1)).toHaveTextContent(labels[last.result]);
    expect(dots.at(-1)?.getAttribute("title")).toMatch(
      new RegExp(`^${labels[last.result]} \\d+ × \\d+ contra .+`),
    );
  });

  it("shows a dash without matches", () => {
    render(<FormDots entries={[]} teamId={FLAMENGO_ID} />);
    expect(screen.getByText("–")).toBeInTheDocument();
  });
});
