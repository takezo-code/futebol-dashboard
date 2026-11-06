import type { Match, StandingRow } from "@/lib/football-api/types";

export type StandingGroup = {
  name: string | null;
  rows: StandingRow[];
};

function groupLabel(apiGroup: string): string {
  return `Grupo ${apiGroup.replace(/^GROUP_/, "")}`;
}

export function splitIntoGroups(
  table: StandingRow[],
  matches: Match[],
): StandingGroup[] {
  const groupByTeam = new Map<number, string>();
  for (const match of matches) {
    if (match.stage !== "GROUP_STAGE" || match.group === null) {
      continue;
    }
    for (const team of [match.homeTeam, match.awayTeam]) {
      if (team.id !== null) {
        groupByTeam.set(team.id, match.group);
      }
    }
  }

  if (groupByTeam.size === 0) {
    return [{ name: null, rows: table }];
  }

  const grouped = new Map<string, StandingRow[]>();
  const ungrouped: StandingRow[] = [];
  for (const row of table) {
    const group = groupByTeam.get(row.team.id);
    if (group === undefined) {
      ungrouped.push(row);
      continue;
    }
    grouped.set(group, [...(grouped.get(group) ?? []), row]);
  }

  const groups: StandingGroup[] = [...grouped.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([group, rows]) => ({
      name: groupLabel(group),
      rows: rows.map((row, index) => ({ ...row, position: index + 1 })),
    }));

  return ungrouped.length > 0
    ? [...groups, { name: null, rows: ungrouped }]
    : groups;
}
