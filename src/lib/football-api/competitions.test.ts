import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import competitionBsa from "./__fixtures__/competition-bsa.json";
import competitions from "./__fixtures__/competitions.json";
import matchesBsa from "./__fixtures__/matches-bsa-matchday.json";
import scorersBsa from "./__fixtures__/scorers-bsa.json";
import standingsBsa from "./__fixtures__/standings-bsa.json";
import teamsBsa from "./__fixtures__/teams-bsa.json";
import {
  getCompetition,
  getCompetitions,
  getCompetitionTeams,
  getMatches,
  getScorers,
  getStandings,
} from "./competitions";

const BASE_URL = "https://api.football-data.org/v4";
const fetchMock = vi.fn<typeof fetch>();

function respondWith(body: unknown): void {
  fetchMock.mockResolvedValue(new Response(JSON.stringify(body)));
}

function lastCall(): { url: string; revalidate: unknown } {
  const [url, init] = fetchMock.mock.lastCall ?? [];
  return { url: String(url), revalidate: init?.next?.revalidate };
}

describe("competition services", () => {
  beforeEach(() => {
    vi.stubEnv("FOOTBALL_DATA_TOKEN", "test-token");
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    fetchMock.mockReset();
  });

  it("getCompetitions lists every available competition", async () => {
    respondWith(competitions);
    const result = await getCompetitions();
    expect(lastCall()).toEqual({
      url: `${BASE_URL}/competitions`,
      revalidate: 86400,
    });
    expect(result).toHaveLength(13);
  });

  it("getCompetition fetches one competition", async () => {
    respondWith(competitionBsa);
    const result = await getCompetition("BSA");
    expect(lastCall()).toEqual({
      url: `${BASE_URL}/competitions/BSA`,
      revalidate: 86400,
    });
    expect(result.name).toBe("Campeonato Brasileiro Série A");
  });

  it("getStandings fetches the table", async () => {
    respondWith(standingsBsa);
    const result = await getStandings("BSA");
    expect(lastCall()).toEqual({
      url: `${BASE_URL}/competitions/BSA/standings`,
      revalidate: 3600,
    });
    expect(result.standings[0]?.table[0]?.team.shortName).toBe("Flamengo");
  });

  it("getMatches filters by matchday", async () => {
    respondWith(matchesBsa);
    const result = await getMatches("BSA", 34);
    expect(lastCall()).toEqual({
      url: `${BASE_URL}/competitions/BSA/matches?matchday=34`,
      revalidate: 600,
    });
    expect(result).toHaveLength(10);
  });

  it("getMatches without matchday has no query string", async () => {
    respondWith(matchesBsa);
    await getMatches("BSA");
    expect(lastCall().url).toBe(`${BASE_URL}/competitions/BSA/matches`);
  });

  it("getScorers asks for 20 scorers by default", async () => {
    respondWith(scorersBsa);
    const result = await getScorers("BSA");
    expect(lastCall()).toEqual({
      url: `${BASE_URL}/competitions/BSA/scorers?limit=20`,
      revalidate: 3600,
    });
    expect(result).toHaveLength(20);
  });

  it("getCompetitionTeams lists the teams", async () => {
    respondWith(teamsBsa);
    const result = await getCompetitionTeams("BSA");
    expect(lastCall()).toEqual({
      url: `${BASE_URL}/competitions/BSA/teams`,
      revalidate: 86400,
    });
    expect(result).toHaveLength(20);
  });

  it("encodes the competition code", async () => {
    respondWith(standingsBsa);
    await getStandings("A/B?c");
    expect(lastCall().url).toBe(`${BASE_URL}/competitions/A%2FB%3Fc/standings`);
  });
});
