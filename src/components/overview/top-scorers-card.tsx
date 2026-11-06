import type { CompetitionCode } from "@/lib/competitions";
import type { Scorer } from "@/lib/football-api/types";
import { OverviewCard } from "./overview-card";

type TopScorersCardProps = {
  code: CompetitionCode;
  scorers: Scorer[];
};

export function TopScorersCard({ code, scorers }: TopScorersCardProps) {
  const top = scorers.slice(0, 3);
  const max = top[0]?.goals ?? 0;
  if (top.length === 0 || max === 0) {
    return null;
  }

  return (
    <OverviewCard
      id="artilharia-resumo"
      title="Artilharia"
      link={{
        href: `/competicoes/${code}/artilharia`,
        label: "Ver artilharia",
      }}
    >
      <ul className="flex flex-col gap-3">
        {top.map((scorer) => (
          <li key={scorer.player.id} className="flex flex-col gap-1">
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="min-w-0 truncate">
                <span className="font-medium">{scorer.player.name}</span>
                <span className="text-muted">
                  {" "}
                  {scorer.team.shortName ?? scorer.team.name}
                </span>
              </span>
              <span className="font-display text-lg font-bold tabular-nums">
                {scorer.goals}
              </span>
            </div>
            <div aria-hidden="true" className="bg-background h-2 rounded-full">
              <div
                className="bg-chart-1 h-2 rounded-full"
                style={{ width: `${(scorer.goals / max) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </OverviewCard>
  );
}
