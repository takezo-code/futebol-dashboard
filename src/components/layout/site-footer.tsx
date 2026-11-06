export function SiteFooter() {
  return (
    <footer className="border-border text-muted border-t px-4 py-6 text-center text-sm">
      <p>
        Projeto de portfólio sem fins comerciais. Dados fornecidos por
        football-data.org.
      </p>
      <p className="mt-2">
        <a
          href="https://github.com/takezo-code/futebol-dashboard"
          className="hover:text-foreground underline underline-offset-4"
        >
          Código no GitHub
        </a>
      </p>
    </footer>
  );
}
