import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Crest } from "@/components/ui/crest";
import { COMPETITIONS, isCompetitionCode } from "@/lib/competitions";
import { getCompetition } from "@/lib/football-api/competitions";
import { handleApiError } from "@/lib/football-api/handle-api-error";
import type { Competition } from "@/lib/football-api/types";
import { seasonLabel } from "@/lib/format";

export const dynamic = "force-dynamic";

type CompetitionLayoutProps = {
  children: ReactNode;
  params: Promise<{ code: string }>;
};

export default async function CompetitionLayout({
  children,
  params,
}: CompetitionLayoutProps) {
  const { code } = await params;
  if (!isCompetitionCode(code)) {
    notFound();
  }
  const config = COMPETITIONS[code];

  let competition: Competition;
  try {
    competition = await getCompetition(code);
  } catch (error) {
    return handleApiError(error);
  }
  const { startDate, endDate } = competition.currentSeason;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center gap-4">
        <span className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-white p-2">
          <Crest src={competition.emblem} name={config.name} size={48} />
        </span>
        <div>
          <h1 className="font-display text-3xl leading-tight font-bold sm:text-4xl">
            {config.name}
          </h1>
          <p className="text-muted flex gap-3 text-sm">
            <span>{config.country}</span>
            <span>Temporada {seasonLabel(startDate, endDate)}</span>
          </p>
        </div>
      </header>
      {children}
    </div>
  );
}
