import { MatchCard } from "@/components/matches/match-card";
import type { HeadToHead } from "@/lib/stats/head-to-head";

function plural(count: number, singular: string, pluralForm: string): string {
  return `${count} ${count === 1 ? singular : pluralForm}`;
}

type HeadToHeadListProps = {
  result: HeadToHead;
  aName: string;
  bName: string;
};

export function HeadToHeadList({ result, aName, bName }: HeadToHeadListProps) {
  if (result.matches.length === 0) {
    return (
      <p className="text-muted">Os times não se enfrentaram nesta temporada.</p>
    );
  }
  const summary = `${aName} ${plural(result.aWins, "vitória", "vitórias")}, ${plural(
    result.draws,
    "empate",
    "empates",
  )}, ${bName} ${plural(result.bWins, "vitória", "vitórias")}`;

  return (
    <div className="flex flex-col gap-3">
      {result.matches.some((match) => match.status === "FINISHED") ? (
        <p className="font-medium">{summary}</p>
      ) : null}
      <ul className="grid gap-3 md:grid-cols-2">
        {result.matches.map((match) => (
          <li key={match.id}>
            <MatchCard match={match} />
          </li>
        ))}
      </ul>
    </div>
  );
}
