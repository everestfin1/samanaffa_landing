# Sama Naffa – Architecture Globale du Système

## 1. Vision Produit et Objectifs

Sama Naffa est la plateforme digitale d’Everest Finance dédiée à l’épargne inclusive et à la souscription de produits d’investissement APE Sénégal. Les objectifs principaux sont :

- **Onboarding fluide** pour les clients (diaspora et locaux) avec KYC complet.
- **Portail unifié** pour le suivi des comptes, des demandes et des transactions.
- **Gestion sécurisée des paiements** avec intégration Intouch et traçabilité.
- **Écosystème modulable** permettant d’ajouter rapidement de nouveaux produits financiers.

---

## 2. Pile Technologique

### Frontend

- **Framework** : Next.js 15 (App Router) avec Turbopack.
- **Bibliothèques** : React 19, Tailwind CSS 4, Radix UI, shadcn/ui, Framer Motion, Heroicons & Lucide.
- **Gestion d’état & data fetching** : TanStack React Query (incl. Devtools).
- **Autres** : next/font (Geist), clsx, tailwind-merge.

### Backend / API

- **Node runtime** : Bun (scripts et dev server).
- **API** : Routes Next.js (`src/app/api/**`) organisées par domaine (auth, comptes, transactions, paiements, KYC, notifications, admin).
- **ORM** : Prisma 6.16 connecté à PostgreSQL.
- **Auth** : NextAuth, OTP personnalisés, hashage via bcrypt.
- **Notifications & messagerie** : Nodemailer (Mailgun/SMTP), Twilio (SMS).
- **Stockage** : Vercel Blob (upload de pièces KYC).
- **Sécurité** : jsonwebtoken, rate limiting Redis (`src/lib/rate-limit.ts`).

### Outils de développement

- TypeScript 5, ESLint 9 + config Next, Turbopack, `bun run` pour scripts.
- Scripts CLI dédiés (`scripts/*.ts`) pour manipuler les données (ex. normalisation des numéros).

---

## 3. Organisation du Code

```
├── src/
│   ├── app/                 # Pages publiques, portail, routes API (App Router)
│   ├── components/          # Bibliothèque de composants (UI, modales, pages produit)
│   ├── hooks/               # Hooks métiers (accounts, KYC, notifications, transactions)
│   ├── lib/                 # Services partagés (auth, OTP, Prisma, Intouch, notifications, rate limit)
│   ├── content/             # Données statiques (FAQ, personas)
│   └── types/               # Typages NextAuth et extensions
├── prisma/
│   ├── schema.prisma        # Schéma central (User, Account, TransactionIntent…)
│   ├── migrations/          # Historique des évolutions de schéma
│   └── seed.ts              # Données d’amorçage
├── project_docs/            # Documentation fonctionnelle et technique (historique)
└── ARCHITECTURE_GLOBALE.md  # Ce document
```

---

## 4. Modèle de Données et Logique Métier

### Entités principales

- **User** : informations personnelles, statut KYC, consentements.
- **UserAccount** : comptes clients (Sama Naffa, APE…), taux, périodes de blocage.
- **TransactionIntent** : intentions de dépôt/investissement/retrait, statut, identifiants fournisseur.
- **PaymentCallbackLog** : historisation des callbacks Intouch.
- **KycDocument** : liens vers les fichiers vérifiés.
- **OtpCode** & **RegistrationSession** : sécurisation de l’onboarding.
- **Notification** : centre de notifications utilisateur.
- **AdminUser** : comptes internes avec rôles et verrouillage.
- **Session** (NextAuth) : gestion des sessions utilisateurs.

### Flux clés

1. **Inscription & KYC**
   - Parcours multi-étapes (`src/app/register`) → génération d’une `RegistrationSession`.
   - Vérification OTP (email/SMS) → statut KYC évolutif (`pending` → `under_review` → `approved`).
   - Upload des pièces vers Vercel Blob ; métadonnées stockées dans `KycDocument`.

2. **Authentification & Sécurité**
   - NextAuth avec adapter Prisma.
  - OTP de secours pour la validation initiale.
  - Gestion de verrouillage admin (`failedAttempts`, `lockedUntil`).

3. **Gestion des comptes & produits**
   - `useAccounts`, `useUserProfile` pour synchroniser front/back.
   - Produits décrits dans `src/lib/naffa-products.ts` (taux, conditions).

4. **Transactions & Paiements**
   - Création d’intentions via `/api/transactions/intent` (référence unique).
   - Intégration Intouch : déclenchement des paiements, stockage des `providerTransactionId` et `providerStatus`.
   - Callbacks validés (`payments/intouch/callback`) avec signature HMAC, contrôle d’idempotence, mise à jour des soldes.
   - Journalisation des callbacks et des administrateurs notes (`adminNotes`).

5. **Notifications**
   - Envoi d’emails aux utilisateurs et à l’équipe back-office (`src/lib/notifications.ts`).
   - API `/api/notifications` + `useNotifications` pour l’espace client.

---

## 5. API & Services

