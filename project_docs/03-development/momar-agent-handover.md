# Momar Figma redesign — agent handover

**Updated:** 2026-07-28 (C4 + C7 + C8 portal sprint)  
**Branch:** `staging`  
**Source of truth:** [Sama-Naffa-UI](https://www.figma.com/design/blKrnZxk8pWEjfPFa2XS9K/Sama-Naffa-UI) (`blKrnZxk8pWEjfPFa2XS9K`)

Pair with [momar-figma-map.md](./momar-figma-map.md).

---

## Corrected onboarding sequence (PM)

Figma badges were wrong. **Ship this order:**

```
E1 (phone/OTP) → E2 (infos) → E8 (mandat + signature)
  → E4 (premier versement) → E5 (KYC Didit → paiement Intouch) → C1
```

(E3 Kondanné creation removed from onboarding happy path — default Sama Naffa account.)

---

## Portal status

| Step | Node | Target | Status |
|------|------|--------|--------|
| C2 Liste | `124:43007` | `/portal/sama-naffa` | Done |
| C2 Détail | `10:2878` | `/portal/sama-naffa/[accountId]` | Done |
| C3 Alimenter | `10:2977` | `/portal/sama-naffa/[accountId]/alimenter` | Done |
| C4 Créer | `10:3058` | `/portal/sama-naffa/creer` (reuses `E3CreateKondanne`) | Done → `POST /api/accounts` |
| C5 Retrait | `10:3131` | `/portal/sama-naffa/[accountId]/retrait` | Done |
| C6 Relevés | `10:3223` | `/portal/releves` | Done (mocked docs; see notes) |
| C7 Profil | `10:3293` | `/portal/profile` → `C7Profil` | Done |
| C8 Aide | `10:3376` | `/portal/aide` → `C8Aide` | Done |

---

## Open PM notes

- **C6 documents:** Figma catalog ≠ CGU. → [c6-releves-documents-notes.md](./c6-releves-documents-notes.md).
- **C7:** Email address change still blocked server-side; SMS toggle maps to `marketingAccepted`. 2FA shown as OTP-login (read-only on). Multi-session management not wired.

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
