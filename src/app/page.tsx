import { CompetitionCard } from "@/components/competition/competition-card";
import {
  COMPETITION_CODES,
  COMPETITIONS,
  isCompetitionCode,
} from "@/lib/competitions";
import { TodayMatches } from "@/components/home/today-matches";
import {
  getCompetitions,
  loadTodayMatches,
} from "@/lib/football-api/competitions";
import { handleApiError } from "@/lib/football-api/handle-api-error";
import type { Competition, Match } from "@/lib/football-api/types";

export const dynamic = "force-dynamic";

export default async function Home() {
  let competitions: Competition[];
  let today: Match[];
  try {
    [competitions, today] = await Promise.all([
      getCompetitions(),
      loadTodayMatches(new Date()),
    ]);
  } catch (error) {
    return handleApiError(error);
  }

  const byCode = new Map(
    competitions.flatMap((competition) =>
      isCompetitionCode(competition.code)
        ? [[competition.code, competition] as const]
        : [],
    ),
  );

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-4xl font-bold">
          Ligas e copas de clubes
        </h1>
        <p className="text-muted mt-1">
          Escolha uma competição para ver classificação, jogos e artilharia.
        </p>
      </div>
      <TodayMatches matches={today} />
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {COMPETITION_CODES.map((code) => {
          const competition = byCode.get(code);
          return competition ? (
            <li key={code}>
              <CompetitionCard
                competition={competition}
                config={COMPETITIONS[code]}
              />
            </li>
          ) : null;
        })}
      </ul>
    </section>
  );
}
