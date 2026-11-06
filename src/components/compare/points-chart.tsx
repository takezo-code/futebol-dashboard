"use client";

import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type LabelProps,
} from "recharts";
import { ChartTooltipBox } from "@/components/charts/chart-tooltip";
import type { ProgressionPoint } from "@/lib/stats/points-progression";

export type PointsSeries = {
  name: string;
  points: ProgressionPoint[];
};

type Row = {
  round: number;
  a: number | null;
  b: number | null;
};

function mergeSeries(a: PointsSeries, b: PointsSeries): Row[] {
  const rounds = [
    ...new Set([...a.points, ...b.points].map((point) => point.round)),
  ].sort((x, y) => x - y);
  const aByRound = new Map(
    a.points.map((point) => [point.round, point.points]),
  );
  const bByRound = new Map(
    b.points.map((point) => [point.round, point.points]),
  );
  return rounds.map((round) => ({
    round,
    a: aByRound.get(round) ?? null,
    b: bByRound.get(round) ?? null,
  }));
}

function endLabel(name: string, lastIndex: number, offset: number) {
  function EndLabel(props: LabelProps) {
    const { x, y, index } = props;
    if (index !== lastIndex || typeof x !== "number" || typeof y !== "number") {
      return null;
    }
    return (
      <text
        x={x + 8}
        y={y + offset}
        fill="var(--foreground)"
        fontSize={12}
        fontWeight={600}
        dominantBaseline="middle"
      >
        {name}
      </text>
    );
  }
  return EndLabel;
}

function LegendItem({ name, color }: { name: string; color: string }) {
  return (
    <li className="flex items-center gap-2">
      <span
        aria-hidden="true"
        className="h-0.5 w-5 rounded-full"
        style={{ background: color }}
      />
      {name}
    </li>
  );
}

export function PointsChart({ a, b }: { a: PointsSeries; b: PointsSeries }) {
  const rows = mergeSeries(a, b);
  if (rows.length === 0) {
    return <p className="text-muted">Ainda não há rodadas disputadas.</p>;
  }
  const lastIndex = rows.length - 1;
  const last = rows[lastIndex];
  const aAbove = (last?.a ?? 0) >= (last?.b ?? 0);

  return (
    <div className="flex flex-col gap-3">
      <ul aria-label="Legenda" className="flex flex-wrap gap-4 text-sm">
        <LegendItem name={a.name} color="var(--chart-a)" />
        <LegendItem name={b.name} color="var(--chart-b)" />
      </ul>
      <div
        role="img"
        aria-label={`Evolução de pontos: ${a.name} ${last?.a ?? 0}, ${b.name} ${last?.b ?? 0} após a rodada ${last?.round ?? 0}`}
        className="h-72 sm:h-80"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={rows}
            margin={{ top: 28, right: 88, bottom: 8, left: 0 }}
            accessibilityLayer={false}
          >
            <CartesianGrid
              vertical={false}
              stroke="var(--border)"
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="round"
              tick={{ fill: "var(--muted)", fontSize: 12 }}
              axisLine={{ stroke: "var(--border)" }}
              tickLine={false}
              label={{
                value: "Rodada",
                position: "insideBottomRight",
                offset: -4,
                fill: "var(--muted)",
                fontSize: 12,
              }}
            />
            <YAxis
              allowDecimals={false}
              domain={[0, "dataMax"]}
              width={36}
              tick={{ fill: "var(--muted)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ stroke: "var(--muted)", strokeDasharray: "3 3" }}
              content={({ active, payload, label }) => {
                const row = payload?.[0]?.payload as Row | undefined;
                if (!active || !row) {
                  return null;
                }
                return (
                  <ChartTooltipBox title={`Rodada ${String(label)}`}>
                    <span>
                      {a.name}:{" "}
                      <b className="text-foreground">{row.a ?? "–"} pts</b>
                    </span>
                    <span>
                      {b.name}:{" "}
                      <b className="text-foreground">{row.b ?? "–"} pts</b>
                    </span>
                  </ChartTooltipBox>
                );
              }}
            />
            <Line
              type="monotone"
              dataKey="a"
              name={a.name}
              stroke="var(--chart-a)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5, strokeWidth: 2, stroke: "var(--surface)" }}
              connectNulls
              isAnimationActive={false}
            >
              <LabelList
                dataKey="a"
                content={endLabel(a.name, lastIndex, aAbove ? -10 : 10)}
              />
            </Line>
            <Line
              type="monotone"
              dataKey="b"
              name={b.name}
              stroke="var(--chart-b)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5, strokeWidth: 2, stroke: "var(--surface)" }}
              connectNulls
              isAnimationActive={false}
            >
              <LabelList
                dataKey="b"
                content={endLabel(b.name, lastIndex, aAbove ? 10 : -10)}
              />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </div>
      <details className="text-sm">
        <summary className="text-muted hover:text-foreground cursor-pointer">
          Ver dados do gráfico
        </summary>
        <div className="mt-2 max-h-64 overflow-y-auto">
          <table className="w-full max-w-sm text-left">
            <thead className="text-muted">
              <tr>
                <th scope="col" className="py-1 font-medium">
                  Rodada
                </th>
                <th scope="col" className="py-1 font-medium">
                  {a.name}
                </th>
                <th scope="col" className="py-1 font-medium">
                  {b.name}
                </th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {rows.map((row) => (
                <tr key={row.round} className="border-border border-t">
                  <td className="py-1">{row.round}</td>
                  <td className="py-1">{row.a ?? "–"}</td>
                  <td className="py-1">{row.b ?? "–"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
