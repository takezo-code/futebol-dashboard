import { summarizeTeamMatches } from "@/lib/favorites/summary";
import { NotFoundError, RateLimitError } from "@/lib/football-api/errors";
import { getTeamMatches } from "@/lib/football-api/teams";
import { parseTeamId } from "@/lib/team-id";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: Request,
  context: RouteContext,
): Promise<Response> {
  const { id } = await context.params;
  const teamId = parseTeamId(id);
  if (teamId === null) {
    return Response.json({ error: "Time inválido" }, { status: 400 });
  }

  try {
    const matches = await getTeamMatches(teamId);
    return Response.json(summarizeTeamMatches(matches));
  } catch (error) {
    if (error instanceof RateLimitError) {
      return Response.json(
        { error: "rate_limit", retryAfterSeconds: error.retryAfterSeconds },
        { status: 429 },
      );
    }
    if (error instanceof NotFoundError) {
      return Response.json({ error: "not_found" }, { status: 404 });
    }
    return Response.json({ error: "upstream" }, { status: 502 });
  }
}
