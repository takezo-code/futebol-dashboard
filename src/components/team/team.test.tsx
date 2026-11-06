import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import teamDetail from "@/lib/football-api/__fixtures__/team-detail.json";
import teamMatches from "@/lib/football-api/__fixtures__/team-matches.json";
import { matchesResponseSchema, teamSchema } from "@/lib/football-api/schemas";
import { teamCompetitions } from "@/lib/stats/team-competitions";
import { computeTeamStats } from "@/lib/stats/team-stats";
import { CompetitionFilter } from "./competition-filter";
import { SquadList } from "./squad-list";
import { TeamHeader } from "./team-header";
import { TeamMatches } from "./team-matches";
import { TeamStatsCards } from "./team-stats";

const team = teamSchema.parse(teamDetail);
const matches = matchesResponseSchema.parse(teamMatches).matches;
const options = teamCompetitions(matches);

describe("TeamHeader", () => {
  it("shows the club facts in portuguese", () => {
    render(<TeamHeader team={team} />);
    expect(
      screen.getByRole("heading", { name: "Fluminense FC" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Estadio Jornalista Mário Filho"),
    ).toBeInTheDocument();
    expect(screen.getByText("1902")).toBeInTheDocument();
    expect(screen.getByText("Grená, Verde e Branco")).toBeInTheDocument();
    expect(screen.getByText("Marcão")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "fluminense.com.br" }),
    ).toHaveAttribute("href", "http://www.fluminense.com.br");
  });

  it("omits facts the api does not have", () => {
    render(<TeamHeader team={{ ...team, website: null, coach: null }} />);
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.queryByText("Técnico")).toBeNull();
  });
});

describe("CompetitionFilter", () => {
  it("links each competition and the all option", () => {
    render(
      <CompetitionFilter teamId={1765} options={options} selected="BSA" />,
    );
    const nav = screen.getByRole("navigation", {
      name: "Filtrar por competição",
    });
    const links = within(nav).getAllByRole("link");
    expect(links.map((l) => l.getAttribute("href"))).toEqual([
      "/times/1765?competicao=BSA",
      "/times/1765?competicao=CLI",
      "/times/1765?competicao=todas",
    ]);
    expect(links[0]).toHaveAttribute("aria-current", "page");
    expect(links[1]).not.toHaveAttribute("aria-current");
  });

  it("shows only the name when there is a single competition", () => {
    render(
      <CompetitionFilter
        teamId={1765}
        options={options.slice(0, 1)}
        selected="BSA"
      />,
    );
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.getByText("Brasileirão Série A")).toBeInTheDocument();
  });
});

describe("TeamStatsCards", () => {
  it("shows percentages and the win streak", () => {
    render(<TeamStatsCards stats={computeTeamStats(matches, 1765)} />);
    expect(screen.getByText("Aproveitamento geral")).toBeInTheDocument();
    expect(screen.getAllByText(/%$/).length).toBeGreaterThanOrEqual(3);
    expect(screen.getByText("Maior sequência de vitórias")).toBeInTheDocument();
  });

  it("shows dashes without finished matches", () => {
    render(<TeamStatsCards stats={computeTeamStats([], 1765)} />);
    expect(screen.getAllByText("–").length).toBeGreaterThanOrEqual(5);
  });
});

describe("TeamMatches", () => {
  it("splits upcoming and recent matches, five each at most", () => {
    render(<TeamMatches matches={matches} />);
    const upcoming = screen.getByRole("region", { name: "Próximos jogos" });
    const recent = screen.getByRole("region", { name: "Últimos resultados" });
    expect(within(upcoming).getAllByRole("article").length).toBeLessThanOrEqual(
      5,
    );
    expect(within(recent).getAllByRole("article")).toHaveLength(5);
  });

  it("explains empty sections", () => {
    render(<TeamMatches matches={[]} />);
    expect(screen.getByText("Nenhum jogo agendado.")).toBeInTheDocument();
    expect(
      screen.getByText("Nenhum jogo disputado ainda."),
    ).toBeInTheDocument();
  });
});

describe("SquadList", () => {
  it("groups the squad with counts", () => {
    render(<SquadList squad={team.squad} />);
    expect(
      screen.getByRole("heading", { name: /^Goleiros \(\d+\)$/ }),
    ).toBeInTheDocument();
  });

  it("explains an empty squad", () => {
    render(<SquadList squad={[]} />);
    expect(
      screen.getByText("O elenco ainda não foi divulgado."),
    ).toBeInTheDocument();
  });
});
