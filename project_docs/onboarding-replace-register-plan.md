# Plan: Replace `/register` with the New Onboarding Flow

## Objective

Make `/onboarding` the primary account-creation flow and deprecate the legacy `/register` flow.

The precise model is:

- **`/onboarding` is the new registration flow** — it replaces `/register`.
- **Registration = T0 → T1 → T2 → T3 → T4 → T5 → T6** (see steps below). The user is authenticated after T1 (OTP) and the flow continues in-page through deposit intent and KYC. Redirect to `/portal/dashboard` happens only at T6.
- **Profile completion (extra fields) happens after first login**, inside the portal via a non-dismissible popup that collects: lastName, email (replaces placeholder), address, date of birth, profession, terms, privacy.
- **Deposit intent (T4) and KYC (T5) are part of the `/onboarding` flow**, not the portal.
- **`/register` is deprecated** — all CTAs point to `/onboarding`.

### Onboarding step sequence

| Step | Screen | Auth required | What happens |
|------|--------|--------------|-------------|
| **T0** | Savings simulator | No | User picks life project + plays with sliders. No data saved. |
| **T1** | Phone + OTP | No → becomes Yes | Verifies OTP, creates user + Sama Naffa + APE accounts. `signIn()` called client-side to establish session. |
| **T2** | First name | Yes | PATCHes `users.firstName`. |
| **T3** | Investor quiz | Yes | 3 questions → recommends Formule. Stores `investorProfile` JSON. |
| **T4** | Deposit intent | Yes | User picks amount; payment is **Intouch only** (programmed, not charged). Creates `transaction_intent` with `awaitingKycApproval=true`. Confirmed via Intouch on Sama Naffa after KYC. |
| **T5** | KYC (Didit) | Yes | Opens Didit in a new tab. Polls for status. |
| **T6** | Congratulations | Yes | Summary screen. CTA → `/portal/dashboard`. |

### Portal post-login popup

| Modal | Trigger | Dismissible |
|-------|---------|------------|
| `ProfileCompletionModal` | Missing: lastName, real email, DOB, address, city, country, profession, terms, privacy | No (mandatory) |

## Current status (2026-05-20)

- `signIn()` runs after T1 via server-issued **post-signup token** (no `signIn(register)` bypass).
- Full in-flow onboarding: T0 → T1 → T2 → T3 → T4 → T5 → T6 (`/onboarding/page.tsx`).
- T4 creates a deposit `transaction_intent` with `awaitingKycApproval=true` and `paymentMethod=intouch` only (no charge).
- After KYC approval, the user confirms payment via **Intouch** on Sama Naffa (`OnboardingDepositModal` / `confirmDeposit=1`).
- Didit KYC: shared `useDiditKycVerification` + `DiditKycStagePanels` (onboarding T5 + portal modal).
- Progress is persisted in `users.investorProfile.onboarding` via `/api/onboarding/progress` (client cannot set `kycApproved`).
- Post-login **ProfileCompletionModal** on dashboard and Sama Naffa when profile incomplete.
- Login is **phone OTP only** (password routes deprecated).
- `/register` redirects to `/onboarding`.
- Security trackers: [auth-issues.md](./issues/auth-issues.md), [onboarding-issues.md](./issues/onboarding-issues.md).

---

## Critical backend readiness tasks

### 1. ~~Establish session after OTP~~ ✅ Done (superseded plan)

Session is established after T1; T2–T6 remain in `/onboarding` (not moved to portal-only).

---

### 2. Replace all `/register` entry points with `/onboarding`

**Problem**

Several parts of the app still route users to `/register`.

Known references:

- `src/app/login/page.tsx`
- `src/app/page.tsx`
- `src/components/Navigation.tsx`
- `src/components/SamaNaffa/SavingsPlanner.tsx`
- `src/components/modals/KYCVerificationModal.tsx`
- `src/components/kyc/KYCStatusHandler.tsx`

**Plan**

- Update user-facing registration CTAs to `/onboarding`.
- Keep `/register` temporarily as a redirect to `/onboarding`.
- After validation, archive or remove old register-only components/routes.

**Acceptance criteria**

- No active CTA sends new users to `/register`.
- Visiting `/register` redirects to `/onboarding`.
- Existing login links remain unaffected.

---

### 3. Decide how to handle email before profile completion

**Problem**

`users.email` is currently `NOT NULL` and `UNIQUE`, so the onboarding flow uses a placeholder email like `<phone>@onboarding.samanaffa.tmp`.

**Impact**

- Admin views may show fake emails.
- KYC/email notifications may attempt to send to a fake address.
- Later email capture requires careful update logic.

**Plan**

Short-term:

- Keep placeholder email only as an internal technical value.
- Suppress email notifications for `.tmp` emails.
- In profile-completion popup, ask for real email and update the user.

Medium-term:

- Consider a migration to make `users.email` nullable if business rules allow phone-first accounts.

**Acceptance criteria**

- No email is sent to `.tmp` addresses.
- The portal popup prompts for a real email when missing/placeholder.
- Real email update checks uniqueness before saving.

---

### 4. Add onboarding/profile-completion status tracking

**Problem**

The new model creates accounts before full registration data is complete, but the database does not clearly distinguish between:

- Account created
- Basic profile complete
- Legal consent complete
- KYC complete
- First deposit intent created

**Plan**

Add explicit tracking, either as columns or JSON metadata:

- `profileCompletionStatus`
- `profileCompletionStep`
- `profileCompletedAt`
- `termsAcceptedAt`
- `privacyAcceptedAt`
- `signature`

If schema changes are too large for now, start with a lightweight computed status in the portal based on existing fields.

**Acceptance criteria**

- Portal can determine whether to show the completion popup.
- Admin can identify incomplete accounts.
- A user can resume completion without creating a duplicate account.

