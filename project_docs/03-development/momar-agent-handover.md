# Momar Figma redesign — agent handover

**Updated:** 2026-07-27 (PM sequence correction)  
**Branch:** `staging`  
**Source of truth:** [Sama-Naffa-UI](https://www.figma.com/design/blKrnZxk8pWEjfPFa2XS9K/Sama-Naffa-UI) (`blKrnZxk8pWEjfPFa2XS9K`)

Pair with [momar-figma-map.md](./momar-figma-map.md).

---

## Corrected onboarding sequence (PM)

Figma badges were wrong. **Ship this order:**

```
E1 (phone/OTP) → E2 (infos) → E8 (mandat + signature)
  → E3 (Créer Kondanné) → E4 (premier versement)
  → E5 (KYC Didit → paiement Intouch) → C1 (portal dashboard)
```

| Product | Internal step | Component |
|---------|---------------|-----------|
| E1 | `T1` | `T1Phone` |
| E2 | `T2` | `T2PersonalInfo` |
| E8 | `E8` | `E8Mandate` |
| E3 | `E3` | `E3CreateKondanne` |
| E4 | `T4` | `T4Deposit` |
| E5 vérif | `T5` | `T5KYC` |
| E5 paiement | `E6` | `E6Payment` |
| C1 | `C1` | `/portal/dashboard` |

- **No T6** on the happy path (legacy `T6` still resumes → portal).  
- **T2B** contact/consents is **not** in this PM sequence — leave unwired.  
- Progress bar: **7** visible steps.  
- Gates: mandat **before** KYC; KYC required before payment/`C1`; deposit required for `T5`/`E6`/`C1`.

Key files: `src/app/onboarding/page.tsx`, `src/lib/onboarding-progress.ts`, `src/app/api/onboarding/progress/route.ts`.

---

## Portal next

| Step | Node | Target |
|------|------|--------|
| C2 Liste | `124:43007` | `/portal/sama-naffa` |
| C2 Détail | `10:2878` | Kondanné detail |
| C3+ | see map | Alimenter → … |

---

## C1 background rules

- `public/figma/c1/dashboard-bg.jpg` via `C1PageBackground` (`object-fit: cover`, full-bleed)  
- No inset framed page shell  

---

## Do / don’t

| Do | Don’t |
|----|--------|
| Follow PM order above | Put mandat after payment |
| End at C1 after Intouch | Insert T6 celebration for new users |
| Update map when screens land | Use html.to.design as truth |
