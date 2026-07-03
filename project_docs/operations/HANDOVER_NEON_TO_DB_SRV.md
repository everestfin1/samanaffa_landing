# Handover — Migration Neon → db-srv (PostgreSQL 16)

**Projet :** Sama Naffa (`samanaffa.com`)  
**Référence déploiement :** EF/DSI/2026/DEPL-SAMA-001 v2.0  
**Serveur cible :** `db-srv` — `10.10.111.3` (Ubuntu 24.04 LTS, PostgreSQL 16)  
**Auteur :** Aliou Wade — Développeur applicatif  
**Date :** 16 juin 2026  
**Diffusion :** DSI (M. SEYE), Aliou Wade  
**Confidentialité :** INTERNE EVEREST

---

## 1. Objet du document

Ce document est le **mode opératoire de passation** pour migrer la base de données Sama Naffa depuis **Neon** (PostgreSQL serverless, cloud US) vers **PostgreSQL 16 auto-hébergé** sur `db-srv`.

Il couvre :

- la **première duplication** de la base Neon active vers `db-srv` ;
- la **vérification d'intégrité** post-migration ;
- la mise en place d'une **expérience développeur type « branches »** (bases multiples sur le même serveur) ;
- les **garde-fous** pour rester conforme au document de déploiement (production-ready, BaaS, pgBackRest).

> **À copier sur db-srv :** ce fichier peut être déposé dans `/var/lib/everest-migration/docs/` ou `/home/awade/` sur le serveur pour référence sur site.

---

## 2. Contexte et périmètre

### 2.1 Situation actuelle

| Élément | Aujourd'hui (Neon) | Cible (db-srv) |
|---|---|---|
| Moteur | PostgreSQL serverless (Neon) | PostgreSQL 16 standard |
| Hébergement | Cloud US (Neon) | STELLARIX Diamniadio (`10.10.111.3`) |
| Driver applicatif | `@neondatabase/serverless` | `pg` + Drizzle (`node-postgres`) — *à finaliser côté app* |
| Pooling | Hostname `-pooler` Neon | pgBouncer `:6432` (quand configuré par DSI) |
| Branches dev | Branches Neon (CoW instantané) | Bases `samanaffa_br_*` (clones `TEMPLATE`) |
| Sauvegarde | Gérée par Neon | pgBackRest + BaaS STELLARIX |

### 2.2 Branches Neon documentées (référence)

Les hostnames suivants sont documentés dans le projet (sans credentials) :

| Nom logique | Hostname pooler Neon |
|---|---|
| preview / dev | `ep-weathered-butterfly-abt0k2l5-pooler.eu-west-2.aws.neon.tech` |
| staging | `ep-cold-pine-abfbfoco-pooler.eu-west-2.aws.neon.tech` |
| prod-2 | `ep-small-bird-ab1akd9e-pooler.eu-west-2.aws.neon.tech` |
| **branche active locale** | `ep-nameless-sunset-abw7raye-pooler.eu-west-2.aws.neon.tech` |

**Source de vérité pour la première migration :** la branche active dans `.env.local` du poste développeur (actuellement `ep-nameless-sunset`).

### 2.3 Bases prévues sur db-srv

| Base | Rôle | Qui y accède |
|---|---|---|
| `samanaffa` | Production (MEP) | App prod uniquement — **ne pas utiliser pour les tests dev** |
| `samanaffa_dev` | Duplicate de référence (clone Neon) | Développement, migrations, recette |
| `samanaffa_stage` | Préprod / recette (optionnel sur db-srv ou srvstage) | DSI + dev |
| `samanaffa_br_<nom>` | Branches dev (clones template) | Dev local, features isolées |

---

## 3. Prérequis

### 3.1 Accès réseau

| Prérequis | Statut / action |
|---|---|
| FortiClient VPN (mode VPN only) | Installé — credentials fournis par STELLARIX (M. Wogormebu) |
| IP VPN nominative | `10.212.134.203` — communiquée à la DSI pour whitelisting UFW |
| SSH `awade@10.10.111.3` | ✅ Fonctionnel |
| SSH `awade@10.10.111.2` (VM-app) | ⏳ En attente whitelisting UFW (plage VPN) |
| SSH `awade@10.10.111.4` (srvstage) | ⏳ En attente whitelisting UFW (plage VPN) |

