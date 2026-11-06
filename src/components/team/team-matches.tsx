import { MatchCard } from "@/components/matches/match-card";
import type { Match } from "@/lib/football-api/types";

const UPCOMING = new Set(["IN_PLAY", "PAUSED", "SCHEDULED", "TIMED"]);
const LIMIT = 5;

function Section({
  id,
  title,
  matches,
  empty,
}: {
  id: string;
  title: string;
  matches: Match[];
  empty: string;
}) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3">
      <h2 id={id} className="font-display text-2xl font-semibold">
        {title}
      </h2>
      {matches.length === 0 ? (
        <p className="text-muted">{empty}</p>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {matches.map((match) => (
            <li key={match.id}>
              <MatchCard match={match} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function TeamMatches({ matches }: { matches: Match[] }) {
  const upcoming = matches
    .filter((match) => UPCOMING.has(match.status))
    .sort((a, b) => a.utcDate.localeCompare(b.utcDate))
    .slice(0, LIMIT);
  const recent = matches
    .filter((match) => match.status === "FINISHED")
    .sort((a, b) => b.utcDate.localeCompare(a.utcDate))
    .slice(0, LIMIT);

  return (
    <div className="flex flex-col gap-8">
      <Section
        id="proximos-jogos"
        title="Próximos jogos"
        matches={upcoming}
        empty="Nenhum jogo agendado."
      />
      <Section
        id="ultimos-resultados"
        title="Últimos resultados"
        matches={recent}
        empty="Nenhum jogo disputado ainda."
      />
    </div>
  );
}
