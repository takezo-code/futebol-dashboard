import { MatchCard } from "@/components/matches/match-card";
import type { Match } from "@/lib/football-api/types";
import { formatDayHeading } from "@/lib/format";
import { groupMatchesByDay } from "@/lib/stats/matches-by-day";

export function MatchesByDay({
  matches,
  now,
}: {
  matches: Match[];
  now: Date;
}) {
  return (
    <div className="flex flex-col gap-6">
      {groupMatchesByDay(matches).map((group) => {
        const first = group.matches[0];
        return first ? (
          <section key={group.day} className="flex flex-col gap-3">
            <h2 className="font-display text-muted text-lg font-semibold">
              {formatDayHeading(first.utcDate, now)}
            </h2>
            <ul className="grid gap-3 md:grid-cols-2">
              {group.matches.map((match) => (
                <li key={match.id}>
                  <MatchCard match={match} />
                </li>
              ))}
            </ul>
          </section>
        ) : null;
      })}
    </div>
  );
}
