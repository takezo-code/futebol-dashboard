import { TeamLink } from "@/components/team/team-link";
import { Crest } from "@/components/ui/crest";
import type { Match, MatchTeam } from "@/lib/football-api/types";
import {
  formatMatchDate,
  formatMatchTime,
  matchStatusLabel,
} from "@/lib/format";
import { scoreLine } from "@/lib/stats/rounds";

const SCORED_STATUSES = new Set(["FINISHED", "IN_PLAY", "PAUSED", "AWARDED"]);
const OFF_STATUSES = new Set(["CANCELLED", "POSTPONED", "SUSPENDED"]);

function teamName(team: MatchTeam): string {
  return team.shortName ?? team.name ?? "A definir";
}

function TeamSide({
  team,
  align,
}: {
  team: MatchTeam;
  align: "start" | "end";
}) {
  const name = teamName(team);
  return (
    <span
      className={`flex min-w-0 flex-col items-center gap-1.5 text-center sm:gap-2 ${
        align === "end"
          ? "sm:flex-row-reverse sm:text-right"
          : "sm:flex-row sm:text-left"
      }`}
    >
      <Crest src={team.crest} name={name} size={28} />
      <TeamLink
        id={team.id}
        className="line-clamp-2 text-sm leading-tight font-medium break-words sm:text-base"
      >
        {name}
      </TeamLink>
    </span>
  );
}

export function MatchCard({ match }: { match: Match }) {
  const { home, away, penalties } = scoreLine(match);
  const hasScore =
    SCORED_STATUSES.has(match.status) && home !== null && away !== null;
  const isOff = OFF_STATUSES.has(match.status);

  return (
    <article className="border-border bg-surface flex flex-col gap-2 rounded-lg border p-4">
      <p className="text-muted text-xs">{formatMatchDate(match.utcDate)}</p>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <TeamSide team={match.homeTeam} align="end" />
        {hasScore ? (
          <span
            aria-label={`Placar: ${home} a ${away}`}
            className="font-display bg-background rounded-md px-3 py-1 text-3xl leading-none font-bold tabular-nums"
          >
            {home}
            <span aria-hidden="true" className="text-muted mx-1.5">
              –
            </span>
            {away}
          </span>
        ) : (
          <span className="font-display text-muted px-3 text-2xl tabular-nums">
            {isOff ? "–" : formatMatchTime(match.utcDate)}
          </span>
        )}
        <TeamSide team={match.awayTeam} align="start" />
      </div>
      <p className="text-muted flex justify-center gap-2 text-xs">
        <span>{matchStatusLabel(match.status)}</span>
        {penalties ? (
          <span>{`pên. ${penalties.home}–${penalties.away}`}</span>
        ) : null}
      </p>
    </article>
  );
}
