import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import teamDetail from "./__fixtures__/team-detail.json";
import teamMatches from "./__fixtures__/team-matches.json";
import { getTeam, getTeamMatches } from "./teams";

const BASE_URL = "https://api.football-data.org/v4";
const fetchMock = vi.fn<typeof fetch>();

function respondWith(body: unknown): void {
  fetchMock.mockResolvedValue(new Response(JSON.stringify(body)));
}

function lastCall(): { url: string; revalidate: unknown } {
  const [url, init] = fetchMock.mock.lastCall ?? [];
  return { url: String(url), revalidate: init?.next?.revalidate };
}

describe("team services", () => {
  beforeEach(() => {
    vi.stubEnv("FOOTBALL_DATA_TOKEN", "test-token");
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    fetchMock.mockReset();
  });

  it("getTeam fetches the team profile", async () => {
    respondWith(teamDetail);
    const result = await getTeam(1765);
    expect(lastCall()).toEqual({
      url: `${BASE_URL}/teams/1765`,
      revalidate: 86400,
    });
    expect(result.name).toBe("Fluminense FC");
  });

  it("getTeamMatches fetches the season matches", async () => {
    respondWith(teamMatches);
    const result = await getTeamMatches(1765);
    expect(lastCall()).toEqual({
      url: `${BASE_URL}/teams/1765/matches`,
      revalidate: 600,
    });
    expect(result).toHaveLength(20);
  });
});
