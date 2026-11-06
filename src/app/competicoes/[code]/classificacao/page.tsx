import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  CompetitionTabs,
  competitionMetadata,
} from "@/components/competition/competition-tabs";
import { StandingsTable } from "@/components/standings/standings-table";
import { ZoneLegend } from "@/components/standings/zone-legend";
import { COMPETITIONS, isCompetitionCode } from "@/lib/competitions";
import {
  getCompetition,
  getMatches,
  getStandings,
} from "@/lib/football-api/competitions";
import { handleApiError } from "@/lib/football-api/handle-api-error";
import type { Match, Standings } from "@/lib/football-api/types";
import { recentForm, type FormEntry } from "@/lib/stats/form";
import { splitIntoGroups } from "@/lib/stats/groups";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ code: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { code } = await params;
  return competitionMetadata(code, "standings");
}

export default async function StandingsPage({ params }: PageProps) {
  const { code } = await params;
  if (!isCompetitionCode(code)) {
    notFound();
  }
  const config = COMPETITIONS[code];

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

  const total =
    standings.standings.find((table) => table.type === "TOTAL")?.table ?? [];
  const groups = splitIntoGroups(total, matches);
  const formByTeam = new Map<number, FormEntry[]>(
    total.map((row) => [row.team.id, recentForm(matches, row.team.id)]),
  );

  return (
    <div className="flex flex-col gap-6">
      <CompetitionTabs code={code} active="standings" />
      {total.length === 0 ? (
        <p className="text-muted">
          A classificação desta temporada ainda não foi divulgada.
        </p>
      ) : (
        <>
          {groups.map((group) => (
            <section
              key={group.name ?? "geral"}
              className="flex flex-col gap-3"
            >
              {group.name ? (
                <h2 className="font-display text-2xl font-semibold">
                  {group.name}
                </h2>
              ) : null}
              <StandingsTable
                rows={group.rows}
                config={config}
                formByTeam={formByTeam}
                caption={
                  group.name
                    ? `Classificação do ${group.name}`
                    : `Classificação ${config.preposition} ${config.name}`
                }
              />
            </section>
          ))}
          <ZoneLegend zones={config.zones} />
        </>
      )}
    </div>
  );
}
