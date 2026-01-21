# Plan — Form Draft Auto-Save & Abandoned Lead Analytics

**Status:** Proposed

## 1. Objective

Capture form intent and progress across pages (even without final submission) to:

- Improve funnel analytics (drop-off points, validation friction, step completion)
- Persist drafts for a smoother UX (restore progress)
- Surface **abandoned leads** in the back-office (BO) for follow-up

This plan applies to the current Next.js (App Router) monolith and existing forms (APE, PEE, Register).

## 2. Scope (initial)

### 2.1 Forms in scope

- **APE subscription form** (`src/components/APE/ContactForm.tsx`)
- **PEE lead form** (`src/components/PEE/LeadForm.tsx`)
- **Registration flow** (`src/app/register/page.tsx`)

### 2.2 What we capture

- **Draft snapshot** (partial payload for BO + restore UX)
- **Event stream** (analytics events without needing final submit)

## 3. High-Level Architecture

### 3.1 Client-side (Form Telemetry)

A lightweight client module/hook responsible for:

- Generating and persisting identifiers:
  - `anonymous_id` (stable across sessions, stored client-side)
  - `session_id` (rotating session identifier)
  - `form_instance_id` (per render/open)
- Capturing events:
  - `form_viewed`, `form_started`, `step_viewed`, `field_changed`, `field_completed`, `validation_error`, `draft_saved`, `form_abandoned`
- Draft persistence:
  - Local draft cache for restore (localStorage)
  - Server draft upsert for BO follow-up
- Reliable flushing:
  - Throttled/batched `fetch()`
  - `navigator.sendBeacon()` on `pagehide` / `visibilitychange`

### 3.2 Backend (Ingestion + BO)

- API routes for:
  - Draft upserts
  - Event batch ingestion
- Storage:
  - Operational tables for latest draft & lead status
  - Analytics-friendly event table (or later move to dedicated event store)
- BO:
  - “Abandoned Leads” list + actions (contacted / dismissed / converted)

## 4. React/Next.js Best-Practice Constraints (from `skills-react-best-practices`)

### 4.1 Storage

- **Version and minimize localStorage data**
  - Use versioned keys (e.g. `draft:{formType}:v1:{anonymousId}`)
  - Store minimal schema only
  - Wrap `getItem`/`setItem` in `try/catch`

- **Cache storage API calls**
  - Avoid repeated synchronous storage reads
  - Use module-level cache (`Map`) and keep it in sync
  - Invalidate on `storage` and `visibilitychange`

### 4.2 Event listeners and effects

- **Deduplicate global event listeners**
  - Ensure `visibilitychange`/`pagehide` listeners exist once globally

- **Store event handlers in refs**
  - Avoid re-subscribing global listeners on every render

- **Narrow effect dependencies**
  - Avoid effects depending on entire objects (`formData`)
  - Prefer primitive deps or explicit `trackFieldChange()` calls

### 4.3 Bundle

- **Defer non-critical third-party libraries**
  - Keep telemetry lightweight
  - If adding analytics SDKs later, load via `next/dynamic` with `ssr:false`

## 5. Data Model (DB)

### 5.1 Existing tables

- `ape_subscriptions`
- `pee_leads`

### 5.2 New tables (recommended)

#### 5.2.1 `form_drafts`

Purpose: latest known draft per lead/session for BO + restore.

Suggested fields:

- `id`
- `anonymousId`
- `formType` (`ape_subscription` | `pee_lead` | `registration`)
- `draftData` (jsonb)
- `email`, `phone` (extracted, optional)
- `stepReached`, `fieldsCompleted`, `totalFields`
- `source` (utm/referrer/landing)
- `deviceInfo`
- `score` (0–100)
- `status` (`ABANDONED` | `CONTACTED` | `CONVERTED` | `DISMISSED`)
- `firstSeenAt`, `lastActivityAt`, `convertedAt`

Indexes:

- `(formType, status)`
- `email`, `phone`
- `score desc`

#### 5.2.2 `form_events`

Purpose: analytics timeline and funnel reconstruction.

Suggested fields:

- `id`
- `anonymousId`
- `formType`
- `eventType`
- `fieldKey` (optional)
- `step` (optional)
- `metadata` (jsonb)
- `createdAt`

Indexes:

- `(anonymousId, formType)`
- `(eventType, createdAt)`

## 6. API Endpoints (Next.js routes)

### 6.1 Telemetry ingestion

- `POST /api/telemetry/events`
  - Accepts batches
  - Writes `form_events`

- `POST /api/telemetry/draft`
  - Upserts latest draft
  - Computes score and status updates

Implementation constraints:

- Avoid async waterfalls in handlers
- Batch DB operations and use `Promise.all()` when independent

### 6.2 BO endpoints

- `GET /api/admin/abandoned-leads`
- `PATCH /api/admin/abandoned-leads/:id` (status, notes, assignment)

## 7. Lead Scoring (v1)

Score recommendations (0–100):

- +30 email present
- +30 phone present
- +15 step reached ≥ 2 (or >50% fields)
- +10 amount/budget present (APE)
- +5 return visit within 7 days

Buckets:

- `>= 60`: HOT
- `30–59`: WARM
- `< 30`: COLD

## 8. BO UX (Admin)

Add a section/tab in `/admin`:

- List abandoned drafts with:
  - contact fields
  - last activity
  - form type
  - step reached / completion rate
  - score + bucket
  - status
- Actions:
  - mark contacted
  - mark dismissed
  - add notes
  - mark converted (manual)

## 9. Rollout Phases

### Phase 1 — Client draft restore + basic events

- Add local draft persistence
- Emit `form_viewed`, `form_started`, `validation_error`, `step_viewed`
- Minimal flush mechanism

### Phase 2 — Server draft upsert + BO abandoned list

- Add `form_drafts` table
- Add `/api/telemetry/draft`
- BO list for abandoned drafts

### Phase 3 — Scoring + workflow automation

- Lead scoring
- Assignment + notifications (optional)

## 10. KPIs

- Form start rate
- Step-to-step conversion rate
- Drop-off by field/step
- Validation error rate per field
- Abandoned → contacted → converted

