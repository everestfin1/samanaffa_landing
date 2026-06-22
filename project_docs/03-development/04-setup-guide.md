# Sama Naffa — Guide de démarrage local

**Stack :** Next.js 16 · React 19 · Drizzle ORM · Neon PostgreSQL · Bun  
**Mis à jour :** Mars 2026

---

## Prérequis

- [Bun](https://bun.sh/) installé (`curl -fsSL https://bun.sh/install | bash`)
- PostgreSQL (local ou cloud — Neon recommandé)
- Compte Vercel (pour Vercel Blob — stockage KYC)
- Service email (Mailgun ou SMTP Gmail/SendGrid)
- Compte Twilio (SMS OTP)

---

## 1. Installation

```bash
bun install
```

---

## 2. Variables d'environnement

Copier le fichier d'exemple et configurer :

```bash
cp env.example .env.local
```

Variables essentielles :

```bash
# Base de données (Neon PostgreSQL)
DATABASE_URL="postgresql://user:password@host/sama_naffa_db?sslmode=require"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-secret-aleatoire"

# Admin JWT
ADMIN_JWT_SECRET="votre-secret-admin"

# Email (Nodemailer)
EMAIL_HOST="smtp.mailgun.org"
EMAIL_PORT="587"
EMAIL_USER="postmaster@mg.samanaffa.com"
EMAIL_PASS="votre-mot-de-passe"
EMAIL_FROM="noreply@samanaffa.com"

# SMS (Twilio)
TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
TWILIO_AUTH_TOKEN="votre-auth-token"
TWILIO_PHONE_NUMBER="+1xxxxxxxxxx"

# Stockage KYC (Vercel Blob)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxxx"

# Intouch (paiements)
INTOUCH_AGENCY_CODE="votre-agency-code"
INTOUCH_API_KEY="votre-api-key"
INTOUCH_BASIC_AUTH_USERNAME="username-intouch"
INTOUCH_BASIC_AUTH_PASSWORD="password-intouch"
INTOUCH_ALLOW_UNSIGNED_CALLBACKS="true"   # true en dev uniquement

# URL de base
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

Voir `env.example` pour la liste complète.

---

## 3. Base de données (Drizzle ORM)

> La plateforme utilise **Drizzle ORM** (migré depuis Prisma). Le schéma source de vérité est `src/lib/db/schema.ts`.

```bash
# Générer les migrations depuis le schéma
bun run db:generate

# Appliquer le schéma directement (dev / staging)
bun run db:push

# Exécuter les migrations versionées
bun run db:migrate

# Ouvrir Drizzle Studio (GUI base de données)
bun run db:studio

# Insérer les données de test (seed)
bun run db:seed
```

> **Note :** L'ORM actif est Drizzle (`drizzle/` + `src/lib/db/`). Les anciennes migrations Prisma sont archivées dans `project_docs/07-archive/prisma-migrations/`.

### Migration PEE Leads en attente

```bash
# Créer la table pee_leads (si pas encore fait)
bun x drizzle-kit push
```

---

## 4. Démarrer le serveur de développement

```bash
bun run dev
# Turbopack activé par défaut → http://localhost:3000
```

---

## 5. Scripts disponibles

```bash
bun run dev          # Serveur dev (Turbopack)
bun run build        # Build production (Turbopack)
bun run start        # Démarrer le build prod
bun run lint         # ESLint
bun run type-check   # TypeScript strict (tsc --noEmit)
bun run check-all    # lint + type-check

bun run db:generate  # Générer migrations Drizzle
bun run db:migrate   # Exécuter migrations
bun run db:push      # Push schéma direct
bun run db:studio    # Ouvrir Drizzle Studio
bun run db:seed      # Seed données de test

bun run db:normalize-phones  # Normaliser les numéros de téléphone
bun run db:check-phones      # Vérifier la cohérence des numéros
```

---

## 6. Architecture du code

```
src/
├── app/                  # Pages publiques + portail + routes API (App Router)
│   ├── (public)/         # Landing, FAQ, contact, APE, Sama Naffa
│   ├── admin/            # Tableau de bord admin
│   ├── portal/           # Portail client authentifié
│   ├── register/         # Inscription multi-étapes
│   ├── login/            # Connexion
│   ├── setup-password/   # Configuration mot de passe
│   └── api/              # API Routes Next.js
├── components/           # Composants UI (portail, admin, paiements, KYC...)
├── hooks/                # Hooks métiers (accounts, KYC, notifications, transactions)
├── lib/                  # Services partagés (auth, OTP, Drizzle, Intouch, rate-limit...)
│   └── db/               # Schéma Drizzle + client Neon
└── types/                # Extensions TypeScript NextAuth
drizzle/                  # Migrations Drizzle
scripts/                  # Scripts CLI (seed, normalisation téléphones, tests callbacks...)
project_docs/             # Documentation unique du projet (voir 00-index/README.md)
project_docs/07-archive/prisma-migrations/  # SQL Prisma historique
```

---

## 7. Mode maintenance

Pour activer le mode maintenance (redirection toutes pages vers `/maintenance`) :

```typescript
// src/proxy.ts
const MAINTENANCE_MODE = true;
```

Ou via variable d'environnement :
```bash
NEXT_PUBLIC_MAINTENANCE_MODE=true
```

### Personnalisation

Modifier les éléments dans `src/app/maintenance/page.tsx` :
- Contact : `contact@samanaffa.sn` / `+221 33 823 45 67`
- Message : adapté à votre contexte
- Couleurs : primary `#435933`, secondary `#30461f`, accent `#C38D1C`

---

## 8. Déploiement (Vercel)

```bash
vercel --prod
```

**Checklist pré-déploiement :**
- [ ] Toutes les variables d'environnement configurées dans Vercel Dashboard
- [ ] `INTOUCH_ALLOW_UNSIGNED_CALLBACKS=false` en production
- [ ] `NEXT_PUBLIC_MAINTENANCE_MODE=false`
- [ ] Migration DB appliquée (`bun run db:migrate`)
- [ ] `bun run check-all` passe sans erreur
