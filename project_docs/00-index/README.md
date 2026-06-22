# Sama Naffa Project Documentation

**Version 4.2 | Last Updated: June 2026**

All project documentation lives in **`project_docs/`** (single source of truth). There is no top-level `docs/` folder.

## Quick Navigation

| Section | Description | Primary Audience |
|---------|-------------|------------------|
| [01 - Product](./01-product/) | Business requirements, specs, context | Product, Business |
| [02 - Architecture](./02-architecture/) | System design, infrastructure | Tech Leads, Architects |
| [03 - Development](./03-development/) | Setup, integration, admin UI | Developers |
| [04 - Integrations](./04-integrations/) | Didit, Intouch, third-party APIs | Developers, DevOps |
| [05 - Security](./05-security/) | Security docs, auth, compliance | Security, DevOps |
| [06 - Project Management](./06-project-management/) | Roadmap, sprints, status | PMs, Stakeholders |
| [07 - Archive](./07-archive/) | Legacy docs, completed plans | Reference |
| [operations/](./operations/) | Deployment & DB migration handover | DevOps |
| [issues/](./issues/) | Engineering backlogs (ADM, AUTH, ONB) | Developers, PM |

---

## Documentation by Role

### For Product Managers & Business Stakeholders
1. **Current scope:** [01 - Product/07-active-product-scope.md](./01-product/07-active-product-scope.md) (Sama Naffa ops only; APE/PEE inactive)
2. [01 - Product/00-project-overview.md](./01-product/00-project-overview.md)
3. [issues/admin-issues.md](./issues/admin-issues.md) — engineering backlog for admin canvas
4. [06 - Project Management/01-roadmap.md](./06-project-management/01-roadmap.md) for timeline

### For Developers
1. Setup: [03 - Development/04-setup-guide.md](./03-development/04-setup-guide.md)
2. Architecture: [02 - Architecture/01-architecture-overview.md](./02-architecture/01-architecture-overview.md)
3. Admin dashboard: [03 - Development/05-admin-dashboard.md](./03-development/05-admin-dashboard.md)
4. Integrations: [04 - Integrations/](./04-integrations/) (Intouch, Didit)

### For DevOps & Security
1. Security: [05 - Security/](./05-security/)
2. Infrastructure: [02 - Architecture/04-infrastructure-fr.md](./02-architecture/04-infrastructure-fr.md)
3. Operations: [operations/HANDOVER_NEON_TO_DB_SRV.md](./operations/HANDOVER_NEON_TO_DB_SRV.md)
4. Deployment runbook: [EVEREST_Deploiement_samanaffa_v2_1.docx](./EVEREST_Deploiement_samanaffa_v2_1.docx)

---

## Key Documents

| Document | Purpose | Status |
|----------|---------|--------|
| [07-active-product-scope.md](./01-product/07-active-product-scope.md) | What to build now | **Current** |
| [Mise a Niveau Lexicale SamaNaffa.docx](./Mise%20a%20Niveau%20Lexicale%20SamaNaffa.docx) | Lexical compliance (EF/DSI/2026/LEX-SN-001) | **Current** |
| [04-setup-guide.md](./03-development/04-setup-guide.md) | Local dev setup | **Current** |
| [05-admin-dashboard.md](./03-development/05-admin-dashboard.md) | Admin bento grid | **Current** |
| [02-ape-senegal-context.md](./01-product/02-ape-senegal-context.md) | APE program context | **Archive** |
| [03-client-portal-spec.md](./01-product/03-client-portal-spec.md) | Portal spec (2025) | **Partial** — mono-produit updates pending |

---

## Document Naming Convention

- `XX-topic.md` — sequential numbering within sections
- Language suffix: `-fr` for French, none for English default
- Completed implementation plans → `07-archive/`

## Maintenance

- **Review cycle:** Quarterly
- **Owner:** Tech Lead + Product Manager
- **Contributors:** All team members

---

*Start from the repo root [README.md](../README.md) for quick start commands.*