---

### 5. Build the post-account profile completion popup (real onboarding)

**Problem**

The new registration flow (`/onboarding`) intentionally collects only phone number. First name, last name, email, address, legal consents, and other legacy registration fields are missing from the created account.

**Plan**

Create an authenticated portal popup/modal that appears when required fields are missing. This is the **real onboarding** that happens after login.

Recommended fields (in order):

1. **First name** (if not collected during registration)
2. **Last name**
3. **Email** (replaces placeholder `.tmp` email)
4. **Date of birth**
5. **Country / City / Address**
6. **Employment status / Profession**
7. **Terms acceptance** (required)
8. **Privacy acceptance** (required)
9. **Marketing consent** (optional)

KYC identity verification (Didit) is triggered from the portal, not from `/onboarding`.
Deposit intent creation is also a portal action, not part of pre-login registration.

The old `/onboarding` components T2, T3, T4, T5, T6 are repurposed or rebuilt for the portal popup context.

**Acceptance criteria**

- Popup appears after account creation if required profile fields are missing.
- Popup can be dismissed only if business rules allow partial accounts.
- Completed data persists to the `users` table.
- Email uniqueness and format are validated server-side.

---

### 6. Harden onboarding mutation endpoints

**Problem**

Current onboarding APIs trust `userId` from the client.

Affected endpoints:

- `/api/onboarding/profile`
- `/api/onboarding/deposit-intent`
- `/api/onboarding/kyc/start`

**Plan**

Once auto-login is added, use the authenticated NextAuth session for these endpoints instead of trusting client-provided `userId`.

**Acceptance criteria**

- API uses `getServerSession(authOptions)` where possible.
- Requests can only mutate the current authenticated user.
- Client no longer needs to send `userId` for authenticated post-T1 steps.

---

### 7. Improve login compatibility for phone-first users

**Problem**

Phone-first onboarding users may not have a password yet.

**Current behavior**

The login page supports OTP login, but the UX is imperfect:

- The main form requires a password.
- The “Connexion par code OTP” button switches to OTP mode but does not immediately send a code.

**Plan**

- Make phone OTP login a first-class option.
- When the user chooses OTP login, send the OTP immediately after validating phone/email.
- Keep password login for users who set a password later.

**Acceptance criteria**

- A phone-only user can log in cleanly with OTP.
- No password is required for phone-first accounts.
- Mock OTP behavior works in development.

---

### 8. Make KYC and deposit state resumable in the portal

**Problem**

If a user starts KYC or creates a deposit intent in the portal popup and then refreshes or navigates away, state is lost.

**Impact**

- Pending KYC sessions and deposit intents may be left orphaned.
- User does not know where they left off.

**Plan**

- Store `profileCompletionStatus` on the `User` model.
- In the portal dashboard, check this status on every load.
- If incomplete, show the popup resuming from the last completed step.
- KYC status and deposit intents are already persisted; the popup just needs to read them.

**Acceptance criteria**

- Portal popup resumes from the last incomplete step after refresh.
- User does not need to re-enter data already saved.
- Pending KYC/deposit state is visible and actionable in the portal.

---

### 9. Add cleanup for abandoned intents/sessions

**Problem**

A deposit intent can be created before KYC completion. If the user abandons the flow, it may remain pending indefinitely.

**Plan**

- Add a scheduled cleanup or admin-visible stale state for old pending intents.
- Define a business rule, e.g. cancel pending onboarding deposit intents after 7 days if KYC was never completed.

**Acceptance criteria**

- Stale pending intents are not silently left forever.
- Admin dashboard can distinguish active vs abandoned onboarding intents.

---

## Recommended implementation order

### Batch 1 — Registration route replacement

1. Auto-login after onboarding OTP verification in `T1Phone.tsx`.
2. Redirect to `/portal/dashboard` immediately after T1 success.
3. Remove T2–T6 from the `/onboarding` page (they move to portal popup).
4. Redirect `/register` to `/onboarding`.
5. Replace all `/register` CTAs with `/onboarding`.

### Batch 2 — Post-login profile completion (portal popup)

1. Add `profileCompletionStatus` / `profileCompletionStep` to `User` model.
2. Build authenticated profile completion API (`/api/portal/profile/complete`).
3. Add portal popup component that collects: firstName, lastName, email, DOB, address, profession, terms, privacy.
4. Suppress email notifications for `.tmp` placeholder emails.

### Batch 3 — Portal-integrated KYC and deposit

1. Move KYC initiation (`T5KYC`) to portal popup or dashboard.
2. Move deposit intent creation (`T4Deposit`) to portal.
3. Ensure KYC and deposit APIs use authenticated session, not client `userId`.
4. Add resumability: portal popup reads persisted state and resumes from last step.

### Batch 4 — Security and cleanup

1. Harden all portal APIs with `getServerSession(authOptions)`.
2. Add stale intent cleanup for abandoned deposit intents.
3. Keep `/register` redirect for one release, then remove legacy register components/routes.

---

## Definition of done

The replacement is ready when:

- New users create an account with phone OTP from `/onboarding`.
- Sama Naffa + APE accounts are created immediately after OTP verification.
- User is authenticated immediately and lands on `/portal/dashboard`.
- `/onboarding` contains only T0 (simulator) and T1 (phone OTP); T2–T6 are removed.
- `/register` redirects to `/onboarding`.
- All public registration CTAs point to `/onboarding`.
- Portal shows a "Complete your profile" popup for missing firstName, lastName, email, address, DOB, profession, terms, privacy.
- Placeholder emails do not receive notifications.
- KYC and deposit are portal features, not part of pre-login registration.
- KYC/deposit state is resumable in the portal and stale intents are cleaned up.
