import "server-only";
import { cache } from "react";
import { apiFetch, CACHE } from "./client";
import { matchesResponseSchema, teamSchema } from "./schemas";
import type { Match, Team } from "./types";

export const getTeam = cache(async (id: number): Promise<Team> =>
  apiFetch(`/teams/${id}`, teamSchema, { revalidate: CACHE.TEAM }),
);

export const getTeamMatches = cache(async (id: number): Promise<Match[]> => {
  const data = await apiFetch(`/teams/${id}/matches`, matchesResponseSchema, {
    revalidate: CACHE.MATCHES,
  });
  return data.matches;
});
