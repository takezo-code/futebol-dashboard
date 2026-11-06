import type { FormEntry, FormResult } from "@/lib/stats/form";
import { scoreLine } from "@/lib/stats/rounds";

const RESULT_LABEL: Record<FormResult, string> = {
  W: "Vitória",
  D: "Empate",
  L: "Derrota",
};

const RESULT_CLASS: Record<FormResult, string> = {
  W: "bg-win",
  D: "bg-draw",
  L: "bg-loss",
};

function describe(entry: FormEntry, teamId: number): string {
  const { match } = entry;
  const isHome = match.homeTeam.id === teamId;
  const { home, away } = scoreLine(match);
  const goalsFor = isHome ? home : away;
  const goalsAgainst = isHome ? away : home;
  const opponent = isHome ? match.awayTeam : match.homeTeam;
  const opponentName = opponent.shortName ?? opponent.name ?? "A definir";
  return `${RESULT_LABEL[entry.result]} ${goalsFor ?? 0} × ${goalsAgainst ?? 0} contra ${opponentName}`;
}

type FormDotsProps = {
  entries: FormEntry[];
  teamId: number;
};

export function FormDots({ entries, teamId }: FormDotsProps) {
  if (entries.length === 0) {
    return <span className="text-muted">–</span>;
  }
  return (
    <ul aria-label="Últimos jogos" className="flex items-center gap-1.5">
      {entries.map((entry) => (
        <li
          key={entry.match.id}
          title={describe(entry, teamId)}
          className={`size-3 rounded-full ${RESULT_CLASS[entry.result]}`}
        >
          <span className="sr-only">{RESULT_LABEL[entry.result]}</span>
        </li>
      ))}
    </ul>
  );
}
