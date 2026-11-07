import { describe, expect, it } from "vitest";
import nextConfig from "./next.config";

async function headersFor(source: string): Promise<Map<string, string>> {
  const rules = (await nextConfig.headers?.()) ?? [];
  const rule = rules.find((item) => item.source === source);
  return new Map(rule?.headers.map((header) => [header.key, header.value]));
}

describe("next.config security", () => {
  it("does not advertise the framework", () => {
    expect(nextConfig.poweredByHeader).toBe(false);
  });

  it("sends security headers on every route", async () => {
    const headers = await headersFor("/(.*)");
    expect(headers.get("X-Frame-Options")).toBe("DENY");
    expect(headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(headers.get("Referrer-Policy")).toBe(
      "strict-origin-when-cross-origin",
    );
    expect(headers.get("Permissions-Policy")).toBe(
      "camera=(), microphone=(), geolocation=(), browsing-topics=()",
    );
  });

  it("restricts where scripts, images and frames can come from", async () => {
    const csp = (await headersFor("/(.*)")).get("Content-Security-Policy");
    expect(csp).toBeDefined();
    const directives = new Map(
      (csp ?? "").split(";").map((part) => {
        const [name = "", ...values] = part.trim().split(/\s+/);
        return [name, values.join(" ")];
      }),
    );
    expect(directives.get("default-src")).toBe("'self'");
    expect(directives.get("img-src")).toBe(
      "'self' data: https://crests.football-data.org",
    );
    expect(directives.get("connect-src")).toBe("'self'");
    expect(directives.get("frame-ancestors")).toBe("'none'");
    expect(directives.get("object-src")).toBe("'none'");
    expect(directives.get("base-uri")).toBe("'self'");
    expect(directives.get("form-action")).toBe("'self'");
    expect(directives.get("script-src")).not.toContain("'unsafe-eval'");
  });
});
