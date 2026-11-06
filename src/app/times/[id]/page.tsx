import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CompetitionFilter } from "@/components/team/competition-filter";
import { SquadList } from "@/components/team/squad-list";
import { TeamHeader } from "@/components/team/team-header";
import { TeamMatches } from "@/components/team/team-matches";
import { TeamStatsCards } from "@/components/team/team-stats";
import { NotFoundError } from "@/lib/football-api/errors";
import { handleApiError } from "@/lib/football-api/handle-api-error";
import { getTeam, getTeamMatches } from "@/lib/football-api/teams";
import type { Match, Team } from "@/lib/football-api/types";
import {
  filterByCompetition,
  pickTeamCompetition,
  teamCompetitions,
} from "@/lib/stats/team-competitions";
import { computeTeamStats } from "@/lib/stats/team-stats";
import { parseTeamId } from "@/lib/team-id";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ competicao?: string | string[] }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const teamId = parseTeamId(id);
  if (teamId === null) {
    return { title: "Time não encontrado | Painel da Bola" };
  }
  try {
    const team = await getTeam(teamId);
    return {
      title: `${team.name} | Painel da Bola`,
      description: `Elenco, jogos e estatísticas do ${team.name} na temporada atual.`,
    };
  } catch (error) {
    return {
      title:
        error instanceof NotFoundError
          ? "Time não encontrado | Painel da Bola"
          : "Time | Painel da Bola",
    };
  }
}

export default async function TeamPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const teamId = parseTeamId(id);
  if (teamId === null) {
    notFound();
  }
  const { competicao } = await searchParams;
  const requested = typeof competicao === "string" ? competicao : undefined;

  let team: Team;
  let matches: Match[];
  try {
    [team, matches] = await Promise.all([
      getTeam(teamId),
      getTeamMatches(teamId),
    ]);
  } catch (error) {
    return handleApiError(error);
  }

  const options = teamCompetitions(matches);
  const selected = pickTeamCompetition(options, requested);
  const filtered = filterByCompetition(matches, selected);

  return (
    <div className="flex flex-col gap-10">
      <TeamHeader team={team} />
      <section aria-labelledby="desempenho" className="flex flex-col gap-4">
        <h2 id="desempenho" className="font-display text-2xl font-semibold">
          Desempenho na temporada
        </h2>
        <CompetitionFilter
          teamId={teamId}
          options={options}
          selected={selected}
        />
        <TeamStatsCards stats={computeTeamStats(filtered, teamId)} />
      </section>
      <TeamMatches matches={filtered} />
      <section aria-labelledby="elenco" className="flex flex-col gap-4">
        <h2 id="elenco" className="font-display text-2xl font-semibold">
          Elenco
        </h2>
        <SquadList squad={team.squad} />
      </section>
    </div>
  );
}
