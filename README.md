This project is being migrated from Next.js App Router to **TanStack Start** (Vite + TanStack Router).

## Getting Started

Install dependencies:

```bash
bun install
```

Run the dev server:

```bash
bun run dev
```

Type-check:

```bash
bun run type-check
```

Open `http://localhost:3000` in your browser.

## Backend

Backend APIs are intended to run as **Vercel Functions** under `/api/**` (using `@vercel/node`). During migration, legacy Next.js API handlers may still exist under `src/app/api/**` until they are moved.

## Auth

Authentication is planned to migrate from NextAuth to **better-auth**.
