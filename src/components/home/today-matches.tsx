import Link from "next/link";
import { Crest } from "@/components/ui/crest";
import {
  COMPETITION_CODES,
  COMPETITIONS,
  isCompetitionCode,
} from "@/lib/competitions";
import type { Match, MatchTeam } from "@/lib/football-api/types";
import { formatMatchTime, matchStatusLabel } from "@/lib/format";
import { scoreLine } from "@/lib/stats/rounds";

const SCORED = new Set(["FINISHED", "IN_PLAY", "PAUSED", "AWARDED"]);

function order(match: Match): number {
  return (COMPETITION_CODES as readonly string[]).indexOf(
    match.competition.code,
  );
}

function TeamLine({ team, goals }: { team: MatchTeam; goals: number | null }) {
  const name = team.shortName ?? team.name ?? "A definir";
  return (
    <span className="flex items-center gap-2">
      <Crest src={team.crest} name={name} size={18} />
      <span className="flex-1 truncate text-sm">{name}</span>
      {goals === null ? null : (
        <span className="font-display text-base font-bold tabular-nums">
          {goals}
        </span>
      )}
    </span>
  );
}

export function TodayMatches({ matches }: { matches: Match[] }) {
  if (matches.length === 0) {
    return null;
  }
  const sorted = [...matches].sort(
    (a, b) => order(a) - order(b) || a.utcDate.localeCompare(b.utcDate),
  );

  return (
    <section aria-labelledby="jogos-de-hoje" className="flex flex-col gap-3">
      <h2 id="jogos-de-hoje" className="font-display text-2xl font-semibold">
        Jogos de hoje
      </h2>
      <ul className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2">
        {sorted.map((match) => {
          const code = match.competition.code;
          const competitionName = isCompetitionCode(code)
            ? COMPETITIONS[code].name
            : match.competition.name;
          const { home, away } = scoreLine(match);
          const scored = SCORED.has(match.status);
          return (
            <li key={match.id} className="w-56 shrink-0 snap-start">
              <Link
                href={
                  isCompetitionCode(code) ? `/competicoes/${code}/jogos` : "/"
                }
                className="border-border bg-surface hover:border-brand focus-visible:outline-brand flex flex-col gap-2 rounded-lg border p-3 focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <span className="text-muted flex justify-between gap-2 text-xs">
                  <span className="truncate">{competitionName}</span>
                  <span className="shrink-0">
                    {scored
                      ? matchStatusLabel(match.status)
                      : formatMatchTime(match.utcDate)}
                  </span>
                </span>
                <TeamLine team={match.homeTeam} goals={scored ? home : null} />
                <TeamLine team={match.awayTeam} goals={scored ? away : null} />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
