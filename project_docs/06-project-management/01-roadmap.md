# Sama Naffa — Roadmap & Travaux en cours

**Mis à jour :** Juin 2026

**Priorité produit actuelle :** [07-active-product-scope.md](../01-product/07-active-product-scope.md) — **Sama Naffa uniquement** (comptes, KYC, Naffa, dépôts Intouch). APE & PEE **inactifs** côté ops.

---

## 🚧 En cours (In Progress)

### Admin canvas — Sama Naffa ops
**Statut :** En cours — voir [admin-issues.md](../issues/admin-issues.md)

| Priorité | Thème |
|----------|--------|
| P0 | Transactions dépôt : PENDING → PROCESSING → COMPLETED (Intouch) |
| P1 | Utilisateurs suspend/activate ; recalcul soldes |
| P2 | Leads abandonnés (UI canvas) ; masquer nav APE/PEE |

### ~~PEE Leads — Intégration formulaire~~
**Statut :** ⏸️ **Inactif (PM, juin 2026)** — pas de travail admin/CRM. APIs et pages peuvent rester en place pour données historiques.

---

## 📋 À venir (Backlog)

### Performance — Phases 2 & 3
Référence : [PERFORMANCE_ANALYSIS_AND_OPTIMIZATION_PLAN.md](./PERFORMANCE_ANALYSIS_AND_OPTIMIZATION_PLAN.md)

| Phase | Statut | Items |
|-------|--------|-------|
| Phase 1 | ✅ | TanStack Query intégration (caching, dedup, stale-while-revalidate) |
| Phase 2 | 🔄 | Optimistic updates, infinite scroll, image optimization, code splitting |
| Phase 3 | 📋 | Sentry integration, bundle analysis, lazy loading avancé |

**Optimisations restantes :**
- [ ] Optimistic updates pour mutations (transactions, profil)
- [ ] Infinite scroll sur historique transactions
- [ ] Image optimization (WebP, lazy loading)
- [ ] Code splitting par route (next/dynamic)
- [ ] Sentry pour tracking erreurs frontend
- [ ] Bundle analysis et tree-shaking

### Sécurité — Items critiques
Référence : [SECURITY.md](./SECURITY.md)

| Priorité | Item | Effort |
|----------|------|--------|
| 🔴 Critique | Vercel Paid Tier (WAF + Analytics) | 30 min |
| 🔴 Critique | APIs RGPD/CDP : export, suppression, portabilité | 3-5 jours |
| 🟡 Haute | 2FA Admin TOTP (Google Authenticator) | 2-3 jours |
| 🟡 Haute | RBAC Admin (SUPER_ADMIN/SUPPORT/AUDITOR) | 2 jours |
| 🟡 Haute | Page politique de confidentialité | 1 jour |
| 🟢 Moyenne | Restriction IP/VPN admin | 1-2 jours |
| 🟢 Moyenne | Chiffrement applicatif champs sensibles | 2-3 jours |

### Fonctionnalités produit

| Feature | Description | Priorité |
|---------|-------------|----------|
| Intégration API APE réelle | Connexion directe aux systèmes BCEAO/BRVM | 🟡 Haute |
| Notifications temps réel | WebSocket ou SSE pour alertes transactions | 🟡 Haute |
| Support multi-langues | FR (✅) · EN · Wolof | 🟢 Moyenne |
| Application mobile | React Native ou Flutter | 🟢 Future |
| Dashboard analytics avancé | Métriques conversion, rétention, LTV | 🟢 Moyenne |

---

## ✅ Récemment complété

- ✅ Migration Prisma → Drizzle ORM (résolution erreurs déploiement Vercel)
- ✅ Intégration paiement Intouch (webhook + fallback manuel)
- ✅ Réconciliation CSV APE/Intouch en masse (admin)
- ✅ Système d'authentification Password + OTP fallback
- ✅ Rate limiting, sécurité headers, CSRF, XSS protection
- ✅ Mode maintenance
- ✅ Documentation consolidée et réorganisée

---

## 🎯 Objectifs Q1 2026

1. **Conformité** : APIs RGPD/CDP + page politique confidentialité
2. **Sécurité** : Vercel Paid Tier (WAF) + 2FA Admin
3. **Stabilité** : Résoudre webhook Intouch (coordination avec équipe Intouch)
4. **Produit** : Compléter intégration PEE Leads
5. **Performance** : Phase 2 optimisations (optimistic updates, infinite scroll)