### 3.2 Outils sur le poste local (Mac)

```bash
# Vérifier la présence des outils
which pg_dump pg_restore psql scp ssh
# Si absent : brew install libpq && brew link --force libpq
```

### 3.3 Secrets

- **Neon :** `DATABASE_URL` dans `.env.local` (ne jamais commiter, ne pas copier dans ce document).
- **db-srv :** mot de passe `samanaffa_app` fourni par la DSI (coffre-fort EVEREST).
- **Aucun secret** ne doit être stocké en clair sur `db-srv` hors fichiers `.env` protégés (mode `600`, propriétaire `deploy` ou `postgres`).

### 3.4 Rôles PostgreSQL attendus (à confirmer avec DSI)

| Rôle | Usage |
|---|---|
| `postgres` | Admin système — migrations, `pg_restore`, création de bases |
| `samanaffa_app` | Connexions applicatives (DML/DDL selon politique DSI) |

---

## 4. Architecture cible sur db-srv

```
db-srv (10.10.111.3)
├── PostgreSQL 16 (port 5432, écoute réseau privé 10.10.111.0/24)
├── pgBouncer (port 6432 — pooling, quand activé)
├── pgBackRest (sauvegardes + WAL)
├── Dossier transit : /var/lib/everest-migration/
│   ├── dumps/          (*.dump)
│   ├── logs/           (journaux migration)
│   └── docs/           (ce handover)
└── Bases :
    ├── samanaffa           ← production (MEP)
    ├── samanaffa_dev       ← duplicate Neon (référence dev)
    ├── samanaffa_stage     ← optionnel
    └── samanaffa_br_*      ← branches dev
```

**Principe :** on ne transforme pas `db-srv` en « Neon self-hosted ». On garde un PostgreSQL standard conforme au document de déploiement, et on ajoute des **scripts / procédures** pour reproduire l'expérience branches côté développeur.

---

## 5. Phase 0 — Préparation sur db-srv (DSI ou awade + sudo)

> À exécuter une seule fois, ou à valider avec la DSI si déjà fait.

### 5.1 Dossier de transit

```bash
ssh awade@10.10.111.3

sudo mkdir -p /var/lib/everest-migration/{dumps,logs,docs}
sudo chown -R awade:awade /var/lib/everest-migration
sudo chmod 750 /var/lib/everest-migration
```

### 5.2 Créer la base de développement (si absente)

```bash
sudo -u postgres psql <<'SQL'
-- Créer la base dev (ignorer si déjà existante)
SELECT 'CREATE DATABASE samanaffa_dev OWNER samanaffa_app'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'samanaffa_dev')\gexec

-- Extensions courantes
\c samanaffa_dev
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
SQL
```

### 5.3 Copier ce handover sur le serveur

Depuis le poste local :

```bash
scp project_docs/operations/HANDOVER_NEON_TO_DB_SRV.md \
  awade@10.10.111.3:/var/lib/everest-migration/docs/
```

---

## 6. Phase 1 — Export depuis Neon (poste local)

### 6.1 Charger l'URL Neon active

```bash
cd /chemin/vers/sn_ape_clean

# Charger DATABASE_URL depuis .env.local (sans l'afficher)
export $(grep -E '^DATABASE_URL=' .env.local | sed "s/^['\"]//;s/['\"]$//" | xargs)
```

### 6.2 Dump logique (format custom, recommandé)

```bash
TIMESTAMP=$(date -u +%Y%m%dT%H%M%SZ)
DUMP_FILE="samanaffa_dev_${TIMESTAMP}.dump"

pg_dump \
  --format=custom \
  --no-owner \
  --no-privileges \
  --verbose \
  "$DATABASE_URL" \
  -f "/tmp/${DUMP_FILE}"

ls -lh "/tmp/${DUMP_FILE}"
```

