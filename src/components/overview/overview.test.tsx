import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import bsaSeason from "@/lib/football-api/__fixtures__/matches-bsa-season.json";
import cliSeason from "@/lib/football-api/__fixtures__/matches-cli.json";
import scorersBsa from "@/lib/football-api/__fixtures__/scorers-bsa.json";
import standingsBsa from "@/lib/football-api/__fixtures__/standings-bsa.json";
import standingsCli from "@/lib/football-api/__fixtures__/standings-cli.json";
import { COMPETITIONS } from "@/lib/competitions";
import {
  matchesResponseSchema,
  scorersResponseSchema,
  standingsResponseSchema,
} from "@/lib/football-api/schemas";
import { buildRounds } from "@/lib/stats/rounds";
import { CurrentRoundCard } from "./current-round-card";
import { MatchesByDay } from "./matches-by-day";
import { StandingsPreviewCard } from "./standings-preview-card";
import { TopScorersCard } from "./top-scorers-card";

function total(data: unknown) {
  return (
    standingsResponseSchema
      .parse(data)
      .standings.find((s) => s.type === "TOTAL")?.table ?? []
  );
}

const bsaMatches = matchesResponseSchema.parse(bsaSeason).matches;
const cliMatches = matchesResponseSchema.parse(cliSeason).matches;
const round34 = buildRounds(bsaMatches)[33];
if (!round34) {
  throw new Error("fixture without round 34");
}

describe("StandingsPreviewCard", () => {
  it("shows the top and bottom of a league with a link", () => {
    render(
      <StandingsPreviewCard
        code="BSA"
        config={COMPETITIONS.BSA}
        rows={total(standingsBsa)}
        matches={bsaMatches}
      />,
    );
    const card = screen.getByRole("region", { name: "Classificação" });
    expect(within(card).getByText("Flamengo")).toBeInTheDocument();
    expect(within(card).getByText("Posições 7 a 16 omitidas")).toHaveClass(
      "sr-only",
    );
    expect(
      within(card).getByRole("link", { name: "Ver tabela completa" }),
    ).toHaveAttribute("href", "/competicoes/BSA/classificacao");
  });

  it("lists group leaders in a cup with groups", () => {
    render(
      <StandingsPreviewCard
        code="CLI"
        config={COMPETITIONS.CLI}
        rows={total(standingsCli)}
        matches={cliMatches}
      />,
    );
    const card = screen.getByRole("region", { name: "Líderes dos grupos" });
    expect(within(card).getAllByRole("listitem")).toHaveLength(8);
    expect(within(card).getByText("Grupo A")).toBeInTheDocument();
  });
});

describe("CurrentRoundCard", () => {
  it("shows up to six matches of the round and a link", () => {
    render(<CurrentRoundCard code="BSA" round={round34} isLive />);
    const card = screen.getByRole("region", { name: "Rodada 34" });
    expect(within(card).getAllByRole("listitem")).toHaveLength(6);
    expect(within(card).getByText("Rodada atual")).toBeInTheDocument();
    expect(
      within(card).getByRole("link", { name: "Ver todos os jogos" }),
    ).toHaveAttribute("href", "/competicoes/BSA/jogos");
  });
});

describe("TopScorersCard", () => {
  it("shows the top three with goals", () => {
    render(
      <TopScorersCard
        code="BSA"
        scorers={scorersResponseSchema.parse(scorersBsa).scorers}
      />,
    );
    const card = screen.getByRole("region", { name: "Artilharia" });
    expect(within(card).getAllByRole("listitem")).toHaveLength(3);
    expect(within(card).getByText("Kevin Viveros")).toBeInTheDocument();
    expect(within(card).getByText("21")).toBeInTheDocument();
    expect(
      within(card).getByRole("link", { name: "Ver artilharia" }),
    ).toHaveAttribute("href", "/competicoes/BSA/artilharia");
  });

  it("renders nothing without scorers", () => {
    const { container } = render(<TopScorersCard code="BSA" scorers={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("MatchesByDay", () => {
  it("adds a heading for each day", () => {
    render(
      <MatchesByDay
        matches={round34.matches}
        now={new Date("2026-11-06T12:00:00Z")}
      />,
    );
    const headings = screen.getAllByRole("heading", { level: 2 });
    expect(headings.length).toBeGreaterThan(1);
    expect(headings.map((h) => h.textContent)).toContain("Hoje");
    expect(screen.getAllByRole("article")).toHaveLength(10);
  });
});
