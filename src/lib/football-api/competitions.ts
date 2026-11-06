import "server-only";
import { cache } from "react";
import { apiFetch, CACHE } from "./client";
import {
  competitionSchema,
  competitionsResponseSchema,
  competitionTeamsResponseSchema,
  matchesResponseSchema,
  scorersResponseSchema,
  standingsResponseSchema,
} from "./schemas";
import type { Competition, Match, Scorer, Standings, TeamRef } from "./types";

function competitionPath(code: string, resource = ""): string {
  return `/competitions/${encodeURIComponent(code)}${resource}`;
}

export const getCompetitions = cache(async (): Promise<Competition[]> => {
  const data = await apiFetch("/competitions", competitionsResponseSchema, {
    revalidate: CACHE.COMPETITIONS,
  });
  return data.competitions;
});

export const getCompetition = cache(
  async (code: string): Promise<Competition> =>
    apiFetch(competitionPath(code), competitionSchema, {
      revalidate: CACHE.COMPETITIONS,
    }),
);

export const getStandings = cache(
  async (code: string, season?: number): Promise<Standings> => {
    const query = season === undefined ? "" : `?season=${season}`;
    return apiFetch(
      competitionPath(code, `/standings${query}`),
      standingsResponseSchema,
      { revalidate: CACHE.STANDINGS },
    );
  },
);

export const getMatches = cache(
  async (code: string, matchday?: number): Promise<Match[]> => {
    const query = matchday === undefined ? "" : `?matchday=${matchday}`;
    const data = await apiFetch(
      competitionPath(code, `/matches${query}`),
      matchesResponseSchema,
      { revalidate: CACHE.MATCHES },
    );
    return data.matches;
  },
);

export const getScorers = cache(
  async (code: string, limit = 20): Promise<Scorer[]> => {
    const data = await apiFetch(
      competitionPath(code, `/scorers?limit=${limit}`),
      scorersResponseSchema,
      { revalidate: CACHE.SCORERS },
    );
    return data.scorers;
  },
);

export const getCompetitionTeams = cache(
  async (code: string): Promise<TeamRef[]> => {
    const data = await apiFetch(
      competitionPath(code, "/teams"),
      competitionTeamsResponseSchema,
      { revalidate: CACHE.TEAMS },
    );
    return data.teams;
  },
);
