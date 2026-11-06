import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CompareTable } from "@/components/compare/compare-table";
import { HeadToHeadList } from "@/components/compare/head-to-head-list";
import { PointsChart } from "@/components/compare/points-chart";
import { TeamPicker } from "@/components/compare/team-picker";
import {
  CompetitionTabs,
  competitionMetadata,
} from "@/components/competition/competition-tabs";
import { compareLines, pickComparedTeams } from "@/lib/compare";
import { isCompetitionCode } from "@/lib/competitions";
import {
  getCompetition,
  getMatches,
  getStandings,
} from "@/lib/football-api/competitions";
import { handleApiError } from "@/lib/football-api/handle-api-error";
import type { Match, Standings } from "@/lib/football-api/types";
import { headToHead } from "@/lib/stats/head-to-head";
import { pointsProgression } from "@/lib/stats/points-progression";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ a?: string | string[]; b?: string | string[] }>;
};

function single(value: string | string[] | undefined): string | undefined {
  return typeof value === "string" ? value : undefined;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { code } = await params;
  return competitionMetadata(code, "compare");
}

export default async function ComparePage({ params, searchParams }: PageProps) {
  const { code } = await params;
  if (!isCompetitionCode(code)) {
    notFound();
  }
  const query = await searchParams;

  let standings: Standings;
  let matches: Match[];
  try {
    const competition = await getCompetition(code);
    const season = Number(competition.currentSeason.startDate.slice(0, 4));
    [standings, matches] = await Promise.all([
      getStandings(code, season),
      getMatches(code),
    ]);
  } catch (error) {
    return handleApiError(error);
  }

  const rows =
    standings.standings.find((table) => table.type === "TOTAL")?.table ?? [];
  const picked = pickComparedTeams(rows, single(query.a), single(query.b));

  return (
    <div className="flex flex-col gap-8">
      <CompetitionTabs code={code} active="compare" />
      {picked ? (
        <>
          <TeamPicker
            code={code}
            rows={rows}
            a={picked.a.team.id}
            b={picked.b.team.id}
          />
          <CompareTable
            a={picked.a}
            b={picked.b}
            lines={compareLines(picked.a, picked.b)}
          />
          <section aria-labelledby="evolucao" className="flex flex-col gap-3">
            <h2 id="evolucao" className="font-display text-2xl font-semibold">
              Evolução de pontos por rodada
            </h2>
            <PointsChart
              a={{
                name: picked.a.team.shortName ?? picked.a.team.name,
                points: pointsProgression(matches, picked.a.team.id),
              }}
              b={{
                name: picked.b.team.shortName ?? picked.b.team.name,
                points: pointsProgression(matches, picked.b.team.id),
              }}
            />
          </section>
          <section
            aria-labelledby="confronto-direto"
            className="flex flex-col gap-3"
          >
            <h2
              id="confronto-direto"
              className="font-display text-2xl font-semibold"
            >
              Confronto direto
            </h2>
            <HeadToHeadList
              result={headToHead(matches, picked.a.team.id, picked.b.team.id)}
              aName={picked.a.team.shortName ?? picked.a.team.name}
              bName={picked.b.team.shortName ?? picked.b.team.name}
            />
          </section>
        </>
      ) : (
        <p className="text-muted">
          Ainda não há times suficientes para comparar.
        </p>
      )}
    </div>
  );
}
