import { afterEach, describe, expect, it, vi } from "vitest";
import { getEnv } from "./env";

const MISSING_TOKEN_MESSAGE =
  "Variável de ambiente FOOTBALL_DATA_TOKEN ausente. Copie .env.example para .env.local e preencha o token.";

describe("getEnv", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns the token when it is set", () => {
    vi.stubEnv("FOOTBALL_DATA_TOKEN", "abc123");
    expect(getEnv()).toEqual({ FOOTBALL_DATA_TOKEN: "abc123" });
  });

  it("throws naming the variable when it is missing", () => {
    vi.stubEnv("FOOTBALL_DATA_TOKEN", undefined);
    expect(() => getEnv()).toThrow(/FOOTBALL_DATA_TOKEN/);
  });

  it("treats a blank token as missing", () => {
    vi.stubEnv("FOOTBALL_DATA_TOKEN", "   ");
    expect(() => getEnv()).toThrow(/FOOTBALL_DATA_TOKEN/);
  });

  it("throws a fixed guidance message without echoing input", () => {
    vi.stubEnv("FOOTBALL_DATA_TOKEN", " ");
    expect(() => getEnv()).toThrow(new Error(MISSING_TOKEN_MESSAGE));
  });
});