| Domaine                    | Endpoints clés                                         | Responsabilités principales                           |
|---------------------------|---------------------------------------------------------|-------------------------------------------------------|
| Authentification          | `/api/auth/verify-otp`, `/api/auth/verify-and-create-account`, `/api/auth/reset-password`, NextAuth | OTP, inscription, sessions, réinitialisation. |
| Comptes & profil          | `/api/accounts`, `/api/users/profile`                   | Consultation des comptes, profils utilisateurs.       |
| Transactions & paiements  | `/api/transactions/intent`, `/api/payments/intouch/*`  | Création d’intentions, intégration Intouch, callbacks |
| KYC                       | `/api/kyc` (selon implémentation en cours)              | Upload, suivi des statuts KYC.                        |
| Notifications             | `/api/notifications`                                    | Création/lecture de notifications, préférences.       |
| Admin                     | `/api/admin/*`                                          | Connexion admin, suivi des activités internes.        |
| Intégrations tierces      | `/api/didit` (onboarding mobile), autres modules planifiés | Connecteurs externes et automatisations.            |

Les routes utilisent Prisma pour toute interaction base de données et appliquent, selon le besoin, le rate limiter Redis (`lib/rate-limit.ts`) pour éviter l’abus des endpoints sensibles (OTP, login).

---

## 6. Stratégies de Sécurité & Conformité

- **Authentification** : Hashage bcrypt, NextAuth, OTP multi-support.
- **Protection des endpoints** : Rate limiting, validation stricte des payloads, vérification de signature pour Intouch.
- **Gestion des secrets** : `.env` (documenté dans `env.example`), PR recommandée pour un coffre-fort (Vault, AWS KMS).
- **Données sensibles** : Prévoir chiffrement applicatif des champs critiques (numéro ID, coordonnées bancaires), redaction dans les logs.
- **Traçabilité** : `PaymentCallbackLog`, `adminNotes`, incrémentation des compteurs de tentatives.
- **Conformité** : Alignement avec la CDP du Sénégal, exigences BCEAO, RGPD (consentements, portabilité, droit à l’oubli).

---

## 7. Décisions Frontend & UX

- **App Router** pour bénéficier des Server Components, streaming et cohabitation APIs/pages.
- **Design system unifié** (Tailwind + Radix + shadcn/ui) garantissant cohérence, accessibilité (ARIA, focus management) et vitesse d’itération.
- **Responsive first** : Breakpoints mobile/tablette/desktop, composants adaptatifs (modales, navigation hamburger).
- **Expérience client** :
  - Tunnel d’inscription guidé et contextualisé.
  - Portail avec modules (KYC, comptes, notifications) isolés pour faciliter la maintenance.
  - Gestion d’état côté client via React Query pour limiter le boilerplate.

---

## 8. Intégrations & Services Externes

- **Intouch** : Paiement mobile et agrégation de wallets (Orange Money, Wave, etc.). Webhook signature HMAC, mapping des statuts (pending/completed/failed/cancelled).
- **Twilio** : Envoi d’OTP/SMS transactionnels.
- **Mailgun / SMTP** : Emails transactionnels et alertes admin.
- **Vercel Blob** : Stockage des pièces KYC (URL signées, contrôle d’accès).
- **Services en préparation** : Didit (onboarding mobile), API open banking (futur).

---

## 9. CI/CD, Qualité & Opérations

- **Scripts NPM/Bun** : `dev`, `build`, `start`, `lint`, `type-check`, `check-all`, `db:migrate`, `db:seed`.
- **Lint & Typage** : ESLint + TypeScript strict (`tsconfig.json`) pour détecter les régressions tôt.
- **Migrations** : `prisma migrate` pour versionner les évolutions de schéma.
- **Environnements** :
  - Dev : local (Bun + Next dev, Prisma DB locale).
  - Staging : pré-production (tests, QA interne).
  - Production : hébergement Next (Vercel ou infra custom), base PostgreSQL managée.
- **Monitoring** : cible d’intégrer logs centralisés (SIEM), métriques (temps de réponse, conversions KYC), alertes.

---

## 10. Observabilité et Plan d’Amélioration

1. **Observabilité** : Ajouter log enrichi (structure JSON), dashboards (Grafana/Datadog), suivi des callbacks Intouch, tracing des erreurs front via Sentry.
2. **Sécurité** : Renforcer chiffrement au repos, automatiser rotation des secrets, déployer WAF.
3. **UX** : Tests utilisateurs sur le portail, amélioration parcours mobile, personnalisation.
4. **Scalabilité** : Prévoir micro-services pour Intouch si volume élevé, job queue pour traitements asynchrones (ex : validation KYC automatique).
5. **Roadmap (issue tracker)** :
   - Intégration API réelle APE.
   - Notifications temps réel (WebSocket ou SSE).
   - Support multi-langues (fr/en/wolof).
   - Application mobile (React Native ou Flutter).

---

## 11. Références Doc & Ressources Internes

- `project_docs/ARCHITECTURE.md` : Architecture historique du refactoring.
- `project_docs/PROJECT_SPECIFICATIONS.md` : Spécifications fonctionnelles.
- `project_docs/*` : Guides KYC, Intouch, plan de performance, directives brand.
- `prisma/schema.prisma` + migrations : Source de vérité du modèle de données.
- `README.md` : Setup de base Next.js (à compléter avec ce document).

---

## 12. Résumé Exécutif

La plateforme Sama Naffa repose sur une architecture Next.js moderne, orchestrant un front réactif et un backend monolithique structuré. Prisma et PostgreSQL fournissent un socle robuste pour les données clients et transactionnelles. Des intégrations avec Intouch, Twilio et Mailgun assurent la continuité des parcours financiers. Les priorités à court terme portent sur l’industrialisation de la sécurité (chiffrement, rotation des secrets), l’observabilité, et l’extension des fonctionnalités du portail client. Ce document au format racine sert de référence pour onboarder les équipes techniques et aligner les décisions futures.
