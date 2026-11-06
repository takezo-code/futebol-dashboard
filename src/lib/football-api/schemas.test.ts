import { describe, expect, it } from "vitest";
import competitionBsa from "./__fixtures__/competition-bsa.json";
import competitions from "./__fixtures__/competitions.json";
import matchesBsa from "./__fixtures__/matches-bsa-matchday.json";
import matchesBsaSeason from "./__fixtures__/matches-bsa-season.json";
import matchesCli from "./__fixtures__/matches-cli.json";
import scorersBsa from "./__fixtures__/scorers-bsa.json";
import standingsBsa from "./__fixtures__/standings-bsa.json";
import standingsCl from "./__fixtures__/standings-cl.json";
import standingsCli from "./__fixtures__/standings-cli.json";
import standingsWc from "./__fixtures__/standings-wc.json";
import teamDetail from "./__fixtures__/team-detail.json";
import teamMatches from "./__fixtures__/team-matches.json";
import teamsBsa from "./__fixtures__/teams-bsa.json";
import {
  competitionSchema,
  competitionsResponseSchema,
  competitionTeamsResponseSchema,
  matchesResponseSchema,
  matchSchema,
  scorersResponseSchema,
  standingRowSchema,
  standingsResponseSchema,
  teamSchema,
} from "./schemas";

const firstMatch = matchesBsa.matches[0];

describe("football api schemas", () => {
  it("parses the competitions list", () => {
    const result = competitionsResponseSchema.parse(competitions);
    expect(result.competitions).toHaveLength(13);
    const bsa = result.competitions.find((c) => c.code === "BSA");
    expect(bsa?.currentSeason.currentMatchday).toBe(34);
  });

  it("parses a single competition", () => {
    expect(competitionSchema.parse(competitionBsa).area.name).toBe("Brazil");
  });

  it("parses league standings with null form", () => {
    const row =
      standingsResponseSchema.parse(standingsBsa).standings[0]?.table[0];
    expect(row?.team.shortName).toBe("Flamengo");
    expect(row?.form).toBeNull();
  });

  it("parses champions league standings", () => {
    const table = standingsResponseSchema.parse(standingsCl).standings[0];
    expect(table?.group).toBe("League phase");
    expect(table?.table).toHaveLength(36);
  });

  it("parses world cup standings with form", () => {
    const result = standingsResponseSchema.parse(standingsWc);
    expect(result.standings).toHaveLength(3);
    expect(result.standings[0]?.table[0]?.form).toBe("W,W,W");
  });

  it("parses matches including one without score", () => {
    const { matches } = matchesResponseSchema.parse(matchesBsa);
    expect(matches).toHaveLength(10);
    const unplayed = matches.find((m) => m.score.fullTime.home === null);
    expect(unplayed?.score.winner).toBeNull();
  });

  it("parses team matches across competitions", () => {
    expect(matchesResponseSchema.parse(teamMatches).matches).toHaveLength(20);
  });

  it("accepts unknown match statuses", () => {
    expect(
      matchSchema.parse({ ...firstMatch, status: "POSTPONED" }).status,
    ).toBe("POSTPONED");
  });

  it("accepts knockout matches without defined teams", () => {
    const undefinedTeam = {
      id: null,
      name: null,
      shortName: null,
      tla: null,
      crest: null,
    };
    const result = matchSchema.parse({
      ...firstMatch,
      homeTeam: undefinedTeam,
    });
    expect(result.homeTeam.name).toBeNull();
  });

  it("accepts matches from competitions without emblem", () => {
    const result = matchSchema.parse({
      ...firstMatch,
      competition: { ...firstMatch?.competition, emblem: null },
    });
    expect(result.competition.emblem).toBeNull();
  });

  it("accepts teams without short name, tla or crest", () => {
    const row = standingsBsa.standings[0]?.table[0];
    const result = standingRowSchema.parse({
      ...row,
      team: { ...row?.team, shortName: null, tla: null, crest: null },
    });
    expect(result.team.crest).toBeNull();
  });

  it("parses scorers with nullable assists and penalties", () => {
    const { scorers } = scorersResponseSchema.parse(scorersBsa);
    expect(scorers).toHaveLength(20);
    expect(scorers[0]?.player.name).toBe("Kevin Viveros");
    expect(scorers[0]?.goals).toBe(21);
  });

  it("parses competition teams", () => {
    expect(competitionTeamsResponseSchema.parse(teamsBsa).teams).toHaveLength(
      20,
    );
  });

  it("parses team detail with squad and coach", () => {
    const team = teamSchema.parse(teamDetail);
    expect(team.name).toBe("Fluminense FC");
    expect(team.coach?.name).toBe("Marcão");
    expect(team.squad).toHaveLength(35);
  });

  it("strips fields the project does not use", () => {
    expect(matchSchema.parse(firstMatch)).not.toHaveProperty("odds");
  });

  it("parses cup matches with cancelled and penalty games", () => {
    const { matches } = matchesResponseSchema.parse(matchesCli);
    expect(matches).toHaveLength(156);
    const shootout = matches.find(
      (m) => m.score.duration === "PENALTY_SHOOTOUT",
    );
    expect(shootout?.score.penalties).toEqual({ home: 5, away: 3 });
    expect(shootout?.score.regularTime).toEqual({ home: 1, away: 0 });
  });

  it("parses libertadores standings without groups", () => {
    const { standings } = standingsResponseSchema.parse(standingsCli);
    expect(standings).toHaveLength(3);
    expect(standings[0]?.table).toHaveLength(32);
    expect(standings[0]?.group).toBeNull();
  });

  it("parses a full league season", () => {
    expect(matchesResponseSchema.parse(matchesBsaSeason).matches).toHaveLength(
      380,
    );
  });
});
