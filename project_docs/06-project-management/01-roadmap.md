# Sama Naffa — Roadmap & Travaux en cours

**Mis à jour :** Mars 2026

---

## 🚧 En cours (In Progress)

### PEE Leads — Intégration formulaire
**Statut :** ⚠️ Partiellement complété — migration DB requise

| Étape | Statut | Action |
|-------|--------|--------|
| Schéma DB | ✅ | Table `peeLeads` ajoutée à `drizzle/schema.ts` |
| Migration SQL | ✅ | Fichier `drizzle/0004_add_pee_leads.sql` créé |
| API endpoint public | ✅ | `POST /api/lead-pee` sauvegarde DB + email |
| API endpoint admin | ✅ | `GET/PATCH /api/admin/pee-leads` créé |
| **Appliquer migration** | ⚠️ | `bun x drizzle-kit push` — **ACTION REQUISE** |
| **Interface admin** | ⚠️ | Ajouter onglet PEE Leads dans `src/app/admin/page.tsx` — **ACTION REQUISE** |

**Schéma :**
```typescript
peeLeads {
  id, civilite, prenom, nom, categorie, pays, ville,
  telephone, email, status: 'NEW'|'CONTACTED'|'CONVERTED',
  adminNotes, createdAt, updatedAt
}
```

**Test du flux complet :**
1. Soumettre formulaire sur `/pee`
2. Vérifier sauvegarde en DB
3. Confirmer notification email
4. Visualiser lead dans admin
5. Mettre à jour statut/notes depuis admin

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
