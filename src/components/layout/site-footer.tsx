const linkClass = "hover:text-foreground underline underline-offset-4";

export function SiteFooter() {
  return (
    <footer className="border-border text-muted border-t px-4 py-6 text-center text-sm">
      <p>
        Projeto de portfólio sem fins comerciais. Dados fornecidos por
        football-data.org.
      </p>
      <p className="mt-2 flex justify-center gap-4">
        <a
          href="https://github.com/takezo-code/futebol-dashboard"
          className={linkClass}
        >
          Código no GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/thales-ribeiro-27149a34b/"
          className={linkClass}
        >
          LinkedIn
        </a>
      </p>
    </footer>
  );
}
