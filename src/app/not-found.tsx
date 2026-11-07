import type { Metadata } from "next";
import Link from "next/link";
import { COMPETITION_CODES, COMPETITIONS } from "@/lib/competitions";

export const metadata: Metadata = {
  title: "Página não encontrada | Painel da Bola",
};

const STRIPES = Array.from({ length: 12 }, (_, index) => index);

const FOCUS =
  "focus-visible:outline-brand focus-visible:outline-2 focus-visible:outline-offset-2";

function Pitch404() {
  return (
    <div
      data-testid="pitch-404"
      aria-hidden="true"
      className="bg-pitch relative isolate overflow-hidden rounded-xl"
    >
      <div className="absolute inset-0 -z-10 flex">
        {STRIPES.map((stripe) => (
          <span
            key={stripe}
            className={`flex-1 ${stripe % 2 === 0 ? "bg-pitch-stripe" : ""}`}
          />
        ))}
      </div>
      <svg
        viewBox="0 0 600 300"
        className="block h-auto w-full"
        fill="none"
        stroke="white"
      >
        <g strokeOpacity="0.5" strokeWidth="3">
          <rect x="30" y="24" width="540" height="252" />
          <line x1="300" y1="24" x2="300" y2="276" />
          <rect x="30" y="82" width="78" height="136" />
          <rect x="30" y="118" width="28" height="64" />
          <rect x="492" y="82" width="78" height="136" />
          <rect x="542" y="118" width="28" height="64" />
          <path d="M 108 124 A 34 34 0 0 1 108 176" />
          <path d="M 492 124 A 34 34 0 0 0 492 176" />
        </g>
        <circle cx="300" cy="150" r="64" strokeWidth="14" />
        <circle cx="300" cy="150" r="5" fill="white" stroke="none" />
        <g
          fill="white"
          stroke="none"
          className="font-display"
          fontSize="170"
          fontWeight="700"
          textAnchor="middle"
          dominantBaseline="central"
        >
          <text x="184" y="156">
            4
          </text>
          <text x="416" y="156">
            4
          </text>
        </g>
        <g transform="translate(586 252)">
          <circle r="11" fill="white" stroke="none" />
          <path
            d="M 0 -4.5 L 4.3 -1.4 L 2.6 3.6 L -2.6 3.6 L -4.3 -1.4 Z"
            fill="#15212b"
            stroke="none"
          />
        </g>
      </svg>
    </div>
  );
}

export default function NotFound() {
  return (
    <section className="mx-auto flex w-full max-w-2xl flex-col gap-8 py-6 sm:py-10">
      <Pitch404 />

      <div className="flex flex-col items-center gap-4 text-center">
        <p className="text-muted text-sm font-semibold tracking-wide uppercase">
          Erro 404 · Página não encontrada
        </p>
        <h1 className="font-display text-5xl font-bold sm:text-6xl">
          Bola fora!
        </h1>
        <p className="text-muted max-w-md text-balance">
          A página que você procurou saiu de campo. Pode ser um link antigo ou
          um endereço digitado errado.
        </p>
        <Link
          href="/"
          className={`bg-brand text-background mt-2 rounded-md px-5 py-2.5 font-semibold ${FOCUS}`}
        >
          Voltar para o início
        </Link>
      </div>

      <nav
        aria-label="Competições"
        className="border-border flex flex-col items-center gap-3 border-t pt-6"
      >
        <p className="text-muted text-sm">Ou escolha uma competição:</p>
        <ul className="flex flex-wrap justify-center gap-2">
          {COMPETITION_CODES.map((code) => (
            <li key={code}>
              <Link
                href={`/competicoes/${code}`}
                className={`border-border bg-surface hover:border-brand block rounded-full border px-3 py-1.5 text-sm font-medium ${FOCUS}`}
              >
                {COMPETITIONS[code].name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
