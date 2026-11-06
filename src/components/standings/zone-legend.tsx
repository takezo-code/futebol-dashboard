import type { Zone } from "@/lib/competitions";
import { ZONE_BAR_CLASS } from "./zone-styles";

export function ZoneLegend({ zones }: { zones: Zone[] }) {
  if (zones.length === 0) {
    return null;
  }
  return (
    <ul
      aria-label="Legenda das zonas"
      className="text-muted flex flex-wrap gap-x-5 gap-y-2 text-sm"
    >
      {zones.map((zone) => (
        <li
          key={`${zone.from}-${zone.label}`}
          className="flex items-center gap-2"
        >
          <span
            aria-hidden="true"
            className={`h-3 w-1 ${ZONE_BAR_CLASS[zone.tone]}`}
          />
          {zone.label}
        </li>
      ))}
    </ul>
  );
}
