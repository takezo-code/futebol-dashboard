# Futebol Dashboard

[![CI](https://github.com/takezo-code/futebol-dashboard/actions/workflows/ci.yml/badge.svg)](https://github.com/takezo-code/futebol-dashboard/actions/workflows/ci.yml)

Painel em Next.js com classificação, jogos e artilharia das principais ligas e copas de clubes, usando dados da football-data.org.

**Acesse:** [futebol-dashboard-mauve.vercel.app](https://futebol-dashboard-mauve.vercel.app/)

## Como rodar localmente

```bash
git clone https://github.com/takezo-code/futebol-dashboard.git
cd futebol-dashboard
pnpm install
cp .env.example .env.local
```

Preencha `FOOTBALL_DATA_TOKEN` no `.env.local` com o seu token gratuito da [football-data.org](https://www.football-data.org/) e rode:

```bash
pnpm dev
```

---

Projeto de portfólio sem fins comerciais. Dados fornecidos por football-data.org.
