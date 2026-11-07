import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { COMPETITION_CODES, COMPETITIONS } from "@/lib/competitions";
import NotFound, { metadata } from "./not-found";

describe("NotFound", () => {
  it("explains that the page does not exist", () => {
    render(<NotFound />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Bola fora!" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Erro 404 · Página não encontrada")).toBeVisible();
  });

  it("offers a way back home", () => {
    render(<NotFound />);
    expect(
      screen.getByRole("link", { name: "Voltar para o início" }),
    ).toHaveAttribute("href", "/");
  });

  it("links to every competition", () => {
    render(<NotFound />);
    const nav = screen.getByRole("navigation", { name: "Competições" });
    const links = within(nav).getAllByRole("link");
    expect(links).toHaveLength(COMPETITION_CODES.length);
    for (const code of COMPETITION_CODES) {
      expect(
        within(nav).getByRole("link", { name: COMPETITIONS[code].name }),
      ).toHaveAttribute("href", `/competicoes/${code}`);
    }
  });

  it("hides the decorative scoreboard from screen readers", () => {
    const { container } = render(<NotFound />);
    const art = container.querySelector("[data-testid='pitch-404']");
    expect(art).toHaveAttribute("aria-hidden", "true");
  });

  it("has its own page title", () => {
    expect(metadata.title).toBe("Página não encontrada | Painel da Bola");
  });
});
