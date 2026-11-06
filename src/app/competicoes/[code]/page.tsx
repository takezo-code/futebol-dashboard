import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  CompetitionTabs,
  competitionMetadata,
} from "@/components/competition/competition-tabs";
import { CurrentRoundCard } from "@/components/overview/current-round-card";
import { StandingsPreviewCard } from "@/components/overview/standings-preview-card";
import { TopScorersCard } from "@/components/overview/top-scorers-card";
import { COMPETITIONS, isCompetitionCode } from "@/lib/competitions";
import {
  getCompetition,
  getMatches,
  getScorers,
  getStandings,
} from "@/lib/football-api/competitions";
import { handleApiError } from "@/lib/football-api/handle-api-error";
import type { Match, Scorer, Standings } from "@/lib/football-api/types";
import { buildRounds, pickRound } from "@/lib/stats/rounds";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ code: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { code } = await params;
  return competitionMetadata(code, "overview");
}

export default async function OverviewPage({ params }: PageProps) {
  const { code } = await params;
  if (!isCompetitionCode(code)) {
    notFound();
  }
  const config = COMPETITIONS[code];

  let standings: Standings;
  let matches: Match[];
  let scorers: Scorer[];
  try {
    const competition = await getCompetition(code);
    const season = Number(competition.currentSeason.startDate.slice(0, 4));
    [standings, matches, scorers] = await Promise.all([
      getStandings(code, season),
      getMatches(code),
      getScorers(code),
    ]);
  } catch (error) {
    return handleApiError(error);
  }

  const rows =
    standings.standings.find((table) => table.type === "TOTAL")?.table ?? [];
  const rounds = buildRounds(matches);
  const live = pickRound(rounds, undefined, new Date());

  return (
    <div className="flex flex-col gap-6">
      <CompetitionTabs code={code} active="overview" />
      <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <div className="flex flex-col gap-4">
          {live ? <CurrentRoundCard code={code} round={live} isLive /> : null}
          <TopScorersCard code={code} scorers={scorers} />
        </div>
        {rows.length > 0 ? (
          <StandingsPreviewCard
            code={code}
            config={config}
            rows={rows}
            matches={matches}
          />
        ) : null}
      </div>
      {!live && rows.length === 0 ? (
        <p className="text-muted">
          Ainda não há dados desta temporada para mostrar.
        </p>
      ) : null}
    </div>
  );
}
