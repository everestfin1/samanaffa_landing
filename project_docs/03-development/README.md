# 03 - Development

Developer guides, setup instructions, and technical implementation details.

## Contents

| File | Description |
|------|-------------|
| [04-setup-guide.md](./04-setup-guide.md) | **Start here** — local environment setup |
| [01-backend-setup.md](./01-backend-setup.md) | Backend configuration |
| [02-backend-tracker.md](./02-backend-tracker.md) | Development progress tracker |
| [03-frontend-integration.md](./03-frontend-integration.md) | Frontend integration guidelines |
| [05-admin-dashboard.md](./05-admin-dashboard.md) | Configurable `/admin` bento dashboard |
| [06-drizzle-migration-tracker.md](./06-drizzle-migration-tracker.md) | Prisma shim → native Drizzle progress |
| [07-git-workflow.md](./07-git-workflow.md) | Branches, remotes, commits, archives |
| [momar-figma-map.md](./momar-figma-map.md) | Momar Figma → app screen map (E0–C8) |
| [momar-agent-handover.md](./momar-agent-handover.md) | Agent handover (portal done; legal + email status) |
| [legal-gap-ccu-2026-07.md](./legal-gap-ccu-2026-07.md) | CCU / privacy staging swap + deferred product rules |
| [email-confirmation-deferred.md](./email-confirmation-deferred.md) | Email confirmation UI deferred; stash restore guide |
| [ux-ia-review-2026-07.md](./ux-ia-review-2026-07.md) | Ranked UX/IA review after Momar screen set |

## Quick Start

```bash
bun install
cp env.example .env.local
bun run db:migrate
bun run dev
```

See [04-setup-guide.md](./04-setup-guide.md) for full environment variables and services (Didit, Intouch, email, SMS).

## Key Scripts

| Script | Purpose |
|--------|---------|
| `bun run dev` | Start development server |
| `bun run build` | Production build |
| `bun run type-check` | TypeScript check |
| `bun run test` | Vitest unit tests |
| `bun run db:migrate` | Run database migrations |
| `bun run db:studio` | Open Drizzle Studio |

## Data layer

- **Source of truth:** `src/lib/db/schema.ts` + `drizzle/*.sql` migrations
- **Direction:** Drizzle-only — avoid new Prisma usage (see [07-active-product-scope.md](../01-product/07-active-product-scope.md))
