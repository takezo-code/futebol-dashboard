import type { SplitStats, TeamStats } from "@/lib/stats/team-stats";

function percentage(value: number | null): string {
  return value === null ? "–" : `${value}%`;
}

function average(value: number | null): string {
  return value === null
    ? "–"
    : value.toLocaleString("pt-BR", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      });
}

function record(stats: SplitStats): string {
  return `${stats.won}V ${stats.drawn}E ${stats.lost}D`;
}

function Card({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className="border-border bg-surface flex flex-col gap-1 rounded-lg border p-4">
      <dt className="text-muted text-sm">{label}</dt>
      <dd className="font-display text-3xl font-bold tabular-nums">{value}</dd>
      {detail ? <dd className="text-muted text-xs">{detail}</dd> : null}
    </div>
  );
}

export function TeamStatsCards({ stats }: { stats: TeamStats }) {
  return (
    <dl className="grid grid-cols-2 gap-3 md:grid-cols-3">
      <Card
        label="Aproveitamento geral"
        value={percentage(stats.overall.percentage)}
        detail={record(stats.overall)}
      />
      <Card
        label="Em casa"
        value={percentage(stats.home.percentage)}
        detail={record(stats.home)}
      />
      <Card
        label="Fora de casa"
        value={percentage(stats.away.percentage)}
        detail={record(stats.away)}
      />
      <Card
        label="Gols marcados por jogo"
        value={average(stats.goalsForAverage)}
      />
      <Card
        label="Gols sofridos por jogo"
        value={average(stats.goalsAgainstAverage)}
      />
      <Card
        label="Maior sequência de vitórias"
        value={
          stats.overall.played === 0 ? "–" : String(stats.longestWinStreak)
        }
      />
    </dl>
  );
}
