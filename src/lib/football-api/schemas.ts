import { z } from "zod";

export const areaSchema = z.object({
  id: z.number(),
  name: z.string(),
  code: z.string(),
  flag: z.string().nullable(),
});

export const teamRefSchema = z.object({
  id: z.number(),
  name: z.string(),
  shortName: z.string(),
  tla: z.string(),
  crest: z.string(),
});

export const matchTeamSchema = z.object({
  id: z.number().nullable(),
  name: z.string().nullable(),
  shortName: z.string().nullable(),
  tla: z.string().nullable(),
  crest: z.string().nullable(),
});

export const seasonSchema = z.object({
  id: z.number(),
  startDate: z.string(),
  endDate: z.string(),
  currentMatchday: z.number().nullable(),
  winner: teamRefSchema.nullable(),
});

export const competitionSummarySchema = z.object({
  id: z.number(),
  name: z.string(),
  code: z.string(),
  type: z.string(),
  emblem: z.string(),
});

export const competitionSchema = competitionSummarySchema.extend({
  area: areaSchema,
  currentSeason: seasonSchema,
});

export const competitionsResponseSchema = z.object({
  competitions: z.array(competitionSchema),
});

export const standingRowSchema = z.object({
  position: z.number(),
  team: teamRefSchema,
  playedGames: z.number(),
  form: z.string().nullable(),
  won: z.number(),
  draw: z.number(),
  lost: z.number(),
  points: z.number(),
  goalsFor: z.number(),
  goalsAgainst: z.number(),
  goalDifference: z.number(),
});

export const standingTableSchema = z.object({
  stage: z.string(),
  type: z.string(),
  group: z.string().nullable(),
  table: z.array(standingRowSchema),
});

export const standingsResponseSchema = z.object({
  competition: competitionSummarySchema,
  season: seasonSchema,
  standings: z.array(standingTableSchema),
});

const scoreLineSchema = z.object({
  home: z.number().nullable(),
  away: z.number().nullable(),
});

export const scoreSchema = z.object({
  winner: z.enum(["HOME_TEAM", "AWAY_TEAM", "DRAW"]).nullable(),
  duration: z.string(),
  fullTime: scoreLineSchema,
  halfTime: scoreLineSchema,
});

export const matchSchema = z.object({
  id: z.number(),
  utcDate: z.string(),
  status: z.string(),
  matchday: z.number().nullable(),
  stage: z.string(),
  group: z.string().nullable(),
  competition: competitionSummarySchema,
  homeTeam: matchTeamSchema,
  awayTeam: matchTeamSchema,
  score: scoreSchema,
});

export const matchesResponseSchema = z.object({
  matches: z.array(matchSchema),
});

export const scorerSchema = z.object({
  player: z.object({
    id: z.number(),
    name: z.string(),
    nationality: z.string().nullable(),
  }),
  team: teamRefSchema,
  playedMatches: z.number(),
  goals: z.number(),
  assists: z.number().nullable(),
  penalties: z.number().nullable(),
});

export const scorersResponseSchema = z.object({
  scorers: z.array(scorerSchema),
});

export const squadPlayerSchema = z.object({
  id: z.number(),
  name: z.string(),
  position: z.string().nullable(),
  dateOfBirth: z.string().nullable(),
  nationality: z.string().nullable(),
});

export const coachSchema = z.object({
  id: z.number().nullable(),
  name: z.string().nullable(),
});

export const teamSchema = teamRefSchema.extend({
  area: areaSchema,
  address: z.string().nullable(),
  website: z.string().nullable(),
  founded: z.number().nullable(),
  clubColors: z.string().nullable(),
  venue: z.string().nullable(),
  coach: coachSchema.nullable(),
  squad: z.array(squadPlayerSchema),
});

export const competitionTeamsResponseSchema = z.object({
  teams: z.array(teamRefSchema),
});
