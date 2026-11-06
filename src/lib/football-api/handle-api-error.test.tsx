import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ApiError, NotFoundError, RateLimitError } from "./errors";
import { handleApiError } from "./handle-api-error";

const notFound = vi.fn(() => {
  throw new Error("NEXT_NOT_FOUND");
});

vi.mock("next/navigation", () => ({
  notFound: () => notFound(),
  useRouter: () => ({ refresh: vi.fn() }),
}));

describe("handleApiError", () => {
  it("renders the rate limit notice for 429", () => {
    render(handleApiError(new RateLimitError("/x", 30)));
    expect(
      screen.getByText(
        "Muitas consultas em pouco tempo. Tente de novo em 1 minuto.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Tentar de novo" }),
    ).toBeInTheDocument();
  });

  it("calls notFound for 404", () => {
    expect(() => handleApiError(new NotFoundError("/x"))).toThrow(
      "NEXT_NOT_FOUND",
    );
  });

  it("rethrows other errors", () => {
    const error = new ApiError(500, "/x");
    expect(() => handleApiError(error)).toThrow(error);
  });
});
