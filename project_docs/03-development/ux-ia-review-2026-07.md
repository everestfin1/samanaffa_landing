# UX / IA review — July 2026

Audit run after the Momar screen set (E0–E8, C1–C8) shipped complete. Every
Figma frame has a route, every internal link resolves. What follows is what to
fix next, ranked.

**Read this first:** batches 1 and 2 are the ones that lose users or mislead
them. Batches 3–5 are quality. Do them in order.

---

## Batch 1 — Onboarding blockers

Users can currently get permanently stuck inside onboarding. Highest priority.

**Estimate: ~1 day.**

### 1.1 Payment step reachable with no deposit to pay

- `src/lib/onboarding/onboarding-deposit-release.ts:4-26` polls up to 12s for
  the intent to flip `awaitingKycApproval: false`.
- On timeout it returns `ready: false`, but `src/app/onboarding/page.tsx:565-575`
  advances to E6 anyway.
- E6 finds no released intent and renders "Aucun versement programmé"
  (`E6Payment.tsx:257-261`) with no path forward.

**Fix:** block the transition when `ready: false`; show a retry state on T5
instead of advancing. Hits slow-network users hardest — i.e. most of the field.

### 1.2 KYC rejection silently destroys the programmed deposit

- `kyc-deposit-intents.ts:14-29` cancels pending intents on `REJECTED`.
- `investorProfile.onboarding.depositAmount` is not cleared, so the UI still
  believes a deposit exists.
- User retries KYC, gets approved, lands on the same empty E6.

**Fix:** clear `depositAmount` and send the user back to T4 on rejection.

### 1.3 Server write succeeds, progress PATCH fails, UI freezes

Same shape in four places — server mutation lands, then the progress call fails
and nothing moves, so the user resubmits against state that already exists.

| Step | Server write | Progress call |
|---|---|---|
| T2 | `T2PersonalInfo.tsx:85-96` | `page.tsx:493-495` |
| E8 | `E8Mandate.tsx:30-50` | `page.tsx:515-520` |
| T4 | `T4Deposit.tsx:57-64` | `page.tsx:541-544` |
| T5→E6 | KYC approved | `page.tsx:572-574` |

T5→E6 is the worst: it throws inside a `setTimeout` callback
(`useDiditKycVerification.ts:63-64`) — unhandled rejection, user frozen on the
KYC success screen with no error shown.

**Fix:** surface the failure with a retry button; make the T5 path `await`-safe.

### 1.4 Refresh on T2 wipes the visible form

Profession and region are saved to the DB but never passed back down —
`page.tsx:489-497` does not set `initialProfession` / `initialRegion`. Fields
render empty and the user retypes.

**Fix:** pass the saved values as props on resume.

### 1.5 Authenticated resume fails silently

`page.tsx:138-139` returns with no error UI when `GET /api/onboarding/progress`
is not OK. A logged-in user sits on T1 and tries to sign up again.

**Fix:** render the existing `progressError` banner on this path.

---

## Batch 2 — Stop showing fake UI as real

Six controls currently imply a working feature. Either wire them or mark them
clearly disabled.

**Estimate: ~half a day.**

1. **C7 email-notifications toggle** (`C7Profil.tsx:94-100`) — flips local state
   only, never calls an API. User believes a preference was saved.
2. **C7 "sessions actives"** (`C7Profil.tsx:150-166`) — fabricated device count
   plus an "arrive bientôt" toast.
3. **C6 "Télécharger"** (`C6Releves.tsx:126`) — a `<span>` styled as a button.
   Not focusable, does nothing. (Catalog itself is already flagged as fictive —
   see [c6-releves-documents-notes.md](./c6-releves-documents-notes.md).)
4. **C5 fees + double confirmation** (`C5Retrait.tsx:180-181`, `246-256`) —
   "à confirmer" placeholder and a static OTP panel wired to nothing.
5. **C3 has no KYC gate** (`C3Alimenter.tsx:19`) — receives `kycStatus` as a prop
   and ignores it. C5 blocks correctly on the same signal. Deposits should at
   minimum warn.

