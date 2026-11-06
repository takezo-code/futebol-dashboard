import { TeamLink } from "@/components/team/team-link";
import { Crest } from "@/components/ui/crest";
import type { CompetitionCode } from "@/lib/competitions";
import type { Match, MatchTeam } from "@/lib/football-api/types";
import { formatMatchTime } from "@/lib/format";
import { scoreLine, type Round } from "@/lib/stats/rounds";
import { OverviewCard } from "./overview-card";

const SCORED = new Set(["FINISHED", "IN_PLAY", "PAUSED", "AWARDED"]);
const LIMIT = 6;

function teamName(team: MatchTeam): string {
  return team.shortName ?? team.name ?? "A definir";
}

function Side({ team, align }: { team: MatchTeam; align: "start" | "end" }) {
  const name = teamName(team);
  return (
    <span
      className={`flex min-w-0 items-center gap-2 ${align === "end" ? "flex-row-reverse text-right" : ""}`}
    >
      <Crest src={team.crest} name={name} size={20} />
      <TeamLink id={team.id} className="truncate text-sm">
        {name}
      </TeamLink>
    </span>
  );
}

function Center({ match }: { match: Match }) {
  const { home, away } = scoreLine(match);
  if (SCORED.has(match.status) && home !== null && away !== null) {
    return (
      <span
        aria-label={`Placar: ${home} a ${away}`}
        className="font-display bg-background rounded px-2 py-0.5 text-lg font-bold tabular-nums"
      >
        {home}–{away}
      </span>
    );
  }
  return (
    <span className="font-display text-muted px-2 text-base tabular-nums">
      {match.status === "TIMED" || match.status === "SCHEDULED"
        ? formatMatchTime(match.utcDate)
        : "–"}
    </span>
  );
}

type CurrentRoundCardProps = {
  code: CompetitionCode;
  round: Round;
  isLive: boolean;
};

export function CurrentRoundCard({
  code,
  round,
  isLive,
}: CurrentRoundCardProps) {
  return (
    <OverviewCard
      id="rodada-atual"
      title={round.label}
      badge={
        isLive ? (
          <span className="bg-accent text-on-accent rounded px-2 py-0.5 text-xs font-medium">
            Rodada atual
          </span>
        ) : null
      }
      link={{ href: `/competicoes/${code}/jogos`, label: "Ver todos os jogos" }}
    >
      <ul className="divide-border flex flex-col divide-y">
        {round.matches.slice(0, LIMIT).map((match) => (
          <li
            key={match.id}
            className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 py-2"
          >
            <Side team={match.homeTeam} align="end" />
            <Center match={match} />
            <Side team={match.awayTeam} align="start" />
          </li>
        ))}
      </ul>
    </OverviewCard>
  );
}
