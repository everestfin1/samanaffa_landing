# Momar Figma redesign — agent handover

**Updated:** 2026-07-29 (CCU legal swap committed; email confirmation UI deferred)  
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

**Momar screen set for portal: complete.** Remaining work is polish, real C6 docs, and legal/product rule alignment — not new empty routes from Figma.

---

## Legal / CCU (committed)

- Staging pack landed in `12b7dd7` — see [legal-gap-ccu-2026-07.md](./legal-gap-ccu-2026-07.md).
- `/terms` = CCU draft + amber banner; `/privacy` = privacy `(2)` + banner.
- Soft yield labels (net / non garanti). Rate grids kept until legal blocker #4.
- Product-rule changes (residency, KYC 30d, questionnaire, withdrawals, etc.) **deferred**.

---

## Email confirmation (deferred — PM)

- **In-app UI hidden** (`SHOW_EMAIL_CONFIRMATION_UI = false` on onboarding).
- Backend pending-email + link send still active (from `a2d181a`).
- Full readiness pack (resend, interstitial POST, C7 edit, rate limits) in **git stash** — see [email-confirmation-deferred.md](./email-confirmation-deferred.md).

---

## Open PM notes

- **C6 documents:** Figma catalog ≠ CCU. → [c6-releves-documents-notes.md](./c6-releves-documents-notes.md).
- **C7:** Email address change blocked until confirmation UI is unstashed; SMS toggle → `marketingAccepted`. 2FA = OTP login (read-only). Multi-session not wired.
- **Legal blockers:** 4 items in legal-gap doc (publishable texts? CDP placeholders? acceptance UX? rate grid?).
- **UX/IA:** ranked follow-ups in [ux-ia-review-2026-07.md](./ux-ia-review-2026-07.md).

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
| Keep email confirmation UI off until PM says go | Unstash readiness pack without fixing review findings |
