import { TeamLink } from "@/components/team/team-link";
import { Crest } from "@/components/ui/crest";
import type { CompareLine } from "@/lib/compare";
import type { StandingRow } from "@/lib/football-api/types";

type CompareTableProps = {
  a: StandingRow;
  b: StandingRow;
  lines: CompareLine[];
};

function TeamHeading({ row }: { row: StandingRow }) {
  const name = row.team.shortName ?? row.team.name;
  return (
    <span className="flex flex-col items-center gap-2">
      <Crest src={row.team.crest} name={name} size={40} />
      <TeamLink id={row.team.id} className="font-display text-lg font-semibold">
        {name}
      </TeamLink>
    </span>
  );
}

function Value({ value, isBetter }: { value: string; isBetter: boolean }) {
  return (
    <>
      <span
        className={`font-display text-xl tabular-nums ${isBetter ? "font-bold" : "text-muted"}`}
      >
        {value}
      </span>
      {isBetter ? <span className="sr-only">melhor</span> : null}
    </>
  );
}

export function CompareTable({ a, b, lines }: CompareTableProps) {
  return (
    <div className="border-border bg-surface overflow-hidden rounded-lg border">
      <table className="w-full text-center">
        <caption className="sr-only">Comparação entre os dois times</caption>
        <thead>
          <tr className="border-border border-b">
            <th scope="col" className="w-2/5 px-2 py-4">
              <TeamHeading row={a} />
            </th>
            <th
              scope="col"
              className="text-muted w-1/5 px-2 py-4 text-xs font-medium"
            >
              Estatística
            </th>
            <th scope="col" className="w-2/5 px-2 py-4">
              <TeamHeading row={b} />
            </th>
          </tr>
        </thead>
        <tbody>
          {lines.map((line) => (
            <tr
              key={line.label}
              className="border-border border-b last:border-b-0"
            >
              <td className="px-2 py-2.5">
                <Value value={line.a} isBetter={line.better === "a"} />
              </td>
              <th
                scope="row"
                className="text-muted px-2 py-2.5 text-sm font-normal"
              >
                {line.label}
              </th>
              <td className="px-2 py-2.5">
                <Value value={line.b} isBetter={line.better === "b"} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
