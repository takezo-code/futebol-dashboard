import { Crest } from "@/components/ui/crest";
import type { CompetitionConfig } from "@/lib/competitions";
import type { Competition } from "@/lib/football-api/types";
import { seasonLabel } from "@/lib/format";
import type { SeasonProgress } from "@/lib/stats/season-progress";

type CompetitionHeaderProps = {
  competition: Competition;
  config: CompetitionConfig;
  progress: SeasonProgress | null;
};

const STRIPES = Array.from({ length: 12 }, (_, index) => index);

export function CompetitionHeader({
  competition,
  config,
  progress,
}: CompetitionHeaderProps) {
  const { startDate, endDate } = competition.currentSeason;

  return (
    <header className="bg-pitch relative isolate overflow-hidden rounded-xl text-white">
      <div aria-hidden="true" className="absolute inset-0 -z-10 flex">
        {STRIPES.map((stripe) => (
          <span
            key={stripe}
            className={`flex-1 ${stripe % 2 === 0 ? "bg-pitch-stripe" : ""}`}
          />
        ))}
      </div>
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
        <div className="flex flex-1 items-center gap-4">
          <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-white p-2.5 shadow-sm">
            <Crest src={competition.emblem} name={config.name} size={44} />
          </span>
          <div className="min-w-0">
            <h1 className="font-display text-3xl leading-tight font-bold sm:text-4xl">
              {config.name}
            </h1>
            <p className="flex gap-3 text-sm text-white">
              <span>{config.country}</span>
              <span>Temporada {seasonLabel(startDate, endDate)}</span>
            </p>
          </div>
        </div>
        {progress ? (
          <div className="flex flex-col gap-2 sm:w-52 sm:items-end">
            <p className="flex items-baseline gap-1.5">
              <span className="font-display text-2xl font-bold tabular-nums">
                {progress.label}
              </span>
              {progress.detail ? (
                <span className="text-sm text-white">{progress.detail}</span>
              ) : null}
            </p>
            <div
              role="progressbar"
              aria-label="Progresso da temporada"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress.percent}
              aria-valuetext={[progress.label, progress.detail]
                .filter(Boolean)
                .join(" ")}
              className="h-1.5 w-full overflow-hidden rounded-full bg-white/25"
            >
              <div
                className="bg-accent h-full rounded-full"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
