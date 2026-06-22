# Sama Naffa — Everest Finance

Next.js client portal and marketing site for **Sama Naffa** (managed savings under mandate). Mono-product on the public site; APE/PEE code remains for admin and historical data.

**Stack:** Next.js 16 · React 19 · Drizzle ORM · PostgreSQL (Neon / on-prem) · Bun

## Documentation

All documentation is in **[`project_docs/`](./project_docs/00-index/README.md)**:

| Start here | Path |
|------------|------|
| Index & navigation | [`project_docs/00-index/README.md`](./project_docs/00-index/README.md) |
| Active product scope | [`project_docs/01-product/07-active-product-scope.md`](./project_docs/01-product/07-active-product-scope.md) |
| Local setup | [`project_docs/03-development/04-setup-guide.md`](./project_docs/03-development/04-setup-guide.md) |
| Git branches & workflow | [`project_docs/03-development/07-git-workflow.md`](./project_docs/03-development/07-git-workflow.md) |
| Lexical compliance audit | [`project_docs/Mise a Niveau Lexicale SamaNaffa.docx`](./project_docs/Mise%20a%20Niveau%20Lexicale%20SamaNaffa.docx) |

## Quick start

```bash
bun install
cp env.example .env.local   # configure DATABASE_URL, auth, Didit, Intouch, etc.
bun run db:migrate
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Purpose |
|---------|---------|
| `bun run dev` | Development server (Turbopack) |
| `bun run build` | Production build |
| `bun run type-check` | TypeScript |
| `bun run test` | Vitest |
| `bun run db:migrate` | Apply Drizzle migrations |
| `bun run db:studio` | Drizzle Studio |

## Environment notes

- **APE deprecated by default** — public APE routes redirect to Sama Naffa. Set `NEXT_PUBLIC_APE_DEPRECATED=false` only for legacy internal testing.
- **Data layer** — target is Drizzle-only (`src/lib/db/schema.ts`). Some routes still use Prisma during migration; do not add new Prisma usage.
