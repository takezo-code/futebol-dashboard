"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartTooltipBox } from "@/components/charts/chart-tooltip";
import type { Scorer } from "@/lib/football-api/types";

export type ScorerRow = {
  name: string;
  team: string;
  goals: number;
};

export function topScorers(scorers: Scorer[], limit: number): ScorerRow[] {
  return scorers.slice(0, limit).map((scorer) => ({
    name: scorer.player.name,
    team: scorer.team.shortName ?? scorer.team.name,
    goals: scorer.goals,
  }));
}

function shortName(value: string): string {
  return value.length > 18 ? `${value.slice(0, 17)}…` : value;
}

const BAR_SIZE = 16;
const ROW_HEIGHT = 34;

export function ScorersChart({ scorers }: { scorers: Scorer[] }) {
  const rows = topScorers(scorers, 10);
  const leader = rows[0];
  if (!leader) {
    return null;
  }

  return (
    <section
      aria-labelledby="grafico-artilharia"
      className="border-border bg-surface flex flex-col gap-3 rounded-lg border p-4"
    >
      <h2
        id="grafico-artilharia"
        className="font-display text-xl font-semibold"
      >
        Os 10 maiores artilheiros
      </h2>
      <div
        role="img"
        aria-label={`${leader.name} lidera com ${leader.goals} gols`}
        style={{ height: rows.length * ROW_HEIGHT + 32 }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={rows}
            layout="vertical"
            margin={{ top: 0, right: 32, bottom: 0, left: 0 }}
            barCategoryGap={4}
            accessibilityLayer={false}
          >
            <CartesianGrid
              horizontal={false}
              stroke="var(--border)"
              strokeDasharray="3 3"
            />
            <XAxis
              type="number"
              allowDecimals={false}
              domain={[0, "dataMax"]}
              tick={{ fill: "var(--muted)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={136}
              tickFormatter={shortName}
              tick={{ fill: "var(--foreground)", fontSize: 13 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: "var(--border)", opacity: 0.4 }}
              content={({ active, payload }) => {
                const row = payload?.[0]?.payload as ScorerRow | undefined;
                if (!active || !row) {
                  return null;
                }
                return (
                  <ChartTooltipBox title={row.name}>
                    <span>{row.team}</span>
                    <span className="text-foreground font-medium">
                      {row.goals} gols
                    </span>
                  </ChartTooltipBox>
                );
              }}
            />
            <Bar
              dataKey="goals"
              fill="var(--chart-1)"
              barSize={BAR_SIZE}
              radius={[0, 4, 4, 0]}
              isAnimationActive={false}
            >
              <LabelList
                dataKey="goals"
                position="right"
                fill="var(--foreground)"
                fontSize={13}
                fontWeight={600}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
