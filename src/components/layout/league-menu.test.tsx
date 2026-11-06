import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LeagueMenu } from "./league-menu";

vi.mock("next/navigation", () => ({
  usePathname: () => "/competicoes/BSA/jogos",
}));

describe("LeagueMenu", () => {
  it("marks the current league", () => {
    render(<LeagueMenu />);
    expect(
      screen.getByRole("link", { name: "Brasileirão Série A" }),
    ).toHaveAttribute("aria-current", "page");
    expect(
      screen.getByRole("link", { name: "Premier League" }),
    ).not.toHaveAttribute("aria-current");
  });

  it("closes with Escape", () => {
    const { container } = render(<LeagueMenu />);
    const details = container.querySelector("details");
    if (!details) {
      throw new Error("no menu");
    }
    details.open = true;
    fireEvent.keyDown(details, { key: "Escape" });
    expect(details.open).toBe(false);
  });
});
