import { FavoriteButton } from "@/components/favorites/favorite-button";
import { Crest } from "@/components/ui/crest";
import type { Team } from "@/lib/football-api/types";
import { translateClubColors } from "@/lib/format";

function displayUrl(url: string): string {
  return url
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/$/, "");
}

function safeUrl(url: string | null): string | null {
  return url !== null && /^https?:\/\//.test(url) ? url : null;
}

export function TeamHeader({ team }: { team: Team }) {
  const website = safeUrl(team.website);
  const facts: { label: string; value: string }[] = [
    { label: "Estádio", value: team.venue ?? "" },
    {
      label: "Fundação",
      value: team.founded === null ? "" : String(team.founded),
    },
    { label: "Cores", value: translateClubColors(team.clubColors) ?? "" },
    { label: "Técnico", value: team.coach?.name ?? "" },
  ].filter((fact) => fact.value !== "");

  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-center">
      <span className="flex size-24 shrink-0 items-center justify-center rounded-xl bg-white p-3">
        <Crest src={team.crest} name={team.name} size={72} />
      </span>
      <div className="flex flex-col gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-4xl leading-tight font-bold">
              {team.name}
            </h1>
            <FavoriteButton
              team={{
                id: team.id,
                name: team.shortName ?? team.name,
                crest: team.crest,
              }}
            />
          </div>
          <p className="text-muted text-sm">{team.area.name}</p>
        </div>
        <dl className="grid grid-cols-1 gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
          {facts.map((fact) => (
            <div key={fact.label} className="flex gap-2">
              <dt className="text-muted">{fact.label}</dt>
              <dd className="font-medium">{fact.value}</dd>
            </div>
          ))}
          {website ? (
            <div className="flex gap-2">
              <dt className="text-muted">Site</dt>
              <dd>
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand font-medium underline underline-offset-4"
                >
                  {displayUrl(website)}
                </a>
              </dd>
            </div>
          ) : null}
        </dl>
      </div>
    </header>
  );
}
