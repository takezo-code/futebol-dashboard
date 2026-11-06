import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "./site-footer";

describe("SiteFooter", () => {
  it("shows the portfolio disclaimer", () => {
    render(<SiteFooter />);
    expect(
      screen.getByText(
        "Projeto de portfólio sem fins comerciais. Dados fornecidos por football-data.org.",
      ),
    ).toBeInTheDocument();
  });

  it("links to the author profiles", () => {
    render(<SiteFooter />);
    expect(
      screen.getByRole("link", { name: "Código no GitHub" }),
    ).toHaveAttribute(
      "href",
      "https://github.com/takezo-code/painel-da-bola",
    );
    expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/thales-ribeiro-27149a34b/",
    );
  });
});
