"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

export const LazyScorersChart = dynamic(
  () =>
    import("@/components/scorers/scorers-chart").then(
      (module) => module.ScorersChart,
    ),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[420px] rounded-lg" />,
  },
);

export const LazyPointsChart = dynamic(
  () =>
    import("@/components/compare/points-chart").then(
      (module) => module.PointsChart,
    ),
  {
    ssr: false,
    loading: () => <Skeleton className="h-80 rounded-lg" />,
  },
);
