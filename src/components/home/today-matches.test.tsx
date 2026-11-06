import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import todayMatches from "@/lib/football-api/__fixtures__/matches-today.json";
import { matchesResponseSchema } from "@/lib/football-api/schemas";
import { TodayMatches } from "./today-matches";

const matches = matchesResponseSchema.parse(todayMatches).matches;

describe("TodayMatches", () => {
  it("lists today's matches grouped by competition order", () => {
    render(<TodayMatches matches={matches} />);
    const strip = screen.getByRole("region", { name: "Jogos de hoje" });
    const items = within(strip).getAllByRole("listitem");
    expect(items).toHaveLength(10);
    expect(items[0]).toHaveTextContent("Brasileirão");
  });

  it("renders nothing without matches", () => {
    const { container } = render(<TodayMatches matches={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
