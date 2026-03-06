# 02 - Architecture

System architecture, infrastructure, and technical design documentation.

## Contents

| File | Description |
|------|-------------|
| 01-architecture-overview.md | Main architecture documentation (EN) |
| 02-architecture-fr.md | Architecture documentation (FR) |
| 03-database-migration.md | Drizzle ORM migration guide |
| 04-infrastructure-fr.md | Infrastructure and third-party tools (FR) |

## Key Components

### Navigation Structure
- Public pages: Landing, FAQ, Contact
- Auth pages: Login, Register (4-step)
- Client Portal: Authenticated dashboard with KYC

### KYC Flow States
1. pending → in_progress → documents_required → under_review → approved/rejected

### Technology Stack
- **Frontend**: React + Next.js + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: JWT + OTP (SMS/Email)
