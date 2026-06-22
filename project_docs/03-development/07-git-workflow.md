# Git workflow

Canonical remote: **`origin`** → `https://github.com/everestfin1/samanaffa_landing.git`

Do not add a second remote unless the team explicitly agrees (no personal `upstream` fork remote in day-to-day work).

## Long-lived branches

| Branch | Role |
|--------|------|
| **`main`** | Production baseline. Releases and hotfixes target this branch. Protected — merge via PR only. |
| **`staging`** | Active integration branch. All day-to-day development merges here first. This is the branch to run locally for current Sama Naffa work (Drizzle, admin, product scope). |

Feature work branches from **`staging`**, opens a PR into **`staging`**, and is promoted to **`main`** via PR only when ready for production.

```
main      ← production (protected, PR only)
  ▲
staging   ← integration / staging (default working branch)
  ▲
feat/…    ← short-lived feature branches
```

## Short-lived branches

Use [Conventional Commits](https://www.conventionalcommits.org/) branch prefixes:

| Prefix | Use |
|--------|-----|
| `feat/<short-desc>` | New capability |
| `fix/<short-desc>` | Bug fix |
| `chore/<short-desc>` | Tooling, deps, housekeeping |
| `docs/<short-desc>` | Documentation only |
| `refactor/<short-desc>` | Behaviour-preserving code change |

Examples: `feat/onboarding-otp`, `fix/admin-auth-session`, `chore/bun-deps`.

Delete feature branches after merge (GitHub: enable “delete branch after merge”).

## Archived branches

Experimental or abandoned lines are kept on `origin` under `archive/` (read-only reference):

| Archive branch | Former purpose |
|----------------|----------------|
| `archive/preview` | Coolify / Hetzner preview deployment notes |
| `archive/tanstack-dev` | TanStack / Nitro SSR experiment |
| `archive/tested` | Ad-hoc testing snapshot |

To inspect: `git fetch origin && git log origin/archive/preview -5 --oneline`

Do not develop on `archive/*` branches.

## Commit messages

Follow Conventional Commits:

```
<type>(<scope>): <short summary in imperative mood>
```

- **Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`
- **Scope:** optional, lowercase — e.g. `admin`, `auth`, `db`, `payment-processing`
- No markdown fences around the subject line
- Subject ≤ 72 characters, no trailing period

## Daily commands

```bash
# Clone and use the staging integration branch
git clone https://github.com/everestfin1/samanaffa_landing.git
cd samanaffa_landing
git checkout staging
git pull origin staging

# Start a feature
git checkout -b feat/my-feature staging
# ... commits ...
git push -u origin feat/my-feature
# Open PR → staging on GitHub

# Promote to production when ready
# Open PR: staging → main
```

## Syncing with origin

```bash
git fetch origin
git checkout staging
git pull --rebase origin staging   # prefer rebase on integration branch
```

If `staging` has diverged from `origin/staging`, coordinate with the team before force-pushing. Prefer merge or rebase locally, then push a fast-forward or merge commit — never force-push shared branches without agreement.

## Deployment mapping

| Environment | Branch |
|-------------|--------|
| Staging / active dev | `staging` |
| Production | `main` |

Configure Coolify/Vercel (or other hosts) so the staging environment tracks `staging` and production tracks `main`.

### Vercel environment variables

Set variables in the Vercel project for **Preview** (staging branch deploys) and **Production** separately. Minimum for a successful build and runtime:

| Variable | Required |
|----------|----------|
| `DATABASE_URL` | Yes |
| `NEXTAUTH_URL` | Yes |
| `NEXTAUTH_SECRET` | Yes |
| `ADMIN_JWT_SECRET` | Yes (admin routes) |

Copy the full list from [`env.example`](../../env.example). Scope `MOCK_OTP=true` to Preview only — never Production.

**Note:** `DATABASE_URL` must be present at **runtime**. The app lazy-connects to the database so `next build` does not open a connection during static analysis, but API routes will fail at request time if the variable is missing.

## Recommended GitHub settings

- **Default branch:** `staging` (so PRs and clones target the integration branch).
- **Branch protection on `main`:** require PR, require status checks, no direct pushes, no force-push.
- **Branch protection on `staging`:** require PR for merges; allow maintainers to rebase.
- Enable **“Automatically delete head branches”** after merge.
