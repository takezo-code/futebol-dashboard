import Link from "next/link";
import { LeagueMenu } from "./league-menu";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  return (
    <header className="border-border bg-background/90 sticky top-0 z-10 border-b backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4">
        <Link
          href="/"
          className="font-display text-brand text-xl font-bold tracking-tight"
        >
          Futebol Dashboard
        </Link>
        <nav aria-label="Principal" className="flex items-center gap-1">
          <Link
            href="/meus-times"
            className="hover:bg-surface focus-visible:outline-brand rounded-md px-3 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Meus times
          </Link>
          <LeagueMenu />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
