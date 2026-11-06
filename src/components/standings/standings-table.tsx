import { FavoriteButton } from "@/components/favorites/favorite-button";
import { TeamLink } from "@/components/team/team-link";
import { Crest } from "@/components/ui/crest";
import { getZone, type CompetitionConfig } from "@/lib/competitions";
import type { StandingRow } from "@/lib/football-api/types";
import { formatGoalDifference } from "@/lib/format";
import type { FormEntry } from "@/lib/stats/form";
import { FormDots } from "./form-dots";
import { ZONE_BAR_CLASS } from "./zone-styles";

type StandingsTableProps = {
  rows: StandingRow[];
  config: CompetitionConfig;
  formByTeam: Map<number, FormEntry[]>;
  caption?: string;
};

const NUMBER_COLUMNS: { label: string; title: string }[] = [
  { label: "J", title: "Jogos" },
  { label: "V", title: "Vitórias" },
  { label: "E", title: "Empates" },
  { label: "D", title: "Derrotas" },
  { label: "GP", title: "Gols pró" },
  { label: "GC", title: "Gols contra" },
  { label: "SG", title: "Saldo de gols" },
  { label: "PTS", title: "Pontos" },
];

const stickyCell = "bg-surface sticky z-[1]";

export function StandingsTable({
  rows,
  config,
  formByTeam,
  caption = `Classificação ${config.preposition} ${config.name}`,
}: StandingsTableProps) {
  return (
    <div className="border-border bg-surface overflow-x-auto rounded-lg border">
      <table className="w-full min-w-[680px] text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="text-muted text-xs">
          <tr className="border-border border-b">
            <th
              scope="col"
              className={`${stickyCell} left-0 w-12 py-2 pl-4 text-left font-medium`}
            >
              #
            </th>
            <th
              scope="col"
              className={`${stickyCell} left-12 py-2 pr-3 text-left font-medium`}
            >
              Time
            </th>
            {NUMBER_COLUMNS.map((column) => (
              <th
                key={column.label}
                scope="col"
                className="px-2 py-2 text-right font-medium"
              >
                <abbr title={column.title} className="no-underline">
                  {column.label}
                </abbr>
              </th>
            ))}
            <th scope="col" className="px-4 py-2 text-left font-medium">
              Últimos jogos
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const zone = getZone(config, row.position);
            const teamName = row.team.shortName ?? row.team.name;
            return (
              <tr
                key={row.team.id}
                data-zone={zone?.tone}
                className="border-border border-b last:border-b-0"
              >
                <td className={`${stickyCell} left-0 w-12 py-2.5 pl-4`}>
                  <span className="flex items-center gap-2.5">
                    <span
                      aria-hidden="true"
                      className={`h-5 w-1 ${zone ? ZONE_BAR_CLASS[zone.tone] : "bg-transparent"}`}
                    />
                    <span className="font-display text-base tabular-nums">
                      {row.position}
                    </span>
                    {zone ? (
                      <span className="sr-only">{zone.label}</span>
                    ) : null}
                  </span>
                </td>
                <th
                  scope="row"
                  className={`${stickyCell} left-12 py-2.5 pr-3 text-left font-medium`}
                >
                  <span className="flex items-center gap-2">
                    <FavoriteButton
                      size="sm"
                      team={{
                        id: row.team.id,
                        name: teamName,
                        crest: row.team.crest,
                      }}
                    />
                    <Crest src={row.team.crest} name={teamName} size={20} />
                    <TeamLink id={row.team.id} className="whitespace-nowrap">
                      {teamName}
                    </TeamLink>
                  </span>
                </th>
                {[
                  row.playedGames,
                  row.won,
                  row.draw,
                  row.lost,
                  row.goalsFor,
                  row.goalsAgainst,
                ].map((value, index) => (
                  <td
                    key={index}
                    className="font-display px-2 text-right text-base tabular-nums"
                  >
                    {value}
                  </td>
                ))}
                <td className="font-display px-2 text-right text-base tabular-nums">
                  {formatGoalDifference(row.goalDifference)}
                </td>
                <td className="font-display px-2 text-right text-lg font-bold tabular-nums">
                  {row.points}
                </td>
                <td className="px-4">
                  <FormDots
                    entries={formByTeam.get(row.team.id) ?? []}
                    teamId={row.team.id}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
