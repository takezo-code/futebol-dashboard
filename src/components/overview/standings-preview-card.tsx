import { Fragment } from "react";
import { FormDots } from "@/components/standings/form-dots";
import { ZONE_BAR_CLASS } from "@/components/standings/zone-styles";
import { TeamLink } from "@/components/team/team-link";
import { Crest } from "@/components/ui/crest";
import {
  getZone,
  type CompetitionCode,
  type CompetitionConfig,
} from "@/lib/competitions";
import type { Match, StandingRow } from "@/lib/football-api/types";
import { recentForm } from "@/lib/stats/form";
import { splitIntoGroups } from "@/lib/stats/groups";
import { standingsPreview } from "@/lib/stats/standings-preview";
import { OverviewCard } from "./overview-card";

type StandingsPreviewCardProps = {
  code: CompetitionCode;
  config: CompetitionConfig;
  rows: StandingRow[];
  matches: Match[];
};

function TeamCell({ row }: { row: StandingRow }) {
  const name = row.team.shortName ?? row.team.name;
  return (
    <span className="flex min-w-0 items-center gap-2">
      <Crest src={row.team.crest} name={name} size={20} />
      <TeamLink id={row.team.id} className="truncate">
        {name}
      </TeamLink>
    </span>
  );
}

export function StandingsPreviewCard({
  code,
  config,
  rows,
  matches,
}: StandingsPreviewCardProps) {
  const link = {
    href: `/competicoes/${code}/classificacao`,
    label: "Ver tabela completa",
  };
  const groups = splitIntoGroups(rows, matches).filter(
    (group) => group.name !== null,
  );

  if (groups.length > 1) {
    return (
      <OverviewCard id="lideres-grupos" title="Líderes dos grupos" link={link}>
        <ul className="divide-border flex flex-col divide-y text-sm">
          {groups.map((group) => {
            const leader = group.rows[0];
            return leader ? (
              <li
                key={group.name}
                className="grid grid-cols-[4.5rem_1fr_auto] items-center gap-3 py-2"
              >
                <span className="text-muted">{group.name}</span>
                <TeamCell row={leader} />
                <span className="font-display text-base font-bold tabular-nums">
                  {leader.points}
                </span>
              </li>
            ) : null;
          })}
        </ul>
      </OverviewCard>
    );
  }

  const preview = standingsPreview(rows, config);
  return (
    <OverviewCard id="classificacao-resumo" title="Classificação" link={link}>
      <table className="w-full table-fixed text-sm">
        <caption className="sr-only">Classificação resumida</caption>
        <thead className="text-muted text-xs">
          <tr>
            <th scope="col" className="w-12 py-1 text-left font-medium">
              #
            </th>
            <th scope="col" className="py-1 text-left font-medium">
              Time
            </th>
            <th scope="col" className="w-12 py-1 pr-3 text-right font-medium">
              <abbr title="Pontos" className="no-underline">
                PTS
              </abbr>
            </th>
            <th
              scope="col"
              className="hidden w-24 py-1 text-left font-medium sm:table-cell"
            >
              Últimos jogos
            </th>
          </tr>
        </thead>
        <tbody>
          {preview.map(({ row, gapBefore }, index) => {
            const zone = getZone(config, row.position);
            const previous = preview[index - 1];
            return (
              <Fragment key={row.team.id}>
                {gapBefore && previous ? (
                  <tr>
                    <td colSpan={4} className="py-1 text-center">
                      <span aria-hidden="true" className="text-muted">
                        ⋯
                      </span>
                      <span className="sr-only">
                        {`Posições ${previous.row.position + 1} a ${row.position - 1} omitidas`}
                      </span>
                    </td>
                  </tr>
                ) : null}
                <tr className="border-border border-t first:border-t-0">
                  <td className="py-2">
                    <span className="flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className={`h-4 w-1 ${zone ? ZONE_BAR_CLASS[zone.tone] : "bg-transparent"}`}
                      />
                      <span className="font-display text-base tabular-nums">
                        {row.position}
                      </span>
                      {zone ? (
                        <span className="sr-only">{zone.label}</span>
                      ) : null}
                    </span>
                  </td>
                  <td className="py-2">
                    <TeamCell row={row} />
                  </td>
                  <td className="font-display py-2 pr-3 text-right text-base font-bold tabular-nums">
                    {row.points}
                  </td>
                  <td className="hidden py-2 sm:table-cell">
                    <FormDots
                      entries={recentForm(matches, row.team.id)}
                      teamId={row.team.id}
                    />
                  </td>
                </tr>
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </OverviewCard>
  );
}
