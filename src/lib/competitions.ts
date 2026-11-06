export const COMPETITION_CODES = [
  "BSA",
  "CLI",
  "PL",
  "PD",
  "SA",
  "BL1",
  "FL1",
  "CL",
  "DED",
  "PPL",
  "ELC",
] as const;

export type CompetitionCode = (typeof COMPETITION_CODES)[number];

export type ZoneTone = "continental" | "secondary" | "relegation";

export type Zone = {
  from: number;
  to: number;
  label: string;
  tone: ZoneTone;
};

export type CompetitionConfig = {
  code: CompetitionCode;
  name: string;
  format: "league" | "cup";
  zones: Zone[];
};

function topFourLeague(relegationFrom: number, relegationTo: number): Zone[] {
  return [
    { from: 1, to: 4, label: "Champions League", tone: "continental" },
    { from: 5, to: 5, label: "Europa League", tone: "secondary" },
    {
      from: relegationFrom,
      to: relegationTo,
      label: "Rebaixamento",
      tone: "relegation",
    },
  ];
}

const topThreeLeague: Zone[] = [
  { from: 1, to: 3, label: "Champions League", tone: "continental" },
  { from: 4, to: 4, label: "Europa League", tone: "secondary" },
  { from: 17, to: 18, label: "Rebaixamento", tone: "relegation" },
];

export const COMPETITIONS: Record<CompetitionCode, CompetitionConfig> = {
  BSA: {
    code: "BSA",
    name: "Brasileirão Série A",
    format: "league",
    zones: [
      { from: 1, to: 4, label: "Libertadores", tone: "continental" },
      { from: 5, to: 6, label: "Pré-Libertadores", tone: "continental" },
      { from: 7, to: 12, label: "Sul-Americana", tone: "secondary" },
      { from: 17, to: 20, label: "Rebaixamento", tone: "relegation" },
    ],
  },
  CLI: {
    code: "CLI",
    name: "Copa Libertadores",
    format: "cup",
    zones: [
      { from: 1, to: 2, label: "Oitavas de final", tone: "continental" },
      { from: 3, to: 3, label: "Sul-Americana", tone: "secondary" },
    ],
  },
  PL: {
    code: "PL",
    name: "Premier League",
    format: "league",
    zones: topFourLeague(18, 20),
  },
  PD: {
    code: "PD",
    name: "La Liga",
    format: "league",
    zones: topFourLeague(18, 20),
  },
  SA: {
    code: "SA",
    name: "Serie A",
    format: "league",
    zones: topFourLeague(18, 20),
  },
  BL1: {
    code: "BL1",
    name: "Bundesliga",
    format: "league",
    zones: topFourLeague(17, 18),
  },
  FL1: {
    code: "FL1",
    name: "Ligue 1",
    format: "league",
    zones: topThreeLeague,
  },
  CL: {
    code: "CL",
    name: "Champions League",
    format: "cup",
    zones: [
      { from: 1, to: 8, label: "Oitavas de final", tone: "continental" },
      { from: 9, to: 24, label: "Playoff", tone: "secondary" },
    ],
  },
  DED: {
    code: "DED",
    name: "Eredivisie",
    format: "league",
    zones: topThreeLeague,
  },
  PPL: {
    code: "PPL",
    name: "Primeira Liga",
    format: "league",
    zones: topThreeLeague,
  },
  ELC: {
    code: "ELC",
    name: "Championship",
    format: "league",
    zones: [
      { from: 1, to: 2, label: "Acesso", tone: "continental" },
      { from: 3, to: 6, label: "Playoff de acesso", tone: "secondary" },
      { from: 22, to: 24, label: "Rebaixamento", tone: "relegation" },
    ],
  },
};

export function isCompetitionCode(value: string): value is CompetitionCode {
  return (COMPETITION_CODES as readonly string[]).includes(value);
}

export function getZone(
  config: CompetitionConfig,
  position: number,
): Zone | null {
  return (
    config.zones.find((zone) => position >= zone.from && position <= zone.to) ??
    null
  );
}
