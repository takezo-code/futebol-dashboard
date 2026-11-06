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
});
