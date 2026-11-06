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
type StorageEvents = Pick<
  EventTarget,
  "addEventListener" | "removeEventListener"
>;

export type FavoritesStore = {
  getSnapshot(): FavoriteTeam[];
  subscribe(listener: () => void): () => void;
  add(team: FavoriteTeam): "added" | "exists" | "limit";
  remove(id: number): void;
  isPersistent(): boolean;
  reloadFromStorage(): void;
};

const favoritesSchema = z.array(favoriteTeamSchema).max(FAVORITES_LIMIT);

function parseFavorites(raw: string | null): FavoriteTeam[] {
  if (raw === null) {
    return [];
  }
  try {
    const parsed = favoritesSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

export function createFavoritesStore(
  storage: FavoritesStorage | null,
  events: StorageEvents | null = null,
): FavoritesStore {
  let persistent = storage !== null;
  let lastRaw: string | null = null;
  const listeners = new Set<() => void>();

  function readRaw(): string | null {
    if (storage === null) {
      return null;
    }
    try {
      return storage.getItem(FAVORITES_KEY);
    } catch {
      persistent = false;
      return null;
    }
  }

  lastRaw = readRaw();
  let favorites = parseFavorites(lastRaw);

  function notify() {
    listeners.forEach((listener) => listener());
  }

  function commit(next: FavoriteTeam[]) {
    favorites = next;
    if (storage !== null) {
      const raw = JSON.stringify(next);
      try {
        storage.setItem(FAVORITES_KEY, raw);
        lastRaw = raw;
      } catch {
        persistent = false;
      }
    }
    notify();
  }

  function reloadFromStorage() {
    const raw = readRaw();
    if (raw === lastRaw) {
      return;
    }
    lastRaw = raw;
    favorites = parseFavorites(raw);
    notify();
  }

  function onStorage(event: Event) {
    const key = "key" in event ? event.key : undefined;
    if (key === null || key === FAVORITES_KEY) {
      reloadFromStorage();
    }
  }

  return {
    getSnapshot: () => favorites,
    subscribe(listener) {
      listeners.add(listener);
      if (listeners.size === 1) {
        events?.addEventListener("storage", onStorage);
      }
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) {
          events?.removeEventListener("storage", onStorage);
        }
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
    reloadFromStorage,
  };
}
