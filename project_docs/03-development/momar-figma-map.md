# Momar Figma implementation map

## Source of truth

- Figma file: [Sama-Naffa-UI](https://www.figma.com/design/blKrnZxk8pWEjfPFa2XS9K/Sama-Naffa-UI)
- File key: `blKrnZxk8pWEjfPFa2XS9K`
- Page: `0:1` (`🎨 Components`)
- The `Samanaffa` html.to.design capture is not an implementation target.

## Foundation

| Figma variable | Value | CSS token |
|---|---:|---|
| Mallard | `#263A18` | `--sama-forest` |
| Chartreuse Green 20 | `#2E4620` | `--sama-forest-deep` |
| Battleship Gray | `#8B9880` | `--sama-forest-soft` |
| Norway | `#AEBBA0` | `--sama-norway` |
| Periglacial Blue | `#DCE3D2` | `--sama-periglacial` |
| Marigold | `#C4972F` | `--sama-marigold` |
| Cod Gray | `#1A1A1A` | `--sama-cod-gray` |
| Pearl Bush | `#EEEAE0` | `--sama-pearl-bush` |
| Moon Mist | `#E0DCCF` | `--sama-moon-mist` |
| Cream surface | `#EDF0E6` | `--sama-cream` |
| White | `#FFFFFF` | `--sama-white` |

Typography uses Geist through `next/font`. Buttons are full pills, cards use 14-22px radii, and form controls use soft Moon Mist borders with Marigold focus treatment.

## Onboarding frames

Corrected product sequence (PM, 2026-07-27): **E1 → E2 → E8 → E3 → E4 → E5 (KYC then Intouch) → C1**.

| Badge | Frame | Node | App target | Status |
|---|---|---|---|---|
| E0 | Entrée | `12:302` | `/` landing page and marketing shell | Done |
| E0 | Nattukaay Yéené | `19:463` | `/sama-naffa` simulation (no Kondanné name) | Done |
| E1 | Numéro de téléphone | `10:1904` | `T1Phone` — **first `/onboarding` step** | Done |
| E1· | Vérification OTP | `10:1977` | `T1Phone` OTP step | Done |
| E2 | Informations personnelles | `10:2048` | `T2PersonalInfo` | Done |
| E8 | Mandat + signature | `10:2560` | `E8Mandate` — **after E2** (before Kondanné) | Reordered |
| E3 | Créer un Kondanné | `10:3058` | `E3CreateKondanne` | After E8 |
| E4 | Premier versement | `10:2230` | `T4Deposit` | After E3 |
| E5 | Vérification identité | `10:2317` | `T5KYC` then `E6Payment` (Intouch) | Combined “E5” in product language |
| E5· | Paiement Intouch | `166:185` | `E6Payment` — still frame E6 in Figma | After KYC → then C1 |
| E6 / E7 / E9 | — | — | Not used as separate product steps | — |
| T6 | Success handoff | none | Legacy only; happy path goes **C1** | Deprecated for new users |
| C1 | Tableau de bord | `10:2754` | Portal after payment / skip | Terminal onboarding step |

Internal step ids remain `T1`…`E8`…`E3`…`T4`…`T5`…`E6`…`C1`. Visible progress bar has **7** steps.

## Portal frames

| Badge | Frame | Node | App target | Notes |
|---|---|---|---|---|
| C1 | Tableau de bord | `10:2754` | `C1Dashboard` + Momar `PortalHeader` | Full-bleed `dashboard-bg.jpg` via `C1PageBackground` (`object-fit: cover`); cards over left |
| C2 | Liste Kondanne | `124:43007` | `/portal/sama-naffa` → `C2KondanneList` | Done (Momar cards) |
| C2 | Détail Kondanne | `10:2878` | `/portal/sama-naffa/[accountId]` → `C2KondanneDetail` | Done |
| C3 | Alimenter | `10:2977` | Deposit subflow | Pending (TransferModal wired for now) |
| C3 | Alimenter | `10:2977` | Deposit subflow | Amount and payment |
| C4 | Créer un Kondanne | `10:3058` | Portal create + onboarding `E3CreateKondanne` | Reprend E3; CTA « Je crée mon Kondanné » |
| C5 | Retrait | `10:3131` | Withdrawal subflow | Estimation and OTP confirmation |
| C6 | Relevés & documents | `10:3223` | Statements | Document downloads |
| C7 | Profil & sécurité | `10:3293` | Profile/settings | Account and security settings |
| C8 | Aide & réclamations | `10:3376` | Support | WhatsApp, phone, claims |

## Landing assets

Assets exported from Figma node `12:302` live in `public/figma/e0/`. The implementation uses the transparent source images rather than rasterizing the complete page, preserving responsive behavior and text accessibility.
