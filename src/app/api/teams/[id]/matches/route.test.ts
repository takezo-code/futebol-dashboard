import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import teamMatches from "@/lib/football-api/__fixtures__/team-matches.json";
import { GET } from "./route";

const fetchMock = vi.fn<typeof fetch>();

function call(id: string) {
  return GET(new Request(`http://localhost/api/teams/${id}/matches`), {
    params: Promise.resolve({ id }),
  });
}

function respond(
  body: unknown,
  status = 200,
  headers: Record<string, string> = {},
) {
  fetchMock.mockResolvedValue(
    new Response(JSON.stringify(body), { status, headers }),
  );
}

describe("GET /api/teams/[id]/matches", () => {
  beforeEach(() => {
    vi.stubEnv("FOOTBALL_DATA_TOKEN", "test-token");
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    fetchMock.mockReset();
  });

  it("rejects invalid ids without calling the api", async () => {
    const response = await call("abc");
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "Time inválido" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns the summary", async () => {
    respond(teamMatches);
    const response = await call("1765");
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.lastResult.status).toBe("FINISHED");
    expect(body.upcoming.length).toBeLessThanOrEqual(3);
  });

  it("passes the rate limit through", async () => {
    respond({}, 429, { "x-requestcounter-reset": "30" });
    const response = await call("1765");
    expect(response.status).toBe(429);
    expect(await response.json()).toEqual({
      error: "rate_limit",
      retryAfterSeconds: 30,
    });
  });

  it("maps not found and other errors", async () => {
    respond({}, 404);
    expect((await call("99999")).status).toBe(404);
    respond({}, 500);
    const response = await call("1765");
    expect(response.status).toBe(502);
    expect(await response.text()).not.toContain("test-token");
  });
});
