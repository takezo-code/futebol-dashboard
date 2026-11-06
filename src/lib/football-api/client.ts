import "server-only";
import type { z } from "zod";
import { getEnv } from "@/lib/env";
import { ApiError, NotFoundError, RateLimitError } from "./errors";

const BASE_URL = "https://api.football-data.org/v4";

export const CACHE = {
  COMPETITIONS: 86400,
  STANDINGS: 3600,
  MATCHES: 600,
  SCORERS: 3600,
  TEAMS: 86400,
  TEAM: 86400,
} as const;

export const RATE_LIMIT_WARNING_THRESHOLD = 2;

function readNumberHeader(headers: Headers, name: string): number | null {
  const raw = headers.get(name);
  if (raw === null || raw.trim() === "") {
    return null;
  }
  const value = Number(raw);
  return Number.isNaN(value) ? null : value;
}

export async function apiFetch<T>(
  path: string,
  schema: z.ZodType<T>,
  options: { revalidate: number; tags?: string[] },
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "X-Auth-Token": getEnv().FOOTBALL_DATA_TOKEN },
    next: { revalidate: options.revalidate, tags: options.tags },
  });

  const available = readNumberHeader(
    res.headers,
    "x-requests-available-minute",
  );
  if (available !== null && available <= RATE_LIMIT_WARNING_THRESHOLD) {
    console.warn(
      `Football API rate limit low: ${available} requests left this minute (${path})`,
    );
  }

  if (res.status === 429) {
    throw new RateLimitError(
      path,
      readNumberHeader(res.headers, "x-requestcounter-reset"),
    );
  }
  if (res.status === 404) {
    throw new NotFoundError(path);
  }
  if (!res.ok) {
    throw new ApiError(res.status, path);
  }

  const result = schema.safeParse(await res.json());
  if (!result.success) {
    console.error("Football API response did not match schema", {
      path,
      issues: result.error.issues,
    });
    throw result.error;
  }
  return result.data;
}
