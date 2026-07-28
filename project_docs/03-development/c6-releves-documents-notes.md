# C6 Relevés & documents — open points for PM

**Date:** 2026-07-28  
**Screen:** `/portal/releves` (`C6Releves`, Figma `10:3223`)  
**Status:** UI shipped with **explicitly mocked** document rows until real PDFs exist.

---

## Why the Figma catalog is wrong for production

The Momar frame shows:

- Relevé trimestriel — juin 2026  
- Relevé trimestriel — mai 2026  
- Compte-rendu de gestion — S1 2026  

### Product / CGU reality (`src/lib/legal/cgu.ts`)

| Promised | Cadence |
|---|---|
| **Relevé de compte** | Available anytime in the app |
| **Relevé périodique** | At each **Date Anniversaire**, and after each **opération significative** |
| Dashboard | Mentions téléchargeable account statements |

CGU does **not** promise a client-facing “compte-rendu de gestion” (semestriel or otherwise).

### Concrete mismatches

1. **“Trimestriel” + month label** — inconsistent; May + June are consecutive months, not quarters.  
2. **New accounts** — most users have no May/June history; showing those rows is false inventory.  
3. **Compte-rendu de gestion S1** — reads like internal / AMF reporting, not a portal download.  
4. **Fixed file sizes** (210 Ko, etc.) — invented metadata.

Fees being **trimestriels** (gestion / valorisation) may have inspired the design wording, but fee cadence ≠ document cadence in the CGU.

---

## What *should* appear when docs are real

Prefer deriving the list from account activity / stored assets:

1. **Relevé de compte** (on demand / after dépôt–retrait)  
2. **Relevé périodique** at Date Anniversaire  
3. **Mandat de gestion signé** (signature already persisted to R2)  
4. Optional: **reçus de versement** per completed Intouch deposit  

Keep the **reconduction** banner — that matches CGU (rappel ~30 jours, puis ~5 jours avant échéance).

---

## Current UI choice (interim)

- Keep Figma-like rows for layout review, but **label + fade them as mocked**.  
- Downloads do not serve real PDFs; they only surface a “bientôt disponible” hint.  
- Empty / real list should replace mocks once generation is wired.

---

## Questions to bring to the next meeting

1. Confirm document set with legal/ops: relevé de compte only, or also signed mandat + payment receipts?  
2. Is any “compte-rendu de gestion” ever client-facing, or admin/AMF only?  
3. Cadence: anniversary + significant ops only, or also calendar quarter statements?  
4. Who generates PDFs (batch job vs on-demand), and where are they stored (R2)?  
