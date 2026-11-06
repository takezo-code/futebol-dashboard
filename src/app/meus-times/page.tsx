import type { Metadata } from "next";
import { FavoritesList } from "@/components/favorites/favorites-list";

export const metadata: Metadata = {
  title: "Meus times | Painel da Bola",
  description: "Último resultado e próximos jogos dos seus times favoritos.",
};

export default function MyTeamsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-4xl font-bold">Meus times</h1>
        <p className="text-muted mt-1">
          Último resultado e próximos jogos dos times que você favoritou.
        </p>
      </div>
      <FavoritesList />
    </div>
  );
}