**Options expliquées :**

- `--format=custom` : format binaire compressé, restaurable avec `pg_restore -j` (parallèle).
- `--no-owner --no-privileges` : évite les conflits de rôles entre Neon et db-srv.
- Pas de `--clean` sur le dump initial : la restauration se fait sur une base vide.

### 6.3 Vérifications avant transfert (côté Neon)

```bash
psql "$DATABASE_URL" -c "
  SELECT current_database() AS db, current_user AS usr, version();
"

psql "$DATABASE_URL" -c "
  SELECT relname AS table_name, n_live_tup AS approx_rows
  FROM pg_stat_user_tables
  WHERE schemaname = 'public'
  ORDER BY n_live_tup DESC;
"
```

**Tables clés à noter pour comparaison post-restore :**

| Table | Usage |
|---|---|
| `users` | Comptes utilisateurs |
| `user_accounts` | Comptes épargne / APE |
| `transaction_intents` | Intentions de paiement |
| `payment_callback_logs` | Audit callbacks Intouch |
| `kyc_documents` | Métadonnées documents KYC |
| `ape_subscriptions` | Souscriptions APE |
| `admin_users` | Console admin |

Sauvegarder la sortie dans un fichier local :

```bash
psql "$DATABASE_URL" -c "
  SELECT 'users' AS t, COUNT(*)::bigint AS n FROM users
  UNION ALL SELECT 'user_accounts', COUNT(*) FROM user_accounts
  UNION ALL SELECT 'transaction_intents', COUNT(*) FROM transaction_intents
  UNION ALL SELECT 'payment_callback_logs', COUNT(*) FROM payment_callback_logs
  UNION ALL SELECT 'kyc_documents', COUNT(*) FROM kyc_documents
  UNION ALL SELECT 'ape_subscriptions', COUNT(*) FROM ape_subscriptions
  UNION ALL SELECT 'admin_users', COUNT(*) FROM admin_users;
" | tee "/tmp/neon_counts_${TIMESTAMP}.txt"
```

---

## 7. Phase 2 — Transfert vers db-srv

```bash
scp "/tmp/${DUMP_FILE}" \
  awade@10.10.111.3:/var/lib/everest-migration/dumps/

scp "/tmp/neon_counts_${TIMESTAMP}.txt" \
  awade@10.10.111.3:/var/lib/everest-migration/logs/
```

Vérifier l'intégrité du fichier sur le serveur :

```bash
ssh awade@10.10.111.3 "ls -lh /var/lib/everest-migration/dumps/${DUMP_FILE}"
```

---

## 8. Phase 3 — Import sur db-srv

### 8.1 Préparer la base cible (base vide)

```bash
ssh awade@10.10.111.3

# Couper les connexions actives sur samanaffa_dev
sudo -u postgres psql -c "
  SELECT pg_terminate_backend(pid)
  FROM pg_stat_activity
  WHERE datname = 'samanaffa_dev' AND pid <> pg_backend_pid();
"

# Recréer la base (DESTRUCTIF — uniquement sur samanaffa_dev, jamais sur samanaffa prod)
sudo -u postgres psql -c "DROP DATABASE IF EXISTS samanaffa_dev;"
sudo -u postgres psql -c "CREATE DATABASE samanaffa_dev OWNER samanaffa_app;"
```

### 8.2 Restaurer le dump

```bash
DUMP_FILE="samanaffa_dev_YYYYMMDDTHHMMSSZ.dump"   # adapter le nom

sudo -u postgres pg_restore \
  --dbname=samanaffa_dev \
  --no-owner \
  --role=samanaffa_app \
  --jobs=4 \
  --verbose \
  /var/lib/everest-migration/dumps/${DUMP_FILE} \
  2>&1 | tee /var/lib/everest-migration/logs/restore_${DUMP_FILE}.log
```

> **Note :** `pg_restore` peut afficher des warnings sur des objets déjà existants ou des ACL — consigner le log et vérifier les comptages ensuite.

