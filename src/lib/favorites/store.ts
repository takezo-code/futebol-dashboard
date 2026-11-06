import { z } from "zod";

export const FAVORITES_KEY = "futebol-dashboard:favorites";
export const FAVORITES_LIMIT = 10;

export const favoriteTeamSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  crest: z.string().nullable(),
});

export type FavoriteTeam = z.infer<typeof favoriteTeamSchema>;

type FavoritesStorage = Pick<Storage, "getItem" | "setItem">;

export type FavoritesStore = {
  getSnapshot(): FavoriteTeam[];
  subscribe(listener: () => void): () => void;
  add(team: FavoriteTeam): "added" | "exists" | "limit";
  remove(id: number): void;
  isPersistent(): boolean;
  reloadFromStorage(): void;
};

const favoritesSchema = z.array(favoriteTeamSchema).max(FAVORITES_LIMIT);

export function createFavoritesStore(
  storage: FavoritesStorage | null,
): FavoritesStore {
  let persistent = storage !== null;
  const listeners = new Set<() => void>();

  function read(): FavoriteTeam[] {
    if (storage === null) {
      return [];
    }
    try {
      const raw = storage.getItem(FAVORITES_KEY);
      if (raw === null) {
        return [];
      }
      const parsed = favoritesSchema.safeParse(JSON.parse(raw));
      return parsed.success ? parsed.data : [];
    } catch {
      persistent = false;
      return [];
    }
  }

  let favorites = read();

  function commit(next: FavoriteTeam[]) {
    favorites = next;
    if (storage !== null) {
      try {
        storage.setItem(FAVORITES_KEY, JSON.stringify(next));
      } catch {
        persistent = false;
      }
    }
    listeners.forEach((listener) => listener());
  }

  return {
    getSnapshot: () => favorites,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    add(team) {
      if (favorites.some((favorite) => favorite.id === team.id)) {
        return "exists";
      }
      if (favorites.length >= FAVORITES_LIMIT) {
        return "limit";
      }
      commit([...favorites, team]);
      return "added";
    },
    remove(id) {
      if (favorites.some((favorite) => favorite.id === id)) {
        commit(favorites.filter((favorite) => favorite.id !== id));
      }
    },
    isPersistent: () => persistent,
    reloadFromStorage() {
      favorites = read();
      listeners.forEach((listener) => listener());
    },
  };
}
