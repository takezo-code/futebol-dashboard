import {
  COMPETITION_CODES,
  COMPETITIONS,
  isCompetitionCode,
} from "@/lib/competitions";
import type { Match } from "@/lib/football-api/types";

export type TeamCompetition = {
  code: string;
  name: string;
  matchCount: number;
};

export const ALL_COMPETITIONS = "todas";

function configOrder(code: string): number {
  const index = (COMPETITION_CODES as readonly string[]).indexOf(code);
  return index === -1 ? COMPETITION_CODES.length : index;
}

export function teamCompetitions(matches: Match[]): TeamCompetition[] {
  const byCode = new Map<string, TeamCompetition>();
  for (const match of matches) {
    const { code, name } = match.competition;
    const entry = byCode.get(code) ?? {
      code,
      name: isCompetitionCode(code) ? COMPETITIONS[code].name : name,
      matchCount: 0,
    };
    entry.matchCount += 1;
    byCode.set(code, entry);
  }
  return [...byCode.values()].sort(
    (a, b) =>
      b.matchCount - a.matchCount ||
      configOrder(a.code) - configOrder(b.code) ||
      a.name.localeCompare(b.name, "pt-BR"),
  );
}

export function pickTeamCompetition(
  options: TeamCompetition[],
  requested: string | undefined,
): string | null {
  if (requested === ALL_COMPETITIONS) {
    return null;
  }
  const match = options.find((option) => option.code === requested);
  return match?.code ?? options[0]?.code ?? null;
}

export function filterByCompetition(
  matches: Match[],
  code: string | null,
): Match[] {
  return code === null
    ? matches
    : matches.filter((match) => match.competition.code === code);
}
