import type { Metadata } from "next";
import Link from "next/link";
import {
  COMPETITIONS,
  isCompetitionCode,
  type CompetitionCode,
} from "@/lib/competitions";

export type CompetitionTab =
  "overview" | "standings" | "matches" | "scorers" | "compare";

const TABS: {
  id: CompetitionTab;
  label: string;
  title: string;
  path: string;
}[] = [
  { id: "overview", label: "Visão geral", title: "Visão geral", path: "" },
  {
    id: "standings",
    label: "Classificação",
    title: "Classificação",
    path: "/classificacao",
  },
  { id: "matches", label: "Jogos", title: "Jogos", path: "/jogos" },
  {
    id: "scorers",
    label: "Artilharia",
    title: "Artilharia",
    path: "/artilharia",
  },
  {
    id: "compare",
    label: "Comparar",
    title: "Comparar times",
    path: "/comparar",
  },
];

const TITLE_SUFFIX = "Futebol Dashboard";

export function competitionMetadata(
  code: string,
  tab: CompetitionTab,
): Metadata {
  if (!isCompetitionCode(code)) {
    return { title: `Competição não encontrada | ${TITLE_SUFFIX}` };
  }
  const { name, preposition } = COMPETITIONS[code];
  const label = TABS.find((item) => item.id === tab)?.title ?? "";
  return {
    title: `${label} ${preposition} ${name} | ${TITLE_SUFFIX}`,
    description: `${label} ${preposition} ${name} na temporada atual, com dados da football-data.org.`,
  };
}

type CompetitionTabsProps = {
  code: CompetitionCode;
  active: CompetitionTab;
};

export function CompetitionTabs({ code, active }: CompetitionTabsProps) {
  return (
    <nav aria-label="Seções da competição" className="border-border border-b">
      <ul className="-mb-px flex gap-1 overflow-x-auto">
        {TABS.map((tab) => {
          const isActive = tab.id === active;
          return (
            <li key={tab.id}>
              <Link
                href={`/competicoes/${code}${tab.path}`}
                aria-current={isActive ? "page" : undefined}
                className={`focus-visible:outline-brand block border-b-2 px-4 py-3 text-sm font-medium whitespace-nowrap focus-visible:outline-2 focus-visible:-outline-offset-2 ${
                  isActive
                    ? "border-brand text-foreground"
                    : "text-muted hover:text-foreground border-transparent"
                }`}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
