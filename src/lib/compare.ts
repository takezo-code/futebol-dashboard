import type { StandingRow } from "@/lib/football-api/types";
import { formatGoalDifference } from "@/lib/format";
import { parseTeamId } from "@/lib/team-id";

export type ComparedTeams = {
  a: StandingRow;
  b: StandingRow;
};

export type CompareLine = {
  label: string;
  a: string;
  b: string;
  better: "a" | "b" | null;
};

function findRow(
  rows: StandingRow[],
  value: string | undefined,
): StandingRow | undefined {
  const id = value === undefined ? null : parseTeamId(value);
  return id === null ? undefined : rows.find((row) => row.team.id === id);
}

export function pickComparedTeams(
  rows: StandingRow[],
  a: string | undefined,
  b: string | undefined,
): ComparedTeams | null {
  if (rows.length < 2) {
    return null;
  }
  const requestedA = findRow(rows, a);
  const first =
    requestedA ?? rows.find((row) => row.team.id !== findRow(rows, b)?.team.id);
  const requestedB = findRow(rows, b);
  const second =
    requestedB && requestedB.team.id !== first?.team.id
      ? requestedB
      : rows.find((row) => row.team.id !== first?.team.id);
  return first && second ? { a: first, b: second } : null;
}

function percentage(row: StandingRow): number | null {
  return row.playedGames === 0
    ? null
    : Math.round((row.points / (row.playedGames * 3)) * 100);
}

function better(
  a: number | null,
  b: number | null,
  direction: "higher" | "lower" | "none",
): "a" | "b" | null {
  if (direction === "none" || a === null || b === null || a === b) {
    return null;
  }
  return a > b === (direction === "higher") ? "a" : "b";
}

export function compareLines(a: StandingRow, b: StandingRow): CompareLine[] {
  const pa = percentage(a);
  const pb = percentage(b);
  const numeric = (
    label: string,
    valueA: number,
    valueB: number,
    direction: "higher" | "lower" | "none",
    format: (value: number) => string = String,
  ): CompareLine => ({
    label,
    a: format(valueA),
    b: format(valueB),
    better: better(valueA, valueB, direction),
  });

  return [
    numeric("Posição", a.position, b.position, "lower", (value) => `${value}º`),
    numeric("Pontos", a.points, b.points, "higher"),
    {
      label: "Aproveitamento",
      a: pa === null ? "–" : `${pa}%`,
      b: pb === null ? "–" : `${pb}%`,
      better: better(pa, pb, "higher"),
    },
    numeric("Jogos", a.playedGames, b.playedGames, "none"),
    numeric("Vitórias", a.won, b.won, "higher"),
    numeric("Empates", a.draw, b.draw, "none"),
    numeric("Derrotas", a.lost, b.lost, "lower"),
    numeric("Gols marcados", a.goalsFor, b.goalsFor, "higher"),
    numeric("Gols sofridos", a.goalsAgainst, b.goalsAgainst, "lower"),
    numeric(
      "Saldo de gols",
      a.goalDifference,
      b.goalDifference,
      "higher",
      formatGoalDifference,
    ),
  ];
}
