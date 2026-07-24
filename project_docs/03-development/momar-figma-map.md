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

| Badge | Frame | Node | App target | Status |
|---|---|---|---|---|
| E0 | Entrée | `12:302` | `/` landing page and marketing shell | Implement first |
| E0 | Nattukaay Yéené | `19:463` | `/sama-naffa` (replaces old T0 simulator) | First product step before `/onboarding` |
| E1 | Numéro de téléphone | `10:1904` | `T1Phone` — **first `/onboarding` step** | Aligned via Figma MCP Bridge |
| E1· | Vérification OTP | `10:1977` | `T1Phone` OTP step | Aligned via Figma MCP Bridge |
| E2 | Informations personnelles | `10:2048` | Profile fields | Existing Figma frame |
| E3 | Project simulator | shared | `19:463`, reused by C4 | No dedicated E3 frame |
| E4 | Premier versement | `10:2230` | Deposit step | Existing Figma frame |
| E5 | Vérification identité | `10:2317` | Didit KYC step | Include sibling `10:2344` |
| E6 | Not present | none | Infer only if required | Missing from Figma |
| E7 | Not present | none | Infer only if required | Missing from Figma |
| E8 | Mandat + signature | `10:2560` | Mandate/signature step | Existing Figma frame |
| E9 | Not present | none | Infer only if required | Missing from Figma |
| E5 label collision | Paiement Intouch | `166:185` | Payment step | Content indicates payment; badge is likely wrong |

## Portal frames

| Badge | Frame | Node | App target | Notes |
|---|---|---|---|---|
| C1 | Tableau de bord | `10:2754` | `/portal/dashboard` | KYC status banner |
| C2 | Liste Kondanne | `124:43007` | `/portal/sama-naffa` | Empty design shell; infer from detail |
| C2 | Détail Kondanne | `10:2878` | Kondanné detail | Balance, stats, actions, history |
| C3 | Alimenter | `10:2977` | Deposit subflow | Amount and payment |
| C4 | Créer un Kondanne | `10:3058` | Create subflow | Reuses E3 simulator |
| C5 | Retrait | `10:3131` | Withdrawal subflow | Estimation and OTP confirmation |
| C6 | Relevés & documents | `10:3223` | Statements | Document downloads |
| C7 | Profil & sécurité | `10:3293` | Profile/settings | Account and security settings |
| C8 | Aide & réclamations | `10:3376` | Support | WhatsApp, phone, claims |

## Landing assets

Assets exported from Figma node `12:302` live in `public/figma/e0/`. The implementation uses the transparent source images rather than rasterizing the complete page, preserving responsive behavior and text accessibility.
