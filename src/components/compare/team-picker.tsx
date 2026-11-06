"use client";

import { useRouter } from "next/navigation";
import type { CompetitionCode } from "@/lib/competitions";
import type { StandingRow } from "@/lib/football-api/types";

type TeamOption = {
  id: number;
  name: string;
};

type TeamPickerProps = {
  code: CompetitionCode;
  rows: StandingRow[];
  a: number;
  b: number;
};

const selectClass =
  "border-border bg-surface focus-visible:outline-brand w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2";

function TeamSelect({
  id,
  label,
  teams,
  value,
  blocked,
  onPick,
}: {
  id: string;
  label: string;
  teams: TeamOption[];
  value: number;
  blocked: number;
  onPick: (teamId: number) => void;
}) {
  return (
    <div className="flex flex-1 flex-col gap-1">
      <label htmlFor={id} className="text-muted text-sm">
        {label}
      </label>
      <select
        id={id}
        value={String(value)}
        onChange={(event) => onPick(Number(event.target.value))}
        className={selectClass}
      >
        {teams.map((team) => (
          <option key={team.id} value={team.id} disabled={team.id === blocked}>
            {team.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export function TeamPicker({ code, rows, a, b }: TeamPickerProps) {
  const router = useRouter();
  const teams = rows
    .map((row) => ({
      id: row.team.id,
      name: row.team.shortName ?? row.team.name,
    }))
    .sort((x, y) => x.name.localeCompare(y.name, "pt-BR"));

  function go(nextA: number, nextB: number) {
    router.push(`/competicoes/${code}/comparar?a=${nextA}&b=${nextB}`, {
      scroll: false,
    });
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <TeamSelect
        id="time-1"
        label="Time 1"
        teams={teams}
        value={a}
        blocked={b}
        onPick={(teamId) => go(teamId, b)}
      />
      <TeamSelect
        id="time-2"
        label="Time 2"
        teams={teams}
        value={b}
        blocked={a}
        onPick={(teamId) => go(a, teamId)}
      />
    </div>
  );
}
