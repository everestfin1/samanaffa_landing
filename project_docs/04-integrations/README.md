# 04 - Integrations

Third-party service integrations and external API documentation.

## Contents

| Directory | Description |
|-----------|-------------|
| [intouch/](./intouch/) | Intouch payment provider (versements, callbacks) |
| [didit/](./didit/) | Didit KYC / identity verification |

## Intouch

Primary payment rail for Sama Naffa versements (Intouch manual confirmation model).

| File | Purpose |
|------|---------|
| [01-integration-guide.md](./intouch/01-integration-guide.md) | Main integration guide |
| [02-callback-configuration.md](./intouch/02-callback-configuration.md) | Webhook/callback setup |
| [03-callback-fixes.md](./intouch/03-callback-fixes.md) | Issue resolutions |
| [04-implementation-summary.md](./intouch/04-implementation-summary.md) | Implementation overview |

## Didit

KYC onboarding (T5) and portal resume flows.

| File | Purpose |
|------|---------|
| [01-agent-skills.md](./didit/01-agent-skills.md) | Cursor/agent skills for Didit API integration |

Repo skills also live in `.cursor/skills/didit-*` at project root.

---

*For new integrations, add a numbered subfolder here and link from this README.*
