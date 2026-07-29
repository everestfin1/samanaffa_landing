# Email confirmation — deferred for PM

**Updated:** 2026-07-29  
**Decision:** PM does not want in-app email confirmation UI shown yet.  
**Working tree:** readiness pack **stashed**; committed backend kept; onboarding notices **hidden**.

---

## What’s live on `staging` (after stash)

| Layer | Behaviour |
|---|---|
| Backend | Still parks `pendingEmail`, sends confirmation link, binds on GET link open (`a2d181a`) |
| In-app UI | Notices **off** via `SHOW_EMAIL_CONFIRMATION_UI = false` in `src/app/onboarding/page.tsx` |
| Portal / C7 | Email change still blocked; no resend / interstitial pages |

Users may still receive the confirmation email in staging; the app simply doesn’t mention it.

---

## Stash to restore later

```text
stash@{0}: wip(email): confirmation readiness pack (deferred — PM hide)
```

Restore:

```bash
git stash list   # confirm index
git stash apply stash@{0}   # or pop when ready
# then set SHOW_EMAIL_CONFIRMATION_UI = true (or remove the flag after unstash)
```

Contains (uncommitted at stash time):

- `src/lib/pending-email.ts`, `src/lib/email-utils.ts`
- `POST /api/onboarding/email/request` (resend / change)
- Confirm interstitial `/confirm-email` + result page; confirm API POST-only mutation
- Onboarding `EmailConfirmationBanner`, C7 editable email row
- Portal `/api/portal/profile/complete` via pending flow
- `emailVerify` rate limit + generic taken-email message
- Session `update()` on result page

---

## Review findings to fix when unstashing

From Bugbot + Security Review on the stashed pack (not fixed before stash):

1. **High** — `confirmPendingEmail` “already” path: if email matches but `emailVerified` is false, still set verified + clear pending.
2. **Medium** — profile PATCH shallow `investorProfile` spread can wipe `pendingEmail`.
3. **Medium** — onboarding resume must clear local `pendingEmail` when server returns null.
4. **Medium (security)** — on successful bind, call `bumpSessionVersion(user.id)`.

---

## Re-enable checklist (PM go-ahead)

1. `git stash apply` the readiness pack (resolve conflicts if CCU/portal moved).
2. Flip `SHOW_EMAIL_CONFIRMATION_UI` to `true` (or delete the flag after banner component lands).
3. Fix the four review items above.
4. Smoke: signup → email → interstitial POST → result → session email updates; C7 resend/change; portal complete pending path.
