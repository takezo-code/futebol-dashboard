import type { CompetitionConfig } from "@/lib/competitions";
import type { StandingRow } from "@/lib/football-api/types";

export type PreviewRow = {
  row: StandingRow;
  gapBefore: boolean;
};

export function standingsPreview(
  rows: StandingRow[],
  config: CompetitionConfig,
  top = 6,
  bottom = 4,
): PreviewRow[] {
  const hasRelegation = config.zones.some((zone) => zone.tone === "relegation");
  const picked = new Map<number, StandingRow>();
  rows.slice(0, top).forEach((row) => picked.set(row.team.id, row));
  if (hasRelegation) {
    rows.slice(-bottom).forEach((row) => picked.set(row.team.id, row));
  }

  const ordered = [...picked.values()].sort((a, b) => a.position - b.position);
  return ordered.map((row, index) => {
    const previous = ordered[index - 1];
    return {
      row,
      gapBefore: previous !== undefined && row.position - previous.position > 1,
    };
  });
}
