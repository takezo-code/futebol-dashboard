import type { Match } from "@/lib/football-api/types";

export type Round = {
  key: string;
  label: string;
  matches: Match[];
};

export type ScoreLine = {
  home: number | null;
  away: number | null;
  penalties: { home: number; away: number } | null;
};

const MATCHDAY_STAGES = new Set([
  "REGULAR_SEASON",
  "LEAGUE_STAGE",
  "GROUP_STAGE",
]);

const STAGE_LABELS: Record<string, string> = {
  ROUND_1: "Fase preliminar 1",
  ROUND_2: "Fase preliminar 2",
  ROUND_3: "Fase preliminar 3",
  PLAYOFFS: "Playoff",
  PLAY_OFFS: "Oitavas de final",
  LAST_16: "Oitavas de final",
  QUARTER_FINALS: "Quartas de final",
  SEMI_FINALS: "Semifinal",
  FINAL: "Final",
};

function roundIdentity(match: Match): { key: string; label: string } {
  if (MATCHDAY_STAGES.has(match.stage) && match.matchday !== null) {
    return { key: String(match.matchday), label: `Rodada ${match.matchday}` };
  }
  return {
    key: match.stage.toLowerCase(),
    label: STAGE_LABELS[match.stage] ?? match.stage,
  };
}

export function buildRounds(matches: Match[]): Round[] {
  const rounds = new Map<string, Round>();
  for (const match of matches) {
    const { key, label } = roundIdentity(match);
    const round = rounds.get(key) ?? { key, label, matches: [] };
    round.matches.push(match);
    rounds.set(key, round);
  }
  const sorted = [...rounds.values()].map((round) => ({
    ...round,
    matches: [...round.matches].sort((a, b) =>
      a.utcDate.localeCompare(b.utcDate),
    ),
  }));
  return sorted.sort((a, b) =>
    (a.matches[0]?.utcDate ?? "").localeCompare(b.matches[0]?.utcDate ?? ""),
  );
}

export function pickRound(
  rounds: Round[],
  requestedKey: string | undefined,
  now: Date,
): Round | null {
  const requested = rounds.find((round) => round.key === requestedKey);
  if (requested) {
    return requested;
  }
  const today = now.toISOString().slice(0, 10);
  const startedIndex = rounds.findLastIndex(
    (round) => (round.matches[0]?.utcDate.slice(0, 10) ?? "") <= today,
  );
  if (startedIndex === -1) {
    return rounds[0] ?? null;
  }
  const started = rounds[startedIndex];
  const hasPendingMatch = started?.matches.some(
    (match) => match.status !== "FINISHED",
  );
  if (hasPendingMatch) {
    return started ?? null;
  }
  return rounds[startedIndex + 1] ?? started ?? null;
}

export function scoreLine(match: Match): ScoreLine {
  const { fullTime, penalties } = match.score;
  if (
    match.score.duration !== "PENALTY_SHOOTOUT" ||
    !penalties ||
    penalties.home === null ||
    penalties.away === null ||
    fullTime.home === null ||
    fullTime.away === null
  ) {
    return { home: fullTime.home, away: fullTime.away, penalties: null };
  }
  return {
    home: fullTime.home - penalties.home,
    away: fullTime.away - penalties.away,
    penalties: { home: penalties.home, away: penalties.away },
  };
}