### 8.3 Extensions post-restore

```bash
sudo -u postgres psql -d samanaffa_dev -c "CREATE EXTENSION IF NOT EXISTS pgcrypto;"
sudo -u postgres psql -d samanaffa_dev -c 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
```

### 8.4 Appliquer les migrations Drizzle (si schéma app en avance sur Neon)

Depuis le poste local, pointer temporairement vers db-srv :

```bash
# Exemple — URL fournie par DSI, via pgBouncer si disponible
export DATABASE_URL="postgresql://samanaffa_app:<PASSWORD>@10.10.111.3:5432/samanaffa_dev?sslmode=prefer"

bun run db:migrate
```

---

## 9. Phase 4 — Vérification d'intégrité

### 9.1 Comptages sur db-srv

```bash
ssh awade@10.10.111.3

sudo -u postgres psql -d samanaffa_dev -c "
  SELECT 'users' AS t, COUNT(*)::bigint AS n FROM users
  UNION ALL SELECT 'user_accounts', COUNT(*) FROM user_accounts
  UNION ALL SELECT 'transaction_intents', COUNT(*) FROM transaction_intents
  UNION ALL SELECT 'payment_callback_logs', COUNT(*) FROM payment_callback_logs
  UNION ALL SELECT 'kyc_documents', COUNT(*) FROM kyc_documents
  UNION ALL SELECT 'ape_subscriptions', COUNT(*) FROM ape_subscriptions
  UNION ALL SELECT 'admin_users', COUNT(*) FROM admin_users;
"
```

Comparer avec `/var/lib/everest-migration/logs/neon_counts_*.txt`.

### 9.2 Vérifications complémentaires

```bash
# Dernière activité
sudo -u postgres psql -d samanaffa_dev -c "
  SELECT MAX(\"createdAt\") AS last_user FROM users;
  SELECT MAX(\"createdAt\") AS last_intent FROM transaction_intents;
"

# Tables Drizzle / journal migrations
sudo -u postgres psql -d samanaffa_dev -c "
  SELECT * FROM drizzle.__drizzle_migrations ORDER BY created_at;
" 2>/dev/null || echo "Table drizzle.__drizzle_migrations absente — normal si migrations non encore appliquées"

# Taille de la base
sudo -u postgres psql -c "
  SELECT pg_size_pretty(pg_database_size('samanaffa_dev'));
"
```

### 9.3 Test applicatif (poste local)

Mettre à jour `.env.local` :

```bash
DATABASE_URL="postgresql://samanaffa_app:<PASSWORD>@10.10.111.3:5432/samanaffa_dev?sslmode=prefer"
# ou via pgBouncer :
# DATABASE_URL="postgresql://samanaffa_app:<PASSWORD>@10.10.111.3:6432/samanaffa_dev"
```

Puis :

```bash
bun run db:studio          # inspection visuelle
bun run dev                # smoke test app
curl -s http://localhost:3000/api/health/db  # si DB_HEALTH_CHECK_SECRET configuré
```

### 9.4 Critères GO / NO-GO migration initiale

| Critère | GO |
|---|---|
| Comptages tables clés | Identiques Neon vs db-srv (±0) |
| `bun run db:migrate` | Succès sans erreur |
| Login / signup smoke test | Fonctionnel sur db-srv |
| Aucune donnée sensible loguée | Pas de dump/commit de secrets |

---

## 10. Branches dev sur db-srv (équivalent Neon simplifié)

### 10.1 Créer une branche

```bash
ssh awade@10.10.111.3

BRANCH_NAME="feature_kyc_flow"   # alphanum + underscore uniquement
DB_NAME="samanaffa_br_${BRANCH_NAME}"

# Bloquer les connexions sur la base source le temps du clone
sudo -u postgres psql -c "
  SELECT pg_terminate_backend(pid)
  FROM pg_stat_activity
  WHERE datname = 'samanaffa_dev' AND pid <> pg_backend_pid();
"

sudo -u postgres psql -c "
  CREATE DATABASE ${DB_NAME} OWNER samanaffa_app TEMPLATE samanaffa_dev;
"
```

