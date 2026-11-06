import Link from "next/link";
import type { CompetitionCode } from "@/lib/competitions";
import type { Round } from "@/lib/stats/rounds";

type MatchdayNavProps = {
  code: CompetitionCode;
  rounds: Round[];
  current: Round;
  isLive: boolean;
};

const linkClass =
  "border-border hover:bg-surface focus-visible:outline-brand inline-flex size-10 items-center justify-center rounded-md border focus-visible:outline-2 focus-visible:outline-offset-2";

function Arrow({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={direction === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
    </svg>
  );
}

export function MatchdayNav({
  code,
  rounds,
  current,
  isLive,
}: MatchdayNavProps) {
  const index = rounds.findIndex((round) => round.key === current.key);
  const previous = index > 0 ? rounds[index - 1] : undefined;
  const next = rounds[index + 1];
  const href = (round: Round) =>
    `/competicoes/${code}/jogos?rodada=${encodeURIComponent(round.key)}`;

  return (
    <nav
      aria-label="Navegação entre rodadas"
      className="flex items-center justify-between gap-3"
    >
      {previous ? (
        <Link
          href={href(previous)}
          aria-label="Rodada anterior"
          className={linkClass}
        >
          <Arrow direction="left" />
        </Link>
      ) : (
        <span aria-hidden="true" className="size-10" />
      )}
      <div className="flex flex-col items-center gap-1 text-center">
        <span className="font-display text-2xl font-semibold">
          {current.label}
        </span>
        {isLive ? (
          <span className="bg-accent text-on-accent rounded px-2 py-0.5 text-xs font-medium">
            Rodada atual
          </span>
        ) : null}
      </div>
      {next ? (
        <Link
          href={href(next)}
          aria-label="Próxima rodada"
          className={linkClass}
        >
          <Arrow direction="right" />
        </Link>
      ) : (
        <span aria-hidden="true" className="size-10" />
      )}
    </nav>
  );
}
