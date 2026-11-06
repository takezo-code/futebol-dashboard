import type { Match, Season } from "@/lib/football-api/types";
import { buildRounds, pickRound } from "./rounds";

export type SeasonProgress = {
  label: string;
  detail: string | null;
  percent: number;
};

const DAY_MS = 86_400_000;

function clampPercent(value: number): number {
  if (Number.isNaN(value)) {
    return 0;
  }
  return Math.min(100, Math.max(0, Math.round(value)));
}

function startLabel(startDate: string): string {
  const [, month, day] = startDate.split("-");
  return `Começa em ${day}/${month}`;
}

export function seasonProgress(
  season: Season,
  matches: Match[],
  now: Date,
): SeasonProgress {
  const start = Date.parse(`${season.startDate}T00:00:00Z`);
  const end = Date.parse(`${season.endDate}T00:00:00Z`) + DAY_MS;
  const time = now.getTime();

  if (time < start) {
    return { label: startLabel(season.startDate), detail: null, percent: 0 };
  }

  const league = matches.filter((match) => match.stage === "REGULAR_SEASON");
  if (league.length > 0) {
    const total = Math.max(...league.map((match) => match.matchday ?? 0));
    const finished = league.filter(
      (match) => match.status === "FINISHED",
    ).length;
    const current = pickRound(buildRounds(league), undefined, now);
    return {
      label: current?.label ?? `Rodada ${season.currentMatchday ?? 1}`,
      detail: total > 0 ? `de ${total}` : null,
      percent: clampPercent((finished / league.length) * 100),
    };
  }

  const current = pickRound(buildRounds(matches), undefined, now);
  return {
    label: current?.label ?? "Temporada em andamento",
    detail: null,
    percent: clampPercent(((time - start) / (end - start)) * 100),
  };
}
