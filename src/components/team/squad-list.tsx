import type { SquadPlayer } from "@/lib/football-api/types";
import { groupSquad } from "@/lib/squad";

export function SquadList({ squad }: { squad: SquadPlayer[] }) {
  if (squad.length === 0) {
    return <p className="text-muted">O elenco ainda não foi divulgado.</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {groupSquad(squad).map((group) => (
        <section key={group.label} className="flex flex-col gap-2">
          <h3 className="font-display text-lg font-semibold">
            {`${group.label} (${group.players.length})`}
          </h3>
          <ul className="flex flex-col gap-1.5 text-sm">
            {group.players.map((player) => (
              <li key={player.id} className="flex flex-col">
                <span className="font-medium">{player.name}</span>
                {player.nationality ? (
                  <span className="text-muted text-xs">
                    {player.nationality}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
