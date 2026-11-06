"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { MatchCard } from "@/components/matches/match-card";
import { TeamLink } from "@/components/team/team-link";
import { Crest } from "@/components/ui/crest";
import { Skeleton } from "@/components/ui/skeleton";
import type { FavoriteTeam } from "@/lib/favorites/store";
import { matchSchema } from "@/lib/football-api/schemas";
import { FavoriteButton } from "./favorite-button";

const summarySchema = z.object({
  lastResult: matchSchema.nullable(),
  upcoming: z.array(matchSchema),
});

type Summary = z.infer<typeof summarySchema>;

type CardState =
  | { status: "loading" }
  | { status: "ready"; summary: Summary }
  | { status: "rate-limited" }
  | { status: "error" };

const retryClass =
  "border-border hover:bg-background focus-visible:outline-brand self-start rounded-md border px-3 py-1.5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2";

export function FavoriteCard({ team }: { team: FavoriteTeam }) {
  const [state, setState] = useState<CardState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: "loading" });
    fetch(`/api/teams/${team.id}/matches`, { signal: controller.signal })
      .then(async (response) => {
        if (response.status === 429) {
          setState({ status: "rate-limited" });
          return;
        }
        const parsed = summarySchema.safeParse(
          response.ok ? await response.json() : null,
        );
        setState(
          parsed.success
            ? { status: "ready", summary: parsed.data }
            : { status: "error" },
        );
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setState({ status: "error" });
        }
      });
    return () => controller.abort();
  }, [team.id, attempt]);

  const headingId = `favorito-${team.id}`;

  return (
    <section
      aria-labelledby={headingId}
      className="border-border bg-surface flex flex-col gap-4 rounded-lg border p-4"
    >
      <header className="flex items-center gap-3">
        <Crest src={team.crest} name={team.name} size={36} />
        <h2
          id={headingId}
          className="font-display flex-1 text-2xl font-semibold"
        >
          <TeamLink id={team.id}>{team.name}</TeamLink>
        </h2>
        <FavoriteButton team={team} />
      </header>

      {state.status === "loading" ? (
        <div className="flex flex-col gap-3" aria-busy="true">
          <span className="sr-only">Carregando jogos</span>
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      ) : null}

      {state.status === "rate-limited" || state.status === "error" ? (
        <div className="flex flex-col gap-3" role="status">
          <p className="text-muted">
            {state.status === "rate-limited"
              ? "Muitas consultas em pouco tempo. Tente de novo em 1 minuto."
              : "Não foi possível carregar os jogos."}
          </p>
          <button
            type="button"
            onClick={() => setAttempt((value) => value + 1)}
            className={retryClass}
          >
            Tentar de novo
          </button>
        </div>
      ) : null}

      {state.status === "ready" ? (
        <>
          <div className="flex flex-col gap-2">
            <h3 className="text-muted text-sm font-medium">Último resultado</h3>
            {state.summary.lastResult ? (
              <MatchCard match={state.summary.lastResult} />
            ) : (
              <p className="text-muted text-sm">Nenhum jogo disputado ainda.</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-muted text-sm font-medium">Próximos jogos</h3>
            {state.summary.upcoming.length === 0 ? (
              <p className="text-muted text-sm">Nenhum jogo agendado.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {state.summary.upcoming.map((match) => (
                  <li key={match.id}>
                    <MatchCard match={match} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      ) : null}
    </section>
  );
}
