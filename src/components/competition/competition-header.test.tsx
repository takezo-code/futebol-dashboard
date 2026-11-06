import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import competitionBsa from "@/lib/football-api/__fixtures__/competition-bsa.json";
import { COMPETITIONS } from "@/lib/competitions";
import { competitionSchema } from "@/lib/football-api/schemas";
import { CompetitionHeader } from "./competition-header";

const competition = competitionSchema.parse(competitionBsa);

describe("CompetitionHeader", () => {
  it("shows the name, season and progress", () => {
    render(
      <CompetitionHeader
        competition={competition}
        config={COMPETITIONS.BSA}
        progress={{ label: "Rodada 34", detail: "de 38", percent: 89 }}
      />,
    );
    expect(
      screen.getByRole("heading", { level: 1, name: "Brasileirão Série A" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Temporada 2026")).toBeInTheDocument();
    expect(screen.getByText("Rodada 34")).toBeInTheDocument();
    expect(screen.getByText("de 38")).toBeInTheDocument();
    const bar = screen.getByRole("progressbar", {
      name: "Progresso da temporada",
    });
    expect(bar).toHaveAttribute("aria-valuenow", "89");
  });
});
