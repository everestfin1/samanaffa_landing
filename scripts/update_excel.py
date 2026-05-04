"""
update_excel.py
---------------
Loads the ORIGINAL BACKUP and writes ONLY data values into the right cells.
No style, no structure, no formatting is touched.
The result is saved to the live file path.
"""
from openpyxl import load_workbook
from copy import copy
from datetime import date

BACKUP = 'project_docs/Gestion projet - Sama Naffa VF.backup-20260429-1229.xlsx'
DEST   = 'project_docs/Gestion projet - Sama Naffa VF.xlsx'

wb = load_workbook(BACKUP)

def v(ws, coord, value):
    """Write only the value of a cell, leaving every style intact."""
    ws[coord].value = value

# ── TABLEAU DE BORD ──────────────────────────────────────────
# Only update the broken KPI row and the sprint objectives/stats.
# All other text, structure and styling are preserved from the backup.
ws = wb['Tableau de Bord']

# Fix broken Total Tâches (was -196) and align counters with backlog
# Backlog: 5 Terminées, 2 En Cours, 7 À Faire, 1 Bloquée = 15 total
v(ws, 'A7', 15)   # Total Tâches
v(ws, 'B7', 7)    # À Faire
v(ws, 'C7', 2)    # En Cours
v(ws, 'D7', 5)    # Terminées
v(ws, 'E7', 1)    # Bloquées
v(ws, 'F7', '=ROUND(D7/A7,2)')  # % Avancement (cell is formatted as %)

# Sprint table: fill objectives, dates and task counts
# Timeline based on today (2026-04-29) and project state

# Sprint 1: covers actual build period Sep 2025 → Feb 2026
# Anchors: first commit Sep 15, 2025; PEE online subscription Feb 03, 2026
v(ws, 'B12', 'Infrastructure, Auth, APE Sénégal, Portail client, Dashboard admin, PEE')
v(ws, 'C12', date(2025, 9, 15))   # Sprint 1: Sep 2025 → Feb 2026 (livré)
v(ws, 'D12', date(2026, 2, 3))
v(ws, 'E12', 5); v(ws, 'F12', 5); v(ws, 'G12', '=ROUND(F12/E12,2)')
v(ws, 'H12', 'Terminé')

# Sprint 2: current — starts today Apr 29, 2026
v(ws, 'B13', 'APE Sénégal, PEE — validation flux Intouch + réconciliation branches + emails')
v(ws, 'C13', date(2026, 4, 29))
v(ws, 'D13', date(2026, 5, 12))
v(ws, 'E13', 4); v(ws, 'F13', 0); v(ws, 'G13', '=ROUND(F13/E13,2)')
v(ws, 'H13', 'En Cours')

v(ws, 'B14', 'Qualité : tests automatisés, ESLint, build, déploiement')
v(ws, 'C14', date(2026, 5, 13))
v(ws, 'D14', date(2026, 5, 26))
v(ws, 'E14', 3); v(ws, 'F14', 0); v(ws, 'G14', '=ROUND(F14/E14,2)')
v(ws, 'H14', 'Planifié')

v(ws, 'B15', 'Sécurité & conformité : 2FA admin, RBAC, RGPD/CDP')
v(ws, 'C15', date(2026, 5, 27))
v(ws, 'D15', date(2026, 6, 9))
v(ws, 'E15', 4); v(ws, 'F15', 0); v(ws, 'G15', '=ROUND(F15/E15,2)')
v(ws, 'H15', 'Planifié')

v(ws, 'B16', 'Performance phase 2 + monitoring Sentry')
v(ws, 'C16', date(2026, 6, 10))
v(ws, 'D16', date(2026, 6, 23))
v(ws, 'E16', 2); v(ws, 'F16', 0); v(ws, 'G16', '=ROUND(F16/E16,2)')
v(ws, 'H16', 'Planifié')


# ── BACKLOG ──────────────────────────────────────────────────
# The template has 15 pre-styled rows (3→17) with Statut/Priorité already set.
# We fill in ID, Titre, Sprint, Module, Responsable, Estimation, Notes only.
ws = wb['Backlog']

