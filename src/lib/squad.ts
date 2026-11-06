import type { SquadPlayer } from "@/lib/football-api/types";

export type SquadLabel =
  "Goleiros" | "Defensores" | "Meias" | "Atacantes" | "Outros";

export type SquadGroup = {
  label: SquadLabel;
  players: SquadPlayer[];
};

const ORDER: SquadLabel[] = [
  "Goleiros",
  "Defensores",
  "Meias",
  "Atacantes",
  "Outros",
];

function labelFor(position: string | null): SquadLabel {
  if (position === null) {
    return "Outros";
  }
  if (position === "Goalkeeper") {
    return "Goleiros";
  }
  if (/Midfield/.test(position)) {
    return "Meias";
  }
  if (/Defence|Defender|Back/.test(position)) {
    return "Defensores";
  }
  if (/Offence|Forward|Winger|Striker/.test(position)) {
    return "Atacantes";
  }
  return "Outros";
}

export function groupSquad(squad: SquadPlayer[]): SquadGroup[] {
  return ORDER.map((label) => ({
    label,
    players: squad
      .filter((player) => labelFor(player.position) === label)
      .sort((a, b) => a.name.localeCompare(b.name, "pt-BR")),
  })).filter((group) => group.players.length > 0);
}
