import type { ReactNode } from "react";

export function ChartTooltipBox({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="border-border bg-surface text-foreground rounded-md border px-3 py-2 text-sm shadow-lg">
      <p className="font-medium">{title}</p>
      <div className="text-muted mt-1 flex flex-col gap-0.5">{children}</div>
    </div>
  );
}
