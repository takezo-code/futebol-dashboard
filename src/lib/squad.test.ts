import { describe, expect, it } from "vitest";
import teamDetail from "@/lib/football-api/__fixtures__/team-detail.json";
import { teamSchema } from "@/lib/football-api/schemas";
import type { SquadPlayer } from "@/lib/football-api/types";
import { groupSquad } from "./squad";

const squad = teamSchema.parse(teamDetail).squad;

function player(name: string, position: string | null): SquadPlayer {
  return {
    id: name.length,
    name,
    position,
    dateOfBirth: null,
    nationality: null,
  };
}

describe("groupSquad", () => {
  it("groups a real squad in field order", () => {
    const groups = groupSquad(squad);
    expect(groups.map((g) => g.label)).toEqual([
      "Goleiros",
      "Defensores",
      "Meias",
      "Atacantes",
    ]);
    expect(groups.reduce((sum, g) => sum + g.players.length, 0)).toBe(35);
  });

  it("maps detailed and missing positions", () => {
    const groups = groupSquad([
      player("Zé", "Centre-Back"),
      player("Ana", "Left Winger"),
      player("Bia", "Defensive Midfield"),
      player("Caio", null),
      player("Davi", "Coach"),
    ]);
    const labelOf = (name: string) =>
      groups.find((g) => g.players.some((p) => p.name === name))?.label;
    expect(labelOf("Zé")).toBe("Defensores");
    expect(labelOf("Ana")).toBe("Atacantes");
    expect(labelOf("Bia")).toBe("Meias");
    expect(labelOf("Caio")).toBe("Outros");
    expect(labelOf("Davi")).toBe("Outros");
  });

  it("sorts players by name and omits empty groups", () => {
    const groups = groupSquad([
      player("Pedro", "Offence"),
      player("Bruno", "Offence"),
    ]);
    expect(groups).toHaveLength(1);
    expect(groups[0]?.players.map((p) => p.name)).toEqual(["Bruno", "Pedro"]);
  });
});
