import "server-only";
import { cache } from "react";
import { isCompetitionCode } from "@/lib/competitions";
import { brasiliaDayKey } from "@/lib/format";
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

function nextDay(day: string): string {
  const date = new Date(`${day}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}

export const getTodayMatches = cache(async (day: string): Promise<Match[]> => {
  const data = await apiFetch(
    `/matches?dateFrom=${day}&dateTo=${nextDay(day)}`,
    matchesResponseSchema,
    { revalidate: CACHE.MATCHES },
  );
  return data.matches.filter(
    (match) =>
      isCompetitionCode(match.competition.code) &&
      brasiliaDayKey(new Date(match.utcDate)) === day,
  );
});

export async function loadTodayMatches(now: Date): Promise<Match[]> {
  try {
    return await getTodayMatches(brasiliaDayKey(now));
  } catch {
    return [];
  }
}
