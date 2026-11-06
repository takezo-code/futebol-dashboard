"use client";

import { ErrorState } from "@/components/ui/error-state";

export default function CompetitionError({ reset }: { reset: () => void }) {
  return (
    <ErrorState
      title="Não foi possível carregar esta competição."
      reset={reset}
    />
  );
}
