"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import {
  FAVORITES_KEY,
  FAVORITES_LIMIT,
  createFavoritesStore,
  type FavoriteTeam,
  type FavoritesStore,
} from "@/lib/favorites/store";

function browserStorage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export const favoritesStore: FavoritesStore | null =
  typeof window === "undefined" ? null : createFavoritesStore(browserStorage());

const EMPTY: FavoriteTeam[] = [];
const noop = () => () => {};

export type UseFavorites = {
  favorites: FavoriteTeam[];
  isFavorite(id: number): boolean;
  toggle(team: FavoriteTeam): "added" | "removed" | "limit";
  isPersistent: boolean;
  isFull: boolean;
};

export function useFavorites(): UseFavorites {
  const favorites = useSyncExternalStore(
    favoritesStore?.subscribe ?? noop,
    favoritesStore?.getSnapshot ?? (() => EMPTY),
    () => EMPTY,
  );

  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key === FAVORITES_KEY) {
        favoritesStore?.reloadFromStorage();
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const isFavorite = useCallback(
    (id: number) => favorites.some((favorite) => favorite.id === id),
    [favorites],
  );

  const toggle = useCallback(
    (team: FavoriteTeam): "added" | "removed" | "limit" => {
      if (!favoritesStore) {
        return "limit";
      }
      if (
        favoritesStore.getSnapshot().some((favorite) => favorite.id === team.id)
      ) {
        favoritesStore.remove(team.id);
        return "removed";
      }
      return favoritesStore.add(team) === "limit" ? "limit" : "added";
    },
    [],
  );

  return {
    favorites,
    isFavorite,
    toggle,
    isPersistent: favoritesStore?.isPersistent() ?? true,
    isFull: favorites.length >= FAVORITES_LIMIT,
  };
}
