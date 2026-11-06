import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import scorersBsa from "@/lib/football-api/__fixtures__/scorers-bsa.json";
import { scorersResponseSchema } from "@/lib/football-api/schemas";
import { ScorersChart, topScorers } from "./scorers-chart";

const scorers = scorersResponseSchema.parse(scorersBsa).scorers;

describe("ScorersChart", () => {
  it("describes the leader for screen readers", () => {
    render(<ScorersChart scorers={scorers} />);
    expect(
      screen.getByRole("heading", { name: "Os 10 maiores artilheiros" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Kevin Viveros lidera com 21 gols" }),
    ).toBeInTheDocument();
  });

  it("titles the chart with the real count", () => {
    render(<ScorersChart scorers={scorers.slice(0, 3)} />);
    expect(
      screen.getByRole("heading", { name: "Os 3 maiores artilheiros" }),
    ).toBeInTheDocument();
  });

  it("renders nothing without scorers", () => {
    const { container } = render(<ScorersChart scorers={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("topScorers", () => {
  it("keeps the first ten as chart rows", () => {
    const rows = topScorers(scorers, 10);
    expect(rows).toHaveLength(10);
    expect(rows[0]).toEqual({
      name: "Kevin Viveros",
      team: "Paranaense",
      goals: 21,
    });
  });
});
