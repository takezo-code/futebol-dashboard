import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

const BASE_URL = "https://api.football-data.org/v4";
const OUTPUT_DIR = path.join(
  import.meta.dirname,
  "..",
  "src",
  "lib",
  "football-api",
  "__fixtures__",
);
const DELAY_MS = 7000;
const MISSING_TEAM_ID = 99999;
const OUT_OF_RANGE_TEAM_ID = 999999999;
const WORLD_CUP_SEASON = 2026;

function readToken(): string {
  const value = process.env.FOOTBALL_DATA_TOKEN?.trim();
  if (!value) {
    console.error(
      "FOOTBALL_DATA_TOKEN ausente. Copie .env.example para .env.local e preencha o token.",
    );
    process.exit(1);
  }
  return value;
}

const token = readToken();

const competitionSchema = z.object({
  currentSeason: z.object({ currentMatchday: z.number().nullable() }),
});
const firstMatchSchema = z.object({
  matches: z.array(z.object({ id: z.number() })).min(1),
});
const firstTeamSchema = z.object({
  teams: z.array(z.object({ id: z.number() })).min(1),
});

let isFirstCall = true;

async function call(
  apiPath: string,
  expectedStatus = 200,
): Promise<{ body: unknown; headers: Headers }> {
  if (!isFirstCall) {
    await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
  }
  isFirstCall = false;

  const res = await fetch(`${BASE_URL}${apiPath}`, {
    headers: { "X-Auth-Token": token },
  });
  console.log(`${res.status} ${apiPath}`);
  if (res.status !== expectedStatus) {
    throw new Error(`Status inesperado ${res.status} em ${apiPath}`);
  }
  return { body: await res.json(), headers: res.headers };
}

async function save(fileName: string, data: unknown): Promise<void> {
  await writeFile(
    path.join(OUTPUT_DIR, fileName),
    `${JSON.stringify(data, null, 2)}\n`,
  );
}

function rateLimitHeaders(headers: Headers): Record<string, string> {
  const result: Record<string, string> = {};
  headers.forEach((value, name) => {
    if (name.toLowerCase().includes("request")) {
      result[name] = value;
    }
  });
  return result;
}

await mkdir(OUTPUT_DIR, { recursive: true });

const competition = await call("/competitions/BSA");
await save("competition-bsa.json", competition.body);
await save("headers.json", rateLimitHeaders(competition.headers));

const matchday =
  competitionSchema.parse(competition.body).currentSeason.currentMatchday ?? 1;

const standings = await call("/competitions/BSA/standings");
await save("standings-bsa.json", standings.body);

const matches = await call(`/competitions/BSA/matches?matchday=${matchday}`);
await save("matches-bsa-matchday.json", matches.body);

const matchId = firstMatchSchema.parse(matches.body).matches[0]?.id;
const match = await call(`/matches/${matchId}`);
await save("match-detail.json", match.body);

const scorers = await call("/competitions/BSA/scorers?limit=20");
await save("scorers-bsa.json", scorers.body);

const teams = await call("/competitions/BSA/teams");
await save("teams-bsa.json", teams.body);

const teamId = firstTeamSchema.parse(teams.body).teams[0]?.id;
const team = await call(`/teams/${teamId}`);
await save("team-detail.json", team.body);

const teamMatches = await call(`/teams/${teamId}/matches?limit=20`);
await save("team-matches.json", teamMatches.body);

const standingsCl = await call("/competitions/CL/standings");
await save("standings-cl.json", standingsCl.body);

const standingsWc = await call(
  `/competitions/WC/standings?season=${WORLD_CUP_SEASON}`,
);
await save("standings-wc.json", standingsWc.body);

const notFound = await call(`/teams/${MISSING_TEAM_ID}`, 404);
await save("error-404.json", notFound.body);

const badRequest = await call(`/teams/${OUT_OF_RANGE_TEAM_ID}`, 400);
await save("error-400.json", badRequest.body);

console.log(`Fixtures salvas em ${OUTPUT_DIR}`);
