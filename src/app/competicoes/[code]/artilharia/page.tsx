import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  CompetitionTabs,
  competitionMetadata,
} from "@/components/competition/competition-tabs";
import { ScorersTable } from "@/components/scorers/scorers-table";
import { isCompetitionCode } from "@/lib/competitions";
import { getScorers } from "@/lib/football-api/competitions";
import { handleApiError } from "@/lib/football-api/handle-api-error";
import type { Scorer } from "@/lib/football-api/types";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ code: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { code } = await params;
  return competitionMetadata(code, "scorers");
}

export default async function ScorersPage({ params }: PageProps) {
  const { code } = await params;
  if (!isCompetitionCode(code)) {
    notFound();
  }

  let scorers: Scorer[];
  try {
    scorers = await getScorers(code);
  } catch (error) {
    return handleApiError(error);
  }

  return (
    <div className="flex flex-col gap-6">
      <CompetitionTabs code={code} active="scorers" />
      <ScorersTable scorers={scorers} />
    </div>
  );
}
