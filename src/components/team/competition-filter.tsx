import Link from "next/link";
import {
  ALL_COMPETITIONS,
  type TeamCompetition,
} from "@/lib/stats/team-competitions";

type CompetitionFilterProps = {
  teamId: number;
  options: TeamCompetition[];
  selected: string | null;
};

const pillClass =
  "focus-visible:outline-brand rounded-full border px-3 py-1.5 text-sm font-medium whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2";

export function CompetitionFilter({
  teamId,
  options,
  selected,
}: CompetitionFilterProps) {
  if (options.length <= 1) {
    return options[0] ? (
      <p className="text-muted text-sm">{options[0].name}</p>
    ) : null;
  }

  const items = [
    ...options.map((option) => ({ key: option.code, label: option.name })),
    { key: ALL_COMPETITIONS, label: "Todas" },
  ];

  return (
    <nav aria-label="Filtrar por competição">
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => {
          const isActive =
            item.key === ALL_COMPETITIONS
              ? selected === null
              : item.key === selected;
          return (
            <li key={item.key}>
              <Link
                href={`/times/${teamId}?competicao=${item.key}`}
                aria-current={isActive ? "page" : undefined}
                scroll={false}
                className={`${pillClass} ${
                  isActive
                    ? "border-brand bg-brand text-background"
                    : "border-border text-muted hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
