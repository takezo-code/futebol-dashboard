import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ErrorState } from "./error-state";

const refresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh }),
}));

describe("ErrorState", () => {
  it("refetches from the server and resets the boundary on retry", () => {
    const reset = vi.fn();
    render(
      <ErrorState title="Não foi possível carregar os dados." reset={reset} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Tentar de novo" }));
    expect(refresh).toHaveBeenCalledTimes(1);
    expect(reset).toHaveBeenCalledTimes(1);
  });
});