tasks = [
    # row, ID,       Titre,                                               Sprint,    Module,           Resp,        Estim, Notes
    (3,  'SN-001', 'Migration du BO Sama Naffa (infra, auth, DB, admin)', 'Sprint 1','Infrastructure', 'Dev Lead',   5,    'Livré sur main — base du projet'),
    (4,  'SN-002', 'Authentification OTP/JWT (email + SMS)',              'Sprint 1','Auth',            'Backend',    3,    'OTP Twilio, NextAuth, sessions, rate limiting'),
    (5,  'SN-003', 'Intégration paiement Intouch — APE Sénégal',         'Sprint 1','APE / Paiement',  'Backend',    4,    'Webhook + fallback manuel, callback, statut'),
    (6,  'SN-004', 'Portail client (inscription, dashboard, KYC)',        'Sprint 1','Portail Client',  'Frontend',   5,    'Multi-étapes, profil, APE, Sama Naffa, notifications'),
    (7,  'SN-005', 'Dashboard admin complet',                             'Sprint 1','Admin',           'Dev Lead',   5,    'KYC review, users, transactions, APE, PEE, réconciliation CSV'),
    (8,  'SN-006', 'Validation flux APE/PEE Intouch bout-en-bout',        'Sprint 2','APE / PEE / QA',  'QA/Backend', 2,    'Formulaire → paiement → statut → DB → email'),
    (9,  'SN-007', 'Réconciliation branches main-2 / tested',             'Sprint 2','Git / Intégration','Dev Lead',  2,    'Porter auth legacy (e0d99e7) + télémétrie (e945a95)'),
    (10, 'SN-008', 'Implémenter 3 notifications email manquantes',        'Sprint 2','Notifications',   'Backend',    2,    'Callbacks Intouch, APE, verify-account (3 TODO dans le code)'),
    (11, 'SN-009', 'Tests automatisés parcours critiques',                'Sprint 3','Qualité',         'QA / Dev',   5,    'Auth, paiement, admin — couverture minimale'),
    (12, 'SN-010', 'Corriger ESLint + valider build (bun run build)',      'Sprint 3','Qualité',         'Dev Lead',   2,    'Dépendance circulaire ESLint, build timeout'),
    (13, 'SN-011', 'Documenter procédure déploiement (Vercel / Coolify)', 'Sprint 3','DevOps',          'DevOps',     1,    'Guide opérationnel pour mise en production'),
    (14, 'SN-012', 'Optimisations performance phase 2',                   'Sprint 5','Performance',     'Frontend',   4,    'Optimistic updates, infinite scroll, images WebP'),
    (15, 'SN-013', 'Conformité RGPD/CDP : export, suppression, portabilité','Sprint 4','Conformité',    'Backend',    4,    'Obligation légale avant ouverture publique'),
    (16, 'SN-014', 'Sécurité : 2FA admin TOTP + RBAC',                   'Sprint 4','Sécurité',        'Backend',    5,    '2FA Google Authenticator + rôles SUPER_ADMIN/SUPPORT/AUDITOR'),
    (17, 'SN-015', 'Migrations Drizzle à valider sur DB de production',   'Sprint 1','Base de données', 'Backend',    1,    '0004_low_miracleman + journal + drizzle-kit push'),
]

# Backlog dates — derived from actual git commit history
backlog_dates = {
    # Sprint 1 completed tasks: dates from actual commits
    3:  (date(2026, 1, 22), date(2026, 1, 27)),  # SN-001: Monorepo migration Jan 22-27, 2026
    4:  (date(2025, 9, 27), date(2026, 1, 24)),  # SN-002: OTP Sep 2025; Better Auth Jan 2026
    5:  (date(2025, 9, 26), date(2025, 12, 11)), # SN-003: Intouch APE Sep→Dec 2025
    6:  (date(2025, 9, 24), date(2025, 10, 3)),  # SN-004: Portail client Sep-Oct 2025
    7:  (date(2025, 12, 3), date(2026, 1, 27)),  # SN-005: Admin v1 Dec 2025 → overhaul Jan 2026
    # Sprint 2 current tasks
    8:  (date(2026, 4, 29), date(2026, 5, 12)),  # SN-006: En cours
    9:  (date(2026, 4, 29), date(2026, 5, 12)),  # SN-007: En cours
    10: (date(2026, 4, 29), date(2026, 5, 12)),  # SN-008: À faire
    # Sprint 3
    11: (date(2026, 5, 13), date(2026, 5, 26)),  # SN-009
    12: (date(2026, 5, 13), date(2026, 5, 26)),  # SN-010
    13: (date(2026, 5, 13), date(2026, 5, 26)),  # SN-011
    # Sprint 5
    14: (date(2026, 6, 10), date(2026, 6, 23)),  # SN-012
    # Sprint 4
    15: (date(2026, 5, 27), date(2026, 6, 9)),   # SN-013
    16: (date(2026, 5, 27), date(2026, 6, 9)),   # SN-014
    # SN-015: DB migration — started Jan 2026, unblocked Apr 29, 2026
    17: (date(2026, 1, 22), date(2026, 4, 29)),
}

for row, tid, titre, sprint, module, resp, estim, notes in tasks:
    v(ws, f'A{row}', tid)
    v(ws, f'B{row}', titre)
    v(ws, f'C{row}', sprint)
    v(ws, f'D{row}', module)
    # E (Statut) and F (Priorité) already set — do NOT overwrite
    v(ws, f'G{row}', resp)
    debut, fin = backlog_dates.get(row, (None, None))
    v(ws, f'H{row}', debut)
    v(ws, f'I{row}', fin)
    v(ws, f'J{row}', estim)
    v(ws, f'K{row}', notes)