Connection string locale :

```
postgresql://samanaffa_app:<PASSWORD>@10.10.111.3:5432/samanaffa_br_feature_kyc_flow
```

### 10.2 Lister les branches

```bash
sudo -u postgres psql -c "
  SELECT datname FROM pg_database
  WHERE datname LIKE 'samanaffa_br_%'
  ORDER BY datname;
"
```

### 10.3 Supprimer une branche

```bash
DB_NAME="samanaffa_br_feature_kyc_flow"

sudo -u postgres psql -c "
  SELECT pg_terminate_backend(pid)
  FROM pg_stat_activity
  WHERE datname = '${DB_NAME}' AND pid <> pg_backend_pid();
"
sudo -u postgres psql -c "DROP DATABASE IF EXISTS ${DB_NAME};"
```

### 10.4 Limites vs Neon

| Neon | db-srv (cette approche) |
|---|---|
| Clone instantané CoW | Copie physique complète (`TEMPLATE`) |
| Coût disque minimal par branche | Chaque branche = taille complète de `samanaffa_dev` |
| Console web intégrée | Drizzle Studio + `psql` / pgweb (tunnel SSH) |
| Branches éphémères illimitées | Surveiller l'espace disque (500 Go SSD sur VM-db) |

---

## 11. Synchronisation continue (avant MEP production)

Pour la bascule production (J0 — document §10.2), prévoir :

| Phase | Timing | Action |
|---|---|---|
| Migration initiale | J-7 | Dump complet → restore sur `samanaffa` (prod) ou `samanaffa_dev` |
| Sync quotidienne | J-7 → J-2 | Re-dump + restore sur base de travail, ou export incrémental par `updatedAt` |
| Gel applicatif | J-1 22h00 | Code freeze, dernier dump différentiel |
| Bascule | J0 06h30 | DNS + `DATABASE_URL` prod → db-srv |

**Neon reste en lecture seule 60 jours post-MEP** (filet de sécurité — document §10.2.3 / risque R5).

---

## 12. Connexions applicatives

### 12.1 URLs de connexion

| Contexte | Hôte | Port | Base |
|---|---|---|---|
| Direct PostgreSQL | `10.10.111.3` | `5432` | selon env |
| Via pgBouncer (prod) | `10.10.111.3` | `6432` | `samanaffa` |
| Dev local → db-srv | `10.10.111.3` | `5432` | `samanaffa_dev` ou `samanaffa_br_*` |

### 12.2 Prérequis côté application (Aliou Wade)

- [ ] Remplacer `drizzle-orm/neon-serverless` par `drizzle-orm/node-postgres` + `pg` dans `src/lib/db/index.ts`
- [ ] Vérifier que `scripts/db-migrate.ts` et l'app utilisent le même driver
- [ ] Script local `use-db` pour basculer Neon ↔ db-srv (à créer)

---

## 13. Sécurité et conformité

| Règle | Détail |
|---|---|
| Pas de superuser applicatif | L'app utilise `samanaffa_app` uniquement |
| Pas d'exposition Internet | PostgreSQL accessible depuis `10.10.111.0/24` et VPN uniquement |
| Secrets | Fournis par DSI (coffre-fort), jamais dans Git |
| Dumps | Stockés dans `/var/lib/everest-migration/dumps/`, chmod restrictif, purge après validation |
| Prod vs dev | **Ne jamais** tester destructivement sur `samanaffa` (prod) |
| Sauvegarde | pgBackRest + BaaS gérés par DSI — ne pas désactiver |
| Données KYC | Ce handover couvre **PostgreSQL uniquement** — migration Vercel Blob → MinIO est un lot séparé (§10.3 du document de déploiement) |

---

## 14. Dépannage

