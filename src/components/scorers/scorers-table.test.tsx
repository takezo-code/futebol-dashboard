import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import scorersBsa from "@/lib/football-api/__fixtures__/scorers-bsa.json";
import { scorersResponseSchema } from "@/lib/football-api/schemas";
import { ScorersTable } from "./scorers-table";

const scorers = scorersResponseSchema.parse(scorersBsa).scorers;

describe("ScorersTable", () => {
  it("lists the top scorers with goals", () => {
    render(<ScorersTable scorers={scorers} />);
    const rows = screen.getAllByRole("row").slice(1);
    expect(rows).toHaveLength(20);
    const first = rows[0];
    if (!first) {
      throw new Error("no rows");
    }
    expect(within(first).getByText("Kevin Viveros")).toBeInTheDocument();
    expect(within(first).getByText("21")).toBeInTheDocument();
  });

  it("shows a dash when assists are missing", () => {
    const withoutAssists = scorers.filter((s) => s.assists === null);
    render(<ScorersTable scorers={withoutAssists} />);
    const row = screen.getAllByRole("row")[1];
    if (!row) {
      throw new Error("no rows");
    }
    expect(within(row).getAllByText("–").length).toBeGreaterThan(0);
  });

  it("explains when there are no scorers yet", () => {
    render(<ScorersTable scorers={[]} />);
    expect(
      screen.getByText("A artilharia ainda não foi divulgada."),
    ).toBeInTheDocument();
  });
});
