import Link from "next/link";
import type { ReactNode } from "react";

type OverviewCardProps = {
  id: string;
  title: string;
  badge?: ReactNode;
  link?: { href: string; label: string };
  children: ReactNode;
};

export function OverviewCard({
  id,
  title,
  badge,
  link,
  children,
}: OverviewCardProps) {
  return (
    <section
      aria-labelledby={id}
      className="border-border bg-surface flex flex-col gap-3 rounded-xl border p-4"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 id={id} className="font-display text-xl font-semibold">
          {title}
        </h2>
        {badge}
      </div>
      {children}
      {link ? (
        <Link
          href={link.href}
          className="text-brand focus-visible:outline-brand self-start rounded-sm text-sm font-medium hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {link.label}
        </Link>
      ) : null}
    </section>
  );
}
