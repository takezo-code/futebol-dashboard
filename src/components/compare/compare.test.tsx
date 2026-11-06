import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import bsaSeason from "@/lib/football-api/__fixtures__/matches-bsa-season.json";
import standingsBsa from "@/lib/football-api/__fixtures__/standings-bsa.json";
import {
  matchesResponseSchema,
  standingsResponseSchema,
} from "@/lib/football-api/schemas";
import { compareLines, pickComparedTeams } from "@/lib/compare";
import { headToHead } from "@/lib/stats/head-to-head";
import { CompareTable } from "./compare-table";
import { HeadToHeadList } from "./head-to-head-list";
import { TeamPicker } from "./team-picker";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

const rows =
  standingsResponseSchema.parse(standingsBsa).standings[0]?.table ?? [];
const matches = matchesResponseSchema.parse(bsaSeason).matches;
const picked = pickComparedTeams(rows, undefined, undefined);
if (!picked) {
  throw new Error("fixture without two teams");
}

describe("TeamPicker", () => {
  it("has two labelled selects and blocks picking the same team", () => {
    render(
      <TeamPicker
        code="BSA"
        rows={rows}
        a={picked.a.team.id}
        b={picked.b.team.id}
      />,
    );
    const first = screen.getByRole("combobox", { name: "Time 1" });
    const second = screen.getByRole("combobox", { name: "Time 2" });
    expect(first).toHaveValue(String(picked.a.team.id));
    expect(second).toHaveValue(String(picked.b.team.id));
    expect(
      within(first).getByRole("option", { name: "Palmeiras" }),
    ).toBeDisabled();
    expect(
      within(second).getByRole("option", { name: "Flamengo" }),
    ).toBeDisabled();
  });
});

describe("CompareTable", () => {
  it("marks the better value", () => {
    render(
      <CompareTable
        a={picked.a}
        b={picked.b}
        lines={compareLines(picked.a, picked.b)}
      />,
    );
    const pointsRow = screen.getByRole("row", { name: /Pontos/ });
    expect(within(pointsRow).getByText("76")).toHaveClass("font-bold");
    expect(within(pointsRow).getByText("melhor")).toHaveClass("sr-only");
  });
});

describe("HeadToHeadList", () => {
  it("summarizes the meetings", () => {
    render(
      <HeadToHeadList
        result={headToHead(matches, 1783, 1765)}
        aName="Flamengo"
        bName="Fluminense"
      />,
    );
    expect(
      screen.getByText("Flamengo 2 vitórias, 0 empates, Fluminense 0 vitórias"),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(2);
  });

  it("uses the singular for one win", () => {
    const result = headToHead(matches, 1783, 1765);
    render(
      <HeadToHeadList
        result={{ ...result, aWins: 1, bWins: 1, draws: 1 }}
        aName="Flamengo"
        bName="Fluminense"
      />,
    );
    expect(
      screen.getByText("Flamengo 1 vitória, 1 empate, Fluminense 1 vitória"),
    ).toBeInTheDocument();
  });

  it("explains when the teams never met", () => {
    render(
      <HeadToHeadList
        result={{ matches: [], aWins: 0, draws: 0, bWins: 0 }}
        aName="A"
        bName="B"
      />,
    );
    expect(
      screen.getByText("Os times não se enfrentaram nesta temporada."),
    ).toBeInTheDocument();
  });
});
