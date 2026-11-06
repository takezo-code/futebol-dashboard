import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Crest } from "./crest";

describe("Crest", () => {
  it("shows the crest image with a descriptive alt", () => {
    render(
      <Crest
        src="https://crests.football-data.org/1783.png"
        name="Flamengo"
        size={24}
      />,
    );
    expect(
      screen.getByRole("img", { name: "Escudo do Flamengo" }),
    ).toBeInTheDocument();
  });

  it("shows initials when there is no crest", () => {
    render(<Crest src={null} name="Flamengo" size={24} />);
    expect(screen.getByText("FLA")).toBeInTheDocument();
  });

  it("shows initials when the image fails to load", () => {
    render(
      <Crest
        src="https://crests.football-data.org/broken.png"
        name="Santos"
        size={24}
      />,
    );
    fireEvent.error(screen.getByRole("img", { name: "Escudo do Santos" }));
    expect(screen.getByText("SAN")).toBeInTheDocument();
  });
});
