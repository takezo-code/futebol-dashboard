import { TeamLink } from "@/components/team/team-link";
import { Crest } from "@/components/ui/crest";
import type { Scorer } from "@/lib/football-api/types";

const stickyCell = "bg-surface sticky z-[1]";

function orDash(value: number | null): string | number {
  return value ?? "–";
}

export function ScorersTable({ scorers }: { scorers: Scorer[] }) {
  if (scorers.length === 0) {
    return <p className="text-muted">A artilharia ainda não foi divulgada.</p>;
  }

  return (
    <div className="border-border bg-surface overflow-x-auto rounded-lg border">
      <table className="w-full min-w-[560px] text-sm">
        <caption className="sr-only">Artilharia</caption>
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
              Jogador
            </th>
            <th scope="col" className="px-2 py-2 text-right font-medium">
              Gols
            </th>
            <th scope="col" className="px-3 py-2 text-left font-medium">
              Time
            </th>
            <th scope="col" className="px-2 py-2 text-right font-medium">
              <abbr title="Assistências" className="no-underline">
                Assist.
              </abbr>
            </th>
            <th scope="col" className="px-2 py-2 text-right font-medium">
              <abbr title="Gols de pênalti" className="no-underline">
                Pên.
              </abbr>
            </th>
            <th scope="col" className="px-4 py-2 text-right font-medium">
              Jogos
            </th>
          </tr>
        </thead>
        <tbody>
          {scorers.map((scorer) => {
            const teamName = scorer.team.shortName ?? scorer.team.name;
            return (
              <tr
                key={scorer.player.id}
                className="border-border border-b last:border-b-0"
              >
                <td
                  className={`${stickyCell} font-display left-0 w-12 py-2.5 pl-4 text-base tabular-nums`}
                >
                  {scorers.findIndex((other) => other.goals === scorer.goals) +
                    1}
                </td>
                <th
                  scope="row"
                  className={`${stickyCell} left-12 py-2.5 pr-3 text-left font-medium whitespace-nowrap`}
                >
                  {scorer.player.name}
                </th>
                <td className="font-display px-2 text-right text-lg font-bold tabular-nums">
                  {scorer.goals}
                </td>
                <td className="px-3">
                  <span className="flex items-center gap-2 whitespace-nowrap">
                    <Crest src={scorer.team.crest} name={teamName} size={20} />
                    <TeamLink id={scorer.team.id}>{teamName}</TeamLink>
                  </span>
                </td>
                <td className="font-display px-2 text-right text-base tabular-nums">
                  {orDash(scorer.assists)}
                </td>
                <td className="font-display px-2 text-right text-base tabular-nums">
                  {orDash(scorer.penalties)}
                </td>
                <td className="font-display px-4 text-right text-base tabular-nums">
                  {scorer.playedMatches}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
