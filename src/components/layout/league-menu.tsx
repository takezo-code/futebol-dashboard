"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { KeyboardEvent } from "react";
import { COMPETITION_CODES, COMPETITIONS } from "@/lib/competitions";

function isCurrent(pathname: string, code: string): boolean {
  const base = `/competicoes/${code}`;
  return pathname === base || pathname.startsWith(`${base}/`);
}

export function LeagueMenu() {
  const pathname = usePathname();

  function onKeyDown(event: KeyboardEvent<HTMLDetailsElement>) {
    if (event.key === "Escape" && event.currentTarget.open) {
      event.currentTarget.open = false;
      event.currentTarget.querySelector("summary")?.focus();
    }
  }

  return (
    <details key={pathname} className="relative" onKeyDown={onKeyDown}>
      <summary className="hover:bg-surface focus-visible:outline-brand cursor-pointer list-none rounded-md px-3 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2">
        Ligas
      </summary>
      <ul className="border-border bg-surface absolute right-0 z-20 mt-2 w-60 rounded-lg border p-1 shadow-lg">
        {COMPETITION_CODES.map((code) => {
          const current = isCurrent(pathname, code);
          return (
            <li key={code}>
              <Link
                href={`/competicoes/${code}`}
                aria-current={current ? "page" : undefined}
                className={`hover:bg-background block rounded-md px-3 py-2 text-sm ${current ? "text-brand font-semibold" : ""}`}
              >
                {COMPETITIONS[code].name}
              </Link>
            </li>
          );
        })}
      </ul>
    </details>
  );
}