---

## Batch 3 — Navigation & IA

**Estimate: ~half a day.**

1. **Relevés is undiscoverable.** Only reachable from inside a Kondanné detail
   (`C2KondanneDetail.tsx:235-240`). Not in the hamburger. A single-account user
   may never find it. → add to `PortalHeader` nav.
2. **Can't create a second Kondanné from the list.** CTA exists on the dashboard
   and in the empty list state only (`C2KondanneList.tsx:86-95`). → add to the
   populated list and the detail screen.
3. **Three names for one concept.** Nav says "Nattukaay Yéené"
   (`PortalHeader.tsx:78`), screens say "Kondanné" and "Sama Naffa". → pick one.
4. **Payment return pages sit outside the portal.** `payment-success` and
   `payment-failed` render with no header and no session guard, and both dump the
   user on the account list instead of the funded Kondanné or the form they were
   filling (`payment-failed/page.tsx:121`, `payment-success/page.tsx:133`).
5. **Back button behaves three different ways.** C3/C5 navigate explicitly to the
   parent, C6/C7/C8 call `router.back()` (can eject you out of the portal
   entirely), C2 hardcodes its own target. → standardise on explicit targets.

---

## Batch 4 — Errors that look like empty states

**Estimate: ~2 hours.**

1. **C2 transaction fetch swallows errors.** `C2KondanneDetail.tsx:123`, `128-129`
   — non-OK returns early, catch sets `[]`. A backend outage is indistinguishable
   from "no transactions yet."
2. **Dashboard is all-or-nothing.** `dashboard/page.tsx:138-140` — any one of the
   three hooks failing blanks the whole page instead of degrading.
3. **Notifications are not clickable.** `actionUrl` is computed at
   `notifications/page.tsx:235` and never used.
4. **Notifications logout does not sign out.** `notifications/page.tsx:105-107`
   pushes to `/login` without calling `signOut` — session persists.
5. **No offline handling anywhere in the portal.**

---

## Batch 5 — Consistency & accessibility

**Estimate: ~half a day.**

1. **Tutoiement vs vouvoiement mixes inside one session.** "Alimente ton
   Kondanné" (`C3Alimenter.tsx:130`) then "Votre transaction"
   (`payment-success/page.tsx:158`). → pick tutoiement, it matches the brand.
2. **Four currency formatters.** `formatCurrency()` (`utils.ts:114-120`), manual
   `toLocaleString('fr-FR')`, `formatFcfa()` (C5 only), and a bare
   `toLocaleString()`. `PendingOnboardingDepositCard.tsx:83` prints "FCFA" twice
   because it appends the suffix to an already-formatted value.
3. **Same field, two date formats.** Short month on list cards
   (`C2KondanneList.tsx:44-47`), long month on the dashboard
   (`C1Dashboard.tsx:64-67`).
4. **No focus management on onboarding step change** (`page.tsx:454-635`) and no
   `aria-live` on most error messages. Screen-reader and keyboard users lose
   their place on every transition.
5. **`role="link"` without `aria-label`** on the dashboard balance card
   (`C1Dashboard.tsx:180-191`) and C2 cards (`C2KondanneList.tsx:105-116`) —
   destination is never announced.

---

## Dead code to delete

- `src/components/portal/SamaNaffaPortal.tsx` — ~800 lines, imported by nothing.
- `/register` route — zero inbound links, superseded by `/onboarding`.

---

## Open questions for the PM

1. C6 documents: which are real, and on what cadence? (Detail in
   [c6-releves-documents-notes.md](./c6-releves-documents-notes.md).)
2. C5 withdrawal fees: what is the actual rate, and is the double-confirmation
   OTP in scope for v1?
3. Password change currently links to `/forgot-password`
   (`C7Profil.tsx:141`) — is a password even part of an OTP/SMS login product?
4. Is "Nattukaay Yéené" or "Kondanné" the user-facing term in the nav?
