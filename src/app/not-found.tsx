import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex flex-col items-start gap-4 py-12">
      <h1 className="font-display text-4xl font-bold">Página não encontrada</h1>
      <p className="text-muted">
        Essa competição ou página não existe no Futebol Dashboard.
      </p>
      <Link
        href="/"
        className="text-brand font-medium underline underline-offset-4"
      >
        Voltar para o início
      </Link>
    </section>
  );
}
