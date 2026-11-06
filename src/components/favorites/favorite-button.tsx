"use client";

import { useFavorites } from "@/hooks/use-favorites";
import { FAVORITES_LIMIT, type FavoriteTeam } from "@/lib/favorites/store";

type FavoriteButtonProps = {
  team: FavoriteTeam;
  size?: "sm" | "md";
};

export function FavoriteButton({ team, size = "md" }: FavoriteButtonProps) {
  const { isFavorite, toggle, isFull } = useFavorites();
  const active = isFavorite(team.id);
  const blocked = !active && isFull;
  const label = active
    ? `Remover ${team.name} dos favoritos`
    : `Adicionar ${team.name} aos favoritos`;
  const box = size === "sm" ? "size-7" : "size-10";
  const icon = size === "sm" ? "size-4" : "size-6";

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      aria-disabled={blocked || undefined}
      title={blocked ? `Limite de ${FAVORITES_LIMIT} times favoritos` : label}
      onClick={() => {
        if (!blocked) {
          toggle(team);
        }
      }}
      className={`${box} focus-visible:outline-brand inline-flex shrink-0 items-center justify-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 ${
        active ? "text-accent" : "text-muted hover:text-foreground"
      } ${blocked ? "cursor-not-allowed opacity-50" : ""}`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className={icon}
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      >
        <path d="m12 3.5 2.6 5.3 5.9.9-4.25 4.1 1 5.85L12 16.9l-5.25 2.75 1-5.85L3.5 9.7l5.9-.9L12 3.5Z" />
      </svg>
    </button>
  );
}
