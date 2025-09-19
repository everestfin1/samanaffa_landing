# Client Portal Specification (Sama Naffa & APE Senegal)

Version: 1.0  
Date: 2025-09-17  
Scope: Authenticated client experience that bridges Sama Naffa (managed savings) and APE Senegal (government bond) pre‑investment journeys.

## 1. Objectives

- Provide an engaging, mobile‑first portal for authenticated users to plan, simulate, and track savings and APE bond intentions before the full mobile app launch.
- Convert education and calculator engagement into qualified registrations with progressive profiling and KYC readiness.
- Unify user profile, preferences, notifications, and saved scenarios across both product tabs.

Related docs:
- Architecture: `project_docs/ARCHITECTURE.md`
- Platform context: `project_docs/more_info.md`
- APE context: `project_docs/APE_SENEGAL_PROJECT_CONTEXT.md`
- Sama Naffa context: `project_docs/SAMA_NAFFA_PROJECT_CONTEXT.md`

## 2. Roles & Access

- **Public Visitor**: Read‑only landing, basic calculators (outside this spec).
- **Client User (Authenticated)**: Access to this Client Portal via OTP-based authentication.
- **Admin (Super)**: Separate Admin Portal with JWT-based authentication (outside this spec).

### Authentication Flow
- **Registration**: Email/phone + OTP verification
- **Login**: Email/phone + OTP verification (no passwords)
- **Session Management**: NextAuth.js with JWT tokens
- **Account Creation**: Auto-creates both Sama Naffa and APE accounts

## 3. Information Architecture

Top‑level navigation for authenticated users:
- Dashboard (overview)
- Sama Naffa tab
- APE Senegal tab
- Profile & Preferences
- Notifications

Mobile: bottom tab bar with up to 5 items; secondary items in a drawer.

## 4. Features — Sama Naffa (Client Portal)

### 4.1 MVP (Phase 2)

- Overview dashboard widgets (SN context)
  - Welcome card with name and last activity
  - Registration/KYC status indicator
  - Quick actions: Create savings goal, Start challenge, Open tontine calculator
  - Notifications center preview (latest 3)

- Profile management (shared)
  - Name, phone, email; verification states
  - Language preference (FR, EN; Wolof phased)
  - Communication settings (email/SMS), interests (SN, APE)

- Savings goal manager
  - Create goals: title, target amount, target date, monthly contribution suggestion
  - Visual progress (chart) and projected growth with tiered rates (per SN context)
  - Save/share results; mark favorites

- Savings challenges
  - 52‑week, weekly, daily micro‑challenges simulators
  - Streaks, progress bar, and achievement badges

- Joint accounts (preview)
  - Virtual group setup (name, target, member placeholders)
  - Individual contribution tracking (mock data)
  - Simple approval flow simulation

- Tontine calculator
  - Inputs: group size, contribution, frequency, duration
  - Outputs: rotation schedule, payout estimates, reliability/risk hints
  - Join waitlist/register interest

- Financial education (SN)
  - Learning modules: banking basics, savings strategies, community finance
  - Track module completion percentage

- Financial health scorecard
  - Savings rate, DTI estimate, goal coverage, basic recommendations
  - Monthly snapshot archive

### 4.2 Next (Post‑MVP)

- Wallet preview: simulated balance, QR preview, currency converter
- Group communications: basic feed/messages for joint/tontine groups
- Leaderboards and stories: anonymized rankings, success story sharing
- Portfolio simulator: risk tolerance, allocation suggestions, local opportunities

## 5. Features — APE Senegal (Client Portal)

### 5.1 MVP (Phase 2)

- APE dashboard
  - Highlight card (current terms), saved scenarios, next steps panel

- Advanced bond calculator
  - Amount input (min 10,000 XOF; max guardrails)
  - Term selection (3/5/7/10 years)
  - Semi‑annual interest accrual display; maturity value projection
  - Basic tax note and explanatory tooltips

- Scenario saving & comparison
  - Save named scenarios; compare side‑by‑side; export/share summary

- Investment readiness & checklist
  - Eligibility self‑check; documentation checklist; status timeline

- Pre‑investment wishlist
  - Save preferred terms, reminders, calendar nudges for key dates

- Education center (APE)
  - Program overview, investment guide, FAQs; track completion

- Status tracking
  - Pre‑registration status, required actions, reminders, notification opt‑ins

### 5.2 Next (Post‑MVP)

- Strategy planner: laddering, lump‑sum vs periodic comparison, allocation guidance
- Market analysis: historical performance charts, rate trends, inflation impact
- Timing advisor: simple indicators and insights
- Portfolio integration: combine APE with SN savings for holistic planning

