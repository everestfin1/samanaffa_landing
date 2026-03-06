# 03 - Development

Developer guides, setup instructions, and technical implementation details.

## Contents

| File | Description |
|------|-------------|
| 01-backend-setup.md | Backend configuration and setup |
| 02-backend-tracker.md | Development progress tracker |
| 03-frontend-integration.md | Frontend integration guidelines |
| 04-setup-guide.md | **Start here** - Complete environment setup |
| 05-performance-optimization.md | Performance analysis and optimization |

## Quick Start

```bash
# 1. Install dependencies
bun install

# 2. Configure environment
cp env.example .env.local
# Edit .env.local with your values

# 3. Run database migrations
bun run db:migrate

# 4. Start development server
bun run dev
```

## Key Scripts

| Script | Purpose |
|--------|---------|
| `bun run dev` | Start development server |
| `bun run build` | Production build |
| `bun run db:migrate` | Run database migrations |
| `bun run db:studio` | Open Drizzle Studio |
