import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SiteHeader } from "./site-header";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));
vi.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: "light", setTheme: vi.fn() }),
}));

describe("SiteHeader", () => {
  it("links to every club competition and nothing else", () => {
    render(<SiteHeader />);
    expect(
      screen.getByRole("link", { name: "Copa Libertadores" }),
    ).toHaveAttribute("href", "/competicoes/CLI");
    expect(
      screen
        .getAllByRole("link", { name: /./ })
        .map((a) => a.getAttribute("href")),
    ).not.toContain("/competicoes/WC");
  });

  it("has a home link and a theme toggle", () => {
    render(<SiteHeader />);
    expect(
      screen.getByRole("link", { name: "Futebol Dashboard" }),
    ).toHaveAttribute("href", "/");
    expect(
      screen.getByRole("button", { name: "Alternar tema" }),
    ).toBeInTheDocument();
  });
});
