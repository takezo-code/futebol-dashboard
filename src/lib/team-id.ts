export function parseTeamId(value: string): number | null {
  return /^[1-9]\d{0,8}$/.test(value) ? Number(value) : null;
}