## 6. Cross‑Tab Unified Experience

### 6.1 MVP (Phase 2)

- Unified profile & preferences shared across tabs
- Holistic quick view on dashboard: total goals vs APE plans
- Comparative tools: SN savings vs APE returns; risk/liquidity comparisons
- Notifications center: unified queue with filters (SN/APE)

### 6.2 Next (Post‑MVP)

- Holistic financial dashboard: combined health score, integrated goal tracking
- PWA enhancements: offline reading for saved content, queued actions
- Admin‑configured presets: calculator parameters delivered via CMS

## 7. UX, Accessibility, and i18n

- Mobile‑first; touch targets ≥ 44px; responsive across breakpoints
- Accessibility: semantic HTML, ARIA labels, focus management, contrast
- Internationalization: FR and EN at MVP; Wolof phased; localized numerals/currency
- Interactions: clear validation, errors/success messaging, loading states

## 8. Data Model (High‑Level)

Entities (suggested; finalized with backend):
- UserProfile: id, name, phone, email, verification, language, notification prefs
- Preferences: interests, riskTolerance, featureFlags
- SavedCalculations
  - SamaNaffaGoal: title, targetAmount, targetDate, monthlyContribution, projection
  - SavingsChallenge: type, schedule, progress, achievements
  - JointAccountPreview: groupName, targetAmount, members (placeholders), approvals
  - TontineConfig: groupSize, frequency, contribution, schedule, riskHints
  - ApeScenario: amount, term, interestRate, maturity, semiAnnualSchedule
- WishlistItem: product (APE), term, reminders
- EducationProgress: moduleId, percentComplete, completedAt
- KYCState: status, requiredDocs, timeline
- Notification: type, channel, payload, readAt

Data notes:
- Use RLS to restrict rows to the owning user. Encrypt PII at rest.
- Store calculator parameter presets in admin‑managed config for consistency.

## 9. Permissions & Security

- Auth: OTP login (phone/email), secure session with rotation
- RBAC: client role for portal; admin is separate
- Data protection: AES‑256 at rest, TLS 1.3 in transit
- Audit: key actions logged (login, profile updates, saves, deletions)
- Rate limiting: login attempts and API usage

## 10. Performance & SLOs

- Page load: < 2s on 3G for core portal views
- Calculator response: < 1s for standard computations
- UI responsiveness: interaction latency < 100ms for common actions

## 11. Analytics & KPIs Mapping

Event taxonomy (examples):
- auth_login, auth_verify
- profile_update, language_change
- sn_goal_create, sn_goal_save, sn_challenge_start, sn_challenge_progress
- sn_tontine_calculate, sn_joint_preview_create
- ape_calc_run, ape_scenario_save, ape_compare_view, ape_wishlist_add
- education_module_open, education_module_complete
- kyc_checklist_view, kyc_status_update
- notification_opt_in, notification_open, notification_click

Dashboards (client‑facing impact):
- Calculator usage, saved scenarios, module completion, readiness score trends

## 12. Roadmap

### Phase 2 (MVP for Client Portal)
- Authenticated portal shell with tabs and dashboard
- SN: profile, savings goals, challenges, tontine calculator, education, scorecard
- APE: advanced calculator, scenario saving, readiness checklist, wishlist, education
- Cross‑tab: unified profile, notifications, comparative tools

### Post‑MVP (Phases 5+)
- Strategy planner, market analysis, laddering (APE)
- Wallet preview, group communications, leaderboards, portfolio simulator (SN)
- Holistic dashboard, PWA offline features, CMS‑driven presets

Dependencies:
- Backend APIs for auth, profile, saves, notifications, analytics
- Admin CMS for content and calculator parameters

## 13. Acceptance Criteria (Samples)

- Users can create at least one SN savings goal and see a projection based on tiered rates.
- Users can run an APE calculation (3/5/7/10y) with semi‑annual interest and save the scenario.
- Education modules track completion and persist progress across sessions.
- Unified notifications display across SN and APE; users can opt‑in/out by channel.
- All portal pages are usable on a 360px‑wide device and meet basic a11y checks.

## 14. Open Questions

- Exact interest tier boundaries and formulas for SN projections (confirm authoritative table).
- APE tax treatment by user residency for displayed net returns (informational vs advisory).
- Final OTP provider(s) and rate limits per channel; session strategy (JWT vs httpOnly cookies).
- Data retention policies for saved simulations pre‑mobile‑app launch.