# ── SPRINTS ──────────────────────────────────────────────────
# Template already has Sprint 1–5 with correct Statut column.
# Fill objectives and task counts only.
ws = wb['Sprints']

sprint_data = [
    # row, objectif,                                                          total, term, encours, bloq
    # Sprint 1 — actual build: Sep 2025 → Feb 2026
    (3, 'Infrastructure, Auth, APE Sénégal, Portail client, Admin, PEE',       5,    5,    0,       0),
    # Sprint 2 — current: Apr 29 → May 12, 2026
    (4, 'Validation flux APE/PEE Intouch + réconciliation branches + emails',  4,    0,    2,       0),
    # Sprint 3 — May 13 → 26, 2026
    (5, 'Tests automatisés, ESLint/build, documentation déploiement',          3,    0,    0,       1),
    # Sprint 4 — May 27 → Jun 9, 2026
    (6, 'Sécurité : 2FA admin, RBAC, RGPD/CDP, politique confidentialité',     4,    0,    0,       0),
    # Sprint 5 — Jun 10 → 23, 2026
    (7, 'Performance phase 2, monitoring Sentry, optimisations bundle',        2,    0,    0,       0),
]

# Sprint dates — derived from actual commit history and forward planning
sprints_sheet_dates = {
    3: (date(2025, 9, 15), date(2026, 2, 3)),   # Sprint 1: first commit → PEE online sub
    4: (date(2026, 4, 29), date(2026, 5, 12)),  # Sprint 2: current
    5: (date(2026, 5, 13), date(2026, 5, 26)),  # Sprint 3
    6: (date(2026, 5, 27), date(2026, 6, 9)),   # Sprint 4
    7: (date(2026, 6, 10), date(2026, 6, 23)),  # Sprint 5
}

for row, obj, total, term, encours, bloq in sprint_data:
    v(ws, f'B{row}', obj)
    debut, fin = sprints_sheet_dates[row]
    v(ws, f'C{row}', debut)
    v(ws, f'D{row}', fin)
    v(ws, f'E{row}', total)
    v(ws, f'F{row}', term)
    v(ws, f'G{row}', encours)
    v(ws, f'H{row}', bloq)


# ── ROADMAP ──────────────────────────────────────────────────
# Template has rows 3–11 with F (Tâches) and G (% Fait) pre-filled.
# Row 3 (Back office) already has most data. Fill rows 4–11 and update % Fait.
ws = wb['Roadmap']

modules = [
    # row, module,               description,                                                      sprint,    priorité,       statut,                  tâches, pct,  resp
    (3,  'Back office',          'Dashboard admin — KYC, users, transactions, réconciliation CSV', 'Sprint 1','🔴 Critique',  'Livré — En stabilisation', 3,   75,  'Dev Lead'),
    (4,  'APE Sénégal',          'Souscription, paiement Intouch, statut paiement, réconciliation CSV', 'Sprint 2','🔴 Critique','Avancé — À tester',  4,   75,  'Backend'),
    (5,  'PEE',                  'Landing, souscription, paiement Intouch, leads, statut paiement','Sprint 2','🟠 Haute',     'Avancé — À tester',       3,   70,  'Full-stack'),
    (6,  'Authentification',     'OTP email/SMS, password, reset, fallback legacy (à intégrer)',   'Sprint 1-2','🔴 Critique', 'Partiel — 60 %',           5,   60,  'Backend'),
    (7,  'Portail client',       'Inscription, dashboard, profil, Sama Naffa, APE, notifications', 'Sprint 1','🟠 Haute',     'Livré — 80 %',             3,   80,  'Frontend'),
    (8,  'CRM / Télémétrie',     'Brouillons formulaires, events, leads abandonnés (depuis tested)','Sprint 2','� Haute',    'À intégrer — 40 %',        2,   40,  'Full-stack'),
    (9,  'Qualité technique',    'Tests (0%), ESLint, build, TypeScript, CI/CD',                   'Sprint 3','🔴 Critique',  'Insuffisant — 20 %',       3,   20,  'QA / Dev'),
    (10, 'Sécurité / Conformité','2FA admin, RBAC, RGPD/CDP, politique de confidentialité',        'Sprint 4','🟠 Haute',     'Backlog — 10 %',           5,   10,  'Backend / Product'),
    (11, 'Performance',          'Optimistic updates, images WebP, code splitting, Sentry',        'Sprint 5','🟡 Moyenne',   'Backlog — 25 %',           4,   25,  'Frontend / DevOps'),
]

for row, mod, desc, sprint, prio, statut, taches, pct, resp in modules:
    v(ws, f'A{row}', mod)
    v(ws, f'B{row}', desc)
    v(ws, f'C{row}', sprint)
    v(ws, f'D{row}', prio)
    v(ws, f'E{row}', statut)
    v(ws, f'F{row}', taches)
    v(ws, f'G{row}', pct)
    v(ws, f'H{row}', resp)


wb.save(DEST)
print('Done — workbook saved to', DEST)
