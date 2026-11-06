import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  CompetitionTabs,
  competitionMetadata,
} from "@/components/competition/competition-tabs";
import { MatchdayNav } from "@/components/matches/matchday-nav";
import { MatchesByDay } from "@/components/overview/matches-by-day";
import { isCompetitionCode } from "@/lib/competitions";
import { getMatches } from "@/lib/football-api/competitions";
import { handleApiError } from "@/lib/football-api/handle-api-error";
import type { Match } from "@/lib/football-api/types";
import { buildRounds, pickRound } from "@/lib/stats/rounds";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ rodada?: string | string[] }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { code } = await params;
  return competitionMetadata(code, "matches");
}

export default async function MatchesPage({ params, searchParams }: PageProps) {
  const { code } = await params;
  if (!isCompetitionCode(code)) {
    notFound();
  }
  const { rodada } = await searchParams;
  const requested = typeof rodada === "string" ? rodada : undefined;

  let matches: Match[];
  try {
    matches = await getMatches(code);
  } catch (error) {
    return handleApiError(error);
  }

  const now = new Date();
  const rounds = buildRounds(matches);
  const current = pickRound(rounds, requested, now);
  const live = pickRound(rounds, undefined, now);

  return (
    <div className="flex flex-col gap-6">
      <CompetitionTabs code={code} active="matches" />
      {current ? (
        <>
          <MatchdayNav
            code={code}
            rounds={rounds}
            current={current}
            isLive={current.key === live?.key}
          />
          <MatchesByDay matches={current.matches} now={now} />
        </>
      ) : (
        <p className="text-muted">Ainda não há jogos nesta temporada.</p>
      )}
    </div>
  );
}
