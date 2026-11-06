import { describe, expect, it, vi } from "vitest";
import {
  FAVORITES_KEY,
  FAVORITES_LIMIT,
  createFavoritesStore,
  type FavoriteTeam,
} from "./store";

function memoryStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value);
    },
    data,
  };
}

function team(id: number): FavoriteTeam {
  return { id, name: `Time ${id}`, crest: null };
}

describe("createFavoritesStore", () => {
  it("adds, refuses duplicates and removes", () => {
    const storage = memoryStorage();
    const store = createFavoritesStore(storage);
    expect(store.add(team(1))).toBe("added");
    expect(store.add(team(1))).toBe("exists");
    expect(store.getSnapshot()).toEqual([team(1)]);
    expect(JSON.parse(storage.data.get(FAVORITES_KEY) ?? "[]")).toEqual([
      team(1),
    ]);
    store.remove(1);
    expect(store.getSnapshot()).toEqual([]);
  });

  it("respects the limit", () => {
    const store = createFavoritesStore(memoryStorage());
    for (let id = 1; id <= FAVORITES_LIMIT; id += 1) {
      expect(store.add(team(id))).toBe("added");
    }
    expect(store.add(team(99))).toBe("limit");
    expect(store.getSnapshot()).toHaveLength(FAVORITES_LIMIT);
  });

  it("reads saved favorites and ignores invalid data", () => {
    const valid = memoryStorage({ [FAVORITES_KEY]: JSON.stringify([team(7)]) });
    expect(createFavoritesStore(valid).getSnapshot()).toEqual([team(7)]);
    const broken = memoryStorage({ [FAVORITES_KEY]: "{not json" });
    const brokenStore = createFavoritesStore(broken);
    expect(brokenStore.getSnapshot()).toEqual([]);
    expect(brokenStore.isPersistent()).toBe(true);
    const wrong = memoryStorage({
      [FAVORITES_KEY]: JSON.stringify([{ foo: 1 }]),
    });
    const wrongStore = createFavoritesStore(wrong);
    expect(wrongStore.getSnapshot()).toEqual([]);
    expect(wrongStore.isPersistent()).toBe(true);
  });

  it("keeps working in memory when reading throws", () => {
    const store = createFavoritesStore({
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {},
    });
    expect(store.getSnapshot()).toEqual([]);
    expect(store.isPersistent()).toBe(false);
  });

  it("keeps working in memory when writing throws", () => {
    const store = createFavoritesStore({
      getItem: () => null,
      setItem: () => {
        throw new Error("quota");
      },
    });
    expect(store.add(team(1))).toBe("added");
    expect(store.getSnapshot()).toEqual([team(1)]);
    expect(store.isPersistent()).toBe(false);
  });

  it("works without storage at all", () => {
    const store = createFavoritesStore(null);
    expect(store.add(team(1))).toBe("added");
    expect(store.isPersistent()).toBe(false);
  });

  it("keeps the same snapshot until something changes and notifies", () => {
    const store = createFavoritesStore(memoryStorage());
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);
    const before = store.getSnapshot();
    expect(store.getSnapshot()).toBe(before);
    store.add(team(1));
    expect(store.getSnapshot()).not.toBe(before);
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
    store.remove(1);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("reloads changes made by another tab", () => {
    const storage = memoryStorage();
    const store = createFavoritesStore(storage);
    const listener = vi.fn();
    store.subscribe(listener);
    storage.setItem(FAVORITES_KEY, JSON.stringify([team(3)]));
    store.reloadFromStorage();
    expect(store.getSnapshot()).toEqual([team(3)]);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("listens to other tabs once, including clear()", () => {
    const storage = memoryStorage({
      [FAVORITES_KEY]: JSON.stringify([team(1)]),
    });
    const events = new EventTarget();
    const addSpy = vi.spyOn(events, "addEventListener");
    const removeSpy = vi.spyOn(events, "removeEventListener");
    const store = createFavoritesStore(storage, events);
    const listeners = [vi.fn(), vi.fn(), vi.fn()];
    const unsubscribers = listeners.map((listener) =>
      store.subscribe(listener),
    );
    expect(addSpy).toHaveBeenCalledTimes(1);

    storage.data.clear();
    events.dispatchEvent(Object.assign(new Event("storage"), { key: null }));
    expect(store.getSnapshot()).toEqual([]);
    listeners.forEach((listener) => expect(listener).toHaveBeenCalledTimes(1));

    events.dispatchEvent(Object.assign(new Event("storage"), { key: "other" }));
    listeners.forEach((listener) => expect(listener).toHaveBeenCalledTimes(1));

    unsubscribers.forEach((unsubscribe) => unsubscribe());
    expect(removeSpy).toHaveBeenCalledTimes(1);
  });

  it("does not notify when storage did not change", () => {
    const storage = memoryStorage({
      [FAVORITES_KEY]: JSON.stringify([team(1)]),
    });
    const store = createFavoritesStore(storage);
    const listener = vi.fn();
    store.subscribe(listener);
    const before = store.getSnapshot();
    store.reloadFromStorage();
    expect(listener).not.toHaveBeenCalled();
    expect(store.getSnapshot()).toBe(before);
  });
});
