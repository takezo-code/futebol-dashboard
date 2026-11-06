import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { favoritesStore, useFavorites } from "./use-favorites";

const flamengo = { id: 1783, name: "Flamengo", crest: null };

function Toggle() {
  const { toggle } = useFavorites();
  return (
    <button type="button" onClick={() => toggle(flamengo)}>
      alternar
    </button>
  );
}

function Count() {
  const { favorites, isFavorite } = useFavorites();
  return (
    <p>
      {favorites.length} {isFavorite(flamengo.id) ? "sim" : "não"}
    </p>
  );
}

describe("useFavorites", () => {
  beforeEach(() => {
    window.localStorage.clear();
    favoritesStore?.reloadFromStorage();
  });

  it("keeps every component in sync", () => {
    render(
      <>
        <Toggle />
        <Count />
        <Count />
      </>,
    );
    expect(screen.getAllByText("0 não")).toHaveLength(2);
    fireEvent.click(screen.getByRole("button", { name: "alternar" }));
    expect(screen.getAllByText("1 sim")).toHaveLength(2);
    fireEvent.click(screen.getByRole("button", { name: "alternar" }));
    expect(screen.getAllByText("0 não")).toHaveLength(2);
  });
});
