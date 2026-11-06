import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import bsaSeason from "@/lib/football-api/__fixtures__/matches-bsa-season.json";
import cliSeason from "@/lib/football-api/__fixtures__/matches-cli.json";
import { matchesResponseSchema } from "@/lib/football-api/schemas";
import type { Match } from "@/lib/football-api/types";
import { buildRounds } from "@/lib/stats/rounds";
import { MatchCard } from "./match-card";
import { MatchdayNav } from "./matchday-nav";

const bsaMatches = matchesResponseSchema.parse(bsaSeason).matches;
const cliMatches = matchesResponseSchema.parse(cliSeason).matches;

function findMatch(predicate: (m: Match) => boolean): Match {
  const match = [...bsaMatches, ...cliMatches].find(predicate);
  if (!match) {
    throw new Error("fixture without the expected match");
  }
  return match;
}

describe("MatchCard", () => {
  it("shows postponed matches as Adiado", () => {
    const match = {
      ...findMatch((m) => m.status === "TIMED"),
      status: "POSTPONED",
    };
    render(<MatchCard match={match} />);
    expect(screen.getByText("Adiado")).toBeInTheDocument();
  });

  it("shows the kickoff time when there is no score", () => {
    const match = findMatch((m) => m.utcDate === "2026-11-06T23:00:00Z");
    render(<MatchCard match={match} />);
    expect(screen.getByText("20:00")).toBeInTheDocument();
    expect(screen.getByText("Agendado")).toBeInTheDocument();
  });

  it("shows regular time and penalties for shootouts", () => {
    const match = findMatch((m) => m.score.duration === "PENALTY_SHOOTOUT");
    render(<MatchCard match={match} />);
    expect(screen.getByLabelText("Placar: 1 a 0")).toBeInTheDocument();
    expect(screen.getByText("pên. 5–3")).toBeInTheDocument();
  });

  it("hides the score of a cancelled match", () => {
    const match = findMatch((m) => m.status === "CANCELLED");
    render(<MatchCard match={match} />);
    expect(screen.queryByLabelText(/^Placar/)).toBeNull();
    expect(screen.getByText("Cancelado")).toBeInTheDocument();
    expect(screen.getByText("–")).toBeInTheDocument();
  });

  it("shows A definir for teams not decided yet", () => {
    const base = findMatch((m) => m.status === "TIMED");
    const match = {
      ...base,
      homeTeam: {
        id: null,
        name: null,
        shortName: null,
        tla: null,
        crest: null,
      },
    };
    render(<MatchCard match={match} />);
    expect(screen.getByText("A definir")).toBeInTheDocument();
  });
});

describe("MatchdayNav", () => {
  const rounds = buildRounds(bsaMatches);

  it("hides the previous link on the first round", () => {
    const first = rounds[0];
    if (!first) {
      throw new Error("no rounds");
    }
    render(
      <MatchdayNav code="BSA" rounds={rounds} current={first} isLive={false} />,
    );
    expect(screen.queryByRole("link", { name: "Rodada anterior" })).toBeNull();
    expect(
      screen.getByRole("link", { name: "Próxima rodada" }),
    ).toHaveAttribute("href", "/competicoes/BSA/jogos?rodada=2");
    expect(screen.getByText("Rodada 1")).toBeInTheDocument();
  });

  it("marks the current round", () => {
    const current = rounds[33];
    if (!current) {
      throw new Error("no rounds");
    }
    render(<MatchdayNav code="BSA" rounds={rounds} current={current} isLive />);
    expect(screen.getByText("Rodada atual")).toBeInTheDocument();
  });
});
