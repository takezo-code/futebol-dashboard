import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import competitions from "@/lib/football-api/__fixtures__/competitions.json";
import { competitionsResponseSchema } from "@/lib/football-api/schemas";
import { COMPETITIONS } from "@/lib/competitions";
import { CompetitionCard } from "./competition-card";

const bsa = competitionsResponseSchema
  .parse(competitions)
  .competitions.find((c) => c.code === "BSA");

describe("CompetitionCard", () => {
  it("shows the competition in portuguese with season and link", () => {
    if (!bsa) {
      throw new Error("fixture without BSA");
    }
    render(<CompetitionCard competition={bsa} config={COMPETITIONS.BSA} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/competicoes/BSA");
    expect(link).toHaveTextContent("Brasileirão Série A");
    expect(link).toHaveTextContent("Brasil");
    expect(link).toHaveTextContent("Temporada 2026");
  });
});
