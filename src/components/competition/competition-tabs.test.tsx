import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CompetitionTabs, competitionMetadata } from "./competition-tabs";

describe("CompetitionTabs", () => {
  it("links the three sections and marks only the active one", () => {
    render(<CompetitionTabs code="BSA" active="matches" />);
    const standings = screen.getByRole("link", { name: "Classificação" });
    const matches = screen.getByRole("link", { name: "Jogos" });
    const scorers = screen.getByRole("link", { name: "Artilharia" });
    expect(standings).toHaveAttribute("href", "/competicoes/BSA");
    expect(matches).toHaveAttribute("href", "/competicoes/BSA/jogos");
    expect(scorers).toHaveAttribute("href", "/competicoes/BSA/artilharia");
    expect(matches).toHaveAttribute("aria-current", "page");
    expect(standings).not.toHaveAttribute("aria-current");
    expect(scorers).not.toHaveAttribute("aria-current");
  });
});

describe("competitionMetadata", () => {
  it("builds the page title from the tab and competition", () => {
    expect(competitionMetadata("BSA", "standings").title).toBe(
      "Classificação do Brasileirão Série A | Futebol Dashboard",
    );
    expect(competitionMetadata("CLI", "scorers").title).toBe(
      "Artilharia da Copa Libertadores | Futebol Dashboard",
    );
  });

  it("returns a generic title for unknown codes", () => {
    expect(competitionMetadata("WC", "matches").title).toBe(
      "Competição não encontrada | Futebol Dashboard",
    );
  });
});
