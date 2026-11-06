import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { favoritesStore } from "@/hooks/use-favorites";
import { FAVORITES_KEY, FAVORITES_LIMIT } from "@/lib/favorites/store";
import { FavoriteButton } from "./favorite-button";

const flamengo = { id: 1783, name: "Flamengo", crest: null };

describe("FavoriteButton", () => {
  beforeEach(() => {
    window.localStorage.clear();
    favoritesStore?.reloadFromStorage();
  });

  it("toggles the favorite with an accessible label", () => {
    render(<FavoriteButton team={flamengo} />);
    const button = screen.getByRole("button", {
      name: "Adicionar Flamengo aos favoritos",
    });
    expect(button).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(button);
    expect(
      screen.getByRole("button", { name: "Remover Flamengo dos favoritos" }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("refuses a new team when the list is full", () => {
    const full = Array.from({ length: FAVORITES_LIMIT }, (_, index) => ({
      id: index + 1,
      name: `Time ${index + 1}`,
      crest: null,
    }));
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(full));
    favoritesStore?.reloadFromStorage();
    render(<FavoriteButton team={flamengo} />);
    const button = screen.getByRole("button", {
      name: "Adicionar Flamengo aos favoritos",
    });
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(button).toHaveAttribute("title", "Limite de 10 times favoritos");
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(favoritesStore?.getSnapshot()).toHaveLength(FAVORITES_LIMIT);
  });
});
