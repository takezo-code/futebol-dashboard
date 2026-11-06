"use client";

import Link from "next/link";
import { useFavorites } from "@/hooks/use-favorites";
import { useHydrated } from "@/hooks/use-hydrated";
import { Skeleton } from "@/components/ui/skeleton";
import { FavoriteCard } from "./favorite-card";

export function FavoritesList() {
  const hydrated = useHydrated();
  const { favorites, isPersistent } = useFavorites();

  if (!hydrated) {
    return (
      <div className="grid gap-4 md:grid-cols-2" aria-busy="true">
        <span className="sr-only">Carregando</span>
        <Skeleton className="h-72" />
        <Skeleton className="h-72" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {isPersistent ? null : (
        <p
          role="status"
          className="border-border bg-surface rounded-lg border p-4 text-sm"
        >
          Não foi possível salvar seus favoritos neste navegador. Eles ficam
          disponíveis só enquanto esta aba estiver aberta.
        </p>
      )}
      {favorites.length === 0 ? (
        <section className="border-border bg-surface flex flex-col items-start gap-3 rounded-lg border p-6">
          <h2 className="font-display text-2xl font-semibold">
            Você ainda não tem times favoritos
          </h2>
          <p className="text-muted">
            Toque na estrela ao lado de um time, na classificação ou na página
            do time, para acompanhá-lo aqui.
          </p>
          <Link
            href="/"
            className="text-brand font-medium underline underline-offset-4"
          >
            Ver competições
          </Link>
        </section>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {favorites.map((team) => (
            <FavoriteCard key={team.id} team={team} />
          ))}
        </div>
      )}
    </div>
  );
}
