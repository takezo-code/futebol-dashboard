const TIME_ZONE = "America/Sao_Paulo";

const weekdayFormatter = new Intl.DateTimeFormat("pt-BR", {
  timeZone: TIME_ZONE,
  weekday: "short",
});

const dayMonthFormatter = new Intl.DateTimeFormat("pt-BR", {
  timeZone: TIME_ZONE,
  day: "2-digit",
  month: "2-digit",
});

const timeFormatter = new Intl.DateTimeFormat("pt-BR", {
  timeZone: TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

const STATUS_LABELS: Record<string, string> = {
  SCHEDULED: "Agendado",
  TIMED: "Agendado",
  IN_PLAY: "Em andamento",
  PAUSED: "Em andamento",
  FINISHED: "Finalizado",
  AWARDED: "Finalizado",
  POSTPONED: "Adiado",
  SUSPENDED: "Suspenso",
  CANCELLED: "Cancelado",
};

export function formatMatchTime(utcDate: string): string {
  return timeFormatter.format(new Date(utcDate));
}

export function formatMatchDate(utcDate: string): string {
  const date = new Date(utcDate);
  return `${weekdayFormatter.format(date)}, ${dayMonthFormatter.format(date)} · ${timeFormatter.format(date)}`;
}

export function matchStatusLabel(status: string): string {
  return STATUS_LABELS[status] ?? "A confirmar";
}

export function formatGoalDifference(value: number): string {
  if (value > 0) {
    return `+${value}`;
  }
  if (value < 0) {
    return `−${Math.abs(value)}`;
  }
  return "0";
}

export function seasonLabel(startDate: string, endDate: string): string {
  const startYear = startDate.slice(0, 4);
  const endYear = endDate.slice(0, 4);
  return startYear === endYear ? startYear : `${startYear}/${endYear.slice(2)}`;
}

const COLOR_NAMES: Record<string, string> = {
  red: "Vermelho",
  white: "Branco",
  black: "Preto",
  green: "Verde",
  blue: "Azul",
  "navy blue": "Azul-marinho",
  navy: "Azul-marinho",
  "sky blue": "Azul-celeste",
  "royal blue": "Azul-royal",
  yellow: "Amarelo",
  gold: "Dourado",
  orange: "Laranja",
  maroon: "Grená",
  claret: "Grená",
  purple: "Roxo",
  grey: "Cinza",
  gray: "Cinza",
  silver: "Prata",
  brown: "Marrom",
  pink: "Rosa",
};

export function translateClubColors(value: string | null): string | null {
  if (value === null) {
    return null;
  }
  const colors = value
    .split("/")
    .map((color) => color.trim())
    .filter((color) => color.length > 0)
    .map((color) => COLOR_NAMES[color.toLowerCase()] ?? color);
  if (colors.length <= 1) {
    return colors[0] ?? null;
  }
  return `${colors.slice(0, -1).join(", ")} e ${colors.at(-1)}`;
}