| Symptôme | Cause probable | Action |
|---|---|---|
| `Connection refused` SSH sur `.2` / `.4` | UFW — plage VPN non autorisée | Fournir IP VPN à DSI (`10.212.134.203`) |
| `Connection refused` SSH sur `.3` | VPN down ou mauvaise IP | Vérifier FortiClient, `ping 10.10.111.3` |
| `pg_restore: error: role "neondb_owner" does not exist` | Owners Neon dans le dump | Utiliser `--no-owner --role=samanaffa_app` |
| `database is being accessed by other users` | Connexions actives | `pg_terminate_backend` puis retry |
| `CREATE DATABASE ... TEMPLATE` échoue | Connexions sur `samanaffa_dev` | Terminer toutes les sessions d'abord |
| Comptages différents | Restore partiel | Relire le log `restore_*.log`, re-dump si besoin |
| App ne se connecte pas | Driver Neon-only | Finaliser migration driver `pg` |
| SSL errors depuis le Mac | `sslmode=require` vs serveur sans SSL | Essayer `sslmode=prefer` en dev interne |

---

## 15. Rollback

Si la migration dev échoue :

1. **Ne pas toucher** à Neon (reste la source de vérité).
2. Supprimer `samanaffa_dev` sur db-srv et recommencer Phase 3.
3. Remettre `.env.local` sur l'URL Neon.
4. Conserver les logs dans `/var/lib/everest-migration/logs/` pour analyse.

---

## 16. Journal de migration (à remplir)

| Date (UTC) | Opération | Dump / base | Opérateur | Résultat | Notes |
|---|---|---|---|---|---|
| | Export Neon | | Aliou Wade | | |
| | Transfert scp | | Aliou Wade | | |
| | Restore db-srv | | Aliou Wade | | |
| | Vérif comptages | | Aliou Wade | | |
| | Test app local | | Aliou Wade | | |

---

## 17. Contacts

| Rôle | Nom | Email |
|---|---|---|
| DSI / Chef de projet | Mouhamed Rassoul SEYE | dsi@everestfin.com |
| Développeur applicatif | Aliou Wade | awade@everestfin.com |
| STELLARIX Commercial | David Edem WOGORMEBU | david.wogormebu@stellar-ix.com |
| STELLARIX Support | Niveau 1 | support@stellar-ix.com |

---

## 18. Références

- `project_docs/EVEREST_Deploiement_samanaffa_v2_1.docx` — §10 (PostgreSQL), §16.5.3 (mode opératoire développeur)
- `scripts/db-migrate.ts` — application migrations Drizzle
- `scripts/check-db-branches.ts` — comparaison branches Neon
- `src/lib/db/schema.ts` — schéma Drizzle source de vérité
- `drizzle/` — migrations SQL versionnées

---

## 19. Backlog applicatif livré (staging, juillet 2026)

| Item | Statut |
|---|---|
| Redirect paiement / maintenance (`/portal` autorisé, page `/maintenance`) | ✅ |
| FAQ contact réel | ✅ |
| KYC upload legacy → HTTP 410 | ✅ |
| Admin ADM-004 PROCESSING (transactions) | ✅ |
| Admin ADM-005 suspendre / réactiver utilisateur | ✅ |
| Admin ADM-006 recalcul soldes (dashboard) | ✅ |
| Admin ADM-015 aperçu KYC inline | ✅ |
| Admin ADM-016 lien utilisateurs → KYC | ✅ |
| Admin ADM-017 masquer nav APE/PEE/réconciliation | ✅ |
| Emails échec paiement (Intouch + APE callback) | ✅ |
| `getIntouchCallbackUrl()` + `INTOUCH_CALLBACK_URL` | ✅ |
| Script `migrate-kyc-blob-to-minio.ts` | ✅ |
| CI GitHub Actions (lint, typecheck, test) | ✅ |
| Worker BullMQ (`worker/`) + PM2 | ✅ scaffold |

**Toujours bloquant pour recette srvstage :** `DATABASE_URL` → `10.10.111.3:5432/samanaffa_stage`, mot de passe `samanaffa_app`, creds MinIO DSI, `DIDIT_WEBHOOK_SECRET`, puis `scripts/srvstage-deploy.sh`.

---

*Document vivant — mettre à jour après chaque migration ou changement d'infra.*
