import { render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import teamMatches from "@/lib/football-api/__fixtures__/team-matches.json";
import { matchesResponseSchema } from "@/lib/football-api/schemas";
import { favoritesStore } from "@/hooks/use-favorites";
import { FAVORITES_KEY } from "@/lib/favorites/store";
import { summarizeTeamMatches } from "@/lib/favorites/summary";
import { SiteHeader } from "@/components/layout/site-header";
import { FavoritesList } from "./favorites-list";

vi.mock("next/navigation", () => ({ usePathname: () => "/meus-times" }));
vi.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: "light", setTheme: vi.fn() }),
}));

const summary = summarizeTeamMatches(
  matchesResponseSchema.parse(teamMatches).matches,
);
const fetchMock = vi.fn<typeof fetch>();

function saveFavorites(ids: number[]) {
  window.localStorage.setItem(
    FAVORITES_KEY,
    JSON.stringify(ids.map((id) => ({ id, name: `Time ${id}`, crest: null }))),
  );
  favoritesStore?.reloadFromStorage();
}

describe("FavoritesList", () => {
  beforeEach(() => {
    window.localStorage.clear();
    favoritesStore?.reloadFromStorage();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    fetchMock.mockReset();
  });

  it("explains how to add favorites when empty", () => {
    render(<FavoritesList />);
    expect(
      screen.getByRole("heading", {
        name: "Você ainda não tem times favoritos",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Ver competições" }),
    ).toHaveAttribute("href", "/");
  });

  it("shows one card per favorite with its matches", async () => {
    saveFavorites([1765, 1783]);
    fetchMock.mockImplementation(
      async () => new Response(JSON.stringify(summary)),
    );
    render(<FavoritesList />);
    const cards = await screen.findAllByRole("region");
    expect(cards).toHaveLength(2);
    expect(
      await within(cards[0] as HTMLElement).findByText("Último resultado"),
    ).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/teams/1765/matches",
      expect.anything(),
    );
  });

  it("keeps other cards working when one hits the rate limit", async () => {
    saveFavorites([1765, 1783]);
    fetchMock.mockImplementation(async (input) =>
      String(input).includes("1765")
        ? new Response(JSON.stringify({ error: "rate_limit" }), {
            status: 429,
          })
        : new Response(JSON.stringify(summary)),
    );
    render(<FavoritesList />);
    expect(
      await screen.findByText(
        "Muitas consultas em pouco tempo. Tente de novo em 1 minuto.",
      ),
    ).toBeInTheDocument();
    expect(await screen.findByText("Último resultado")).toBeInTheDocument();
  });
});

describe("SiteHeader", () => {
  it("links to my teams", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("link", { name: "Meus times" })).toHaveAttribute(
      "href",
      "/meus-times",
    );
  });
});
