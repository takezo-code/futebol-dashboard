import Link from "next/link";
import { Crest } from "@/components/ui/crest";
import type { CompetitionConfig } from "@/lib/competitions";
import type { Competition } from "@/lib/football-api/types";
import { seasonLabel } from "@/lib/format";

type CompetitionCardProps = {
  competition: Competition;
  config: CompetitionConfig;
};

export function CompetitionCard({ competition, config }: CompetitionCardProps) {
  const { startDate, endDate } = competition.currentSeason;

  return (
    <Link
      href={`/competicoes/${config.code}`}
      className="border-border bg-surface hover:border-brand focus-visible:outline-brand flex items-center gap-4 rounded-lg border p-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <span className="flex size-14 shrink-0 items-center justify-center rounded-md bg-white p-1.5">
        <Crest src={competition.emblem} name={config.name} size={44} />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="font-display truncate text-xl font-semibold">
          {config.name}
        </span>
        <span className="text-muted text-sm">{config.country}</span>
        <span className="text-muted text-sm">
          Temporada {seasonLabel(startDate, endDate)}
        </span>
      </span>
    </Link>
  );
}
