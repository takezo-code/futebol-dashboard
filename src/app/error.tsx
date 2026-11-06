"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="border-border bg-surface flex flex-col items-start gap-4 rounded-lg border p-6">
      <h1 className="font-display text-2xl font-bold">
        Não foi possível carregar os dados.
      </h1>
      <p className="text-muted">
        A fonte de dados não respondeu como esperado. Tente de novo em alguns
        instantes.
      </p>
      <button
        type="button"
        onClick={reset}
        className="border-border hover:bg-background focus-visible:outline-brand rounded-md border px-4 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        Tentar de novo
      </button>
    </section>
  );
}
