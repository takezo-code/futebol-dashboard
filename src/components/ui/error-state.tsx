"use client";

import { useRouter } from "next/navigation";
import { startTransition } from "react";

type ErrorStateProps = {
  title: string;
  reset: () => void;
};

export function ErrorState({ title, reset }: ErrorStateProps) {
  const router = useRouter();

  function retry() {
    startTransition(() => {
      router.refresh();
      reset();
    });
  }

  return (
    <section className="border-border bg-surface flex flex-col items-start gap-4 rounded-lg border p-6">
      <h2 className="font-display text-2xl font-bold">{title}</h2>
      <p className="text-muted">
        A fonte de dados não respondeu como esperado. Tente de novo em alguns
        instantes.
      </p>
      <button
        type="button"
        onClick={retry}
        className="border-border hover:bg-background focus-visible:outline-brand rounded-md border px-4 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        Tentar de novo
      </button>
    </section>
  );
}
