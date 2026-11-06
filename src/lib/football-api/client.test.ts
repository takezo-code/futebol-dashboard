import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import error400 from "./__fixtures__/error-400.json";
import error404 from "./__fixtures__/error-404.json";
import { apiFetch } from "./client";
import { ApiError, NotFoundError, RateLimitError } from "./errors";

const schema = z.object({ ok: z.boolean() });
const fetchMock = vi.fn<typeof fetch>();

function jsonResponse(
  body: unknown,
  status = 200,
  headers: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(body), { status, headers });
}

async function captureError(promise: Promise<unknown>): Promise<unknown> {
  try {
    await promise;
  } catch (error) {
    return error;
  }
  throw new Error("Expected promise to reject");
}

describe("apiFetch", () => {
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

  it("sends the token header and cache options", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ ok: true }));
    await apiFetch("/x", schema, { revalidate: 60, tags: ["t"] });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.football-data.org/v4/x",
      expect.objectContaining({
        headers: { "X-Auth-Token": "test-token" },
        next: { revalidate: 60, tags: ["t"] },
      }),
    );
  });

  it("returns parsed data on success", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ ok: true }));
    await expect(apiFetch("/x", schema, { revalidate: 60 })).resolves.toEqual({
      ok: true,
    });
  });

  it("throws RateLimitError with retry seconds on 429", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({}, 429, { "x-requestcounter-reset": "42" }),
    );
    const error = await captureError(
      apiFetch("/x", schema, { revalidate: 60 }),
    );
    expect(error).toBeInstanceOf(RateLimitError);
    expect(error).toMatchObject({ status: 429, retryAfterSeconds: 42 });
  });

  it("throws RateLimitError with null retry when header is missing", async () => {
    fetchMock.mockResolvedValue(jsonResponse({}, 429));
    const error = await captureError(
      apiFetch("/x", schema, { revalidate: 60 }),
    );
    expect(error).toBeInstanceOf(RateLimitError);
    expect(error).toMatchObject({ retryAfterSeconds: null });
  });

  it("throws NotFoundError on 404", async () => {
    fetchMock.mockResolvedValue(jsonResponse(error404, 404));
    const error = await captureError(
      apiFetch("/x", schema, { revalidate: 60 }),
    );
    expect(error).toBeInstanceOf(NotFoundError);
    expect(error).toBeInstanceOf(ApiError);
  });

  it("throws ApiError on other statuses", async () => {
    fetchMock.mockResolvedValue(jsonResponse(error400, 400));
    const error = await captureError(
      apiFetch("/x", schema, { revalidate: 60 }),
    );
    expect(error).toBeInstanceOf(ApiError);
    expect(error).not.toBeInstanceOf(NotFoundError);
    expect(error).toMatchObject({ status: 400 });
  });

  it("never includes the token in error messages", async () => {
    for (const status of [400, 404, 429]) {
      fetchMock.mockResolvedValueOnce(jsonResponse({}, status));
      const error = await captureError(
        apiFetch("/x", schema, { revalidate: 60 }),
      );
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).not.toContain("test-token");
    }
  });

  it("logs and rethrows when the body does not match the schema", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ ok: "yes" }));
    await expect(apiFetch("/x", schema, { revalidate: 60 })).rejects.toThrow();
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(vi.mocked(console.error).mock.calls[0]?.[1]).toMatchObject({
      path: "/x",
    });
  });

  it("warns when few requests remain", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ ok: true }, 200, { "x-requests-available-minute": "2" }),
    );
    await apiFetch("/x", schema, { revalidate: 60 });
    expect(console.warn).toHaveBeenCalledTimes(1);
    const message = String(vi.mocked(console.warn).mock.calls[0]?.[0]);
    expect(message).toContain("2");
    expect(message).toContain("/x");
  });

  it("does not warn when plenty remain or header is missing or invalid", async () => {
    for (const headers of [
      { "x-requests-available-minute": "9" } as Record<string, string>,
      {},
      { "x-requests-available-minute": "abc" },
    ]) {
      fetchMock.mockResolvedValueOnce(jsonResponse({ ok: true }, 200, headers));
      await apiFetch("/x", schema, { revalidate: 60 });
    }
    expect(console.warn).not.toHaveBeenCalled();
  });
});
