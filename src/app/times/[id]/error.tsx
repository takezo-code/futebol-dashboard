"use client";

import { ErrorState } from "@/components/ui/error-state";

export default function TeamError({ reset }: { reset: () => void }) {
  return (
    <ErrorState title="Não foi possível carregar este time." reset={reset} />
  );
}
