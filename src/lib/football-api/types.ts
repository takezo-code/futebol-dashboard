import type { z } from "zod";
import type {
  areaSchema,
  coachSchema,
  competitionSchema,
  competitionSummarySchema,
  matchSchema,
  matchTeamSchema,
  scorerSchema,
  scoreSchema,
  seasonSchema,
  squadPlayerSchema,
  standingRowSchema,
  standingsResponseSchema,
  standingTableSchema,
  teamRefSchema,
  teamSchema,
} from "./schemas";

export type Area = z.infer<typeof areaSchema>;
export type TeamRef = z.infer<typeof teamRefSchema>;
export type MatchTeam = z.infer<typeof matchTeamSchema>;
export type Season = z.infer<typeof seasonSchema>;
export type CompetitionSummary = z.infer<typeof competitionSummarySchema>;
export type Competition = z.infer<typeof competitionSchema>;
export type StandingRow = z.infer<typeof standingRowSchema>;
export type StandingTable = z.infer<typeof standingTableSchema>;
export type Standings = z.infer<typeof standingsResponseSchema>;
export type Score = z.infer<typeof scoreSchema>;
export type Match = z.infer<typeof matchSchema>;
export type Scorer = z.infer<typeof scorerSchema>;
export type SquadPlayer = z.infer<typeof squadPlayerSchema>;
export type Coach = z.infer<typeof coachSchema>;
export type Team = z.infer<typeof teamSchema>;
