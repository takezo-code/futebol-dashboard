import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { CompetitionHeader } from "@/components/competition/competition-header";
import { COMPETITIONS, isCompetitionCode } from "@/lib/competitions";
import { getCompetition, getMatches } from "@/lib/football-api/competitions";
import { handleApiError } from "@/lib/football-api/handle-api-error";
import type { Competition, Match } from "@/lib/football-api/types";
import { seasonProgress } from "@/lib/stats/season-progress";

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
  const matches: Match[] | null = await getMatches(code).catch(() => null);

  return (
    <div className="flex flex-col gap-6">
      <CompetitionHeader
        competition={competition}
        config={config}
        progress={
          matches
            ? seasonProgress(competition.currentSeason, matches, new Date())
            : null
        }
      />
      {children}
    </div>
  );
}
