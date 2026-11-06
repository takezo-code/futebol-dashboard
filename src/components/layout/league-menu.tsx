"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { COMPETITION_CODES, COMPETITIONS } from "@/lib/competitions";

export function LeagueMenu() {
  const pathname = usePathname();

  return (
    <details key={pathname} className="relative">
      <summary className="hover:bg-surface focus-visible:outline-brand cursor-pointer list-none rounded-md px-3 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2">
        Ligas
      </summary>
      <ul className="border-border bg-surface absolute right-0 z-20 mt-2 w-60 rounded-lg border p-1 shadow-lg">
        {COMPETITION_CODES.map((code) => (
          <li key={code}>
            <Link
              href={`/competicoes/${code}`}
              className="hover:bg-background block rounded-md px-3 py-2 text-sm"
            >
              {COMPETITIONS[code].name}
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
}
