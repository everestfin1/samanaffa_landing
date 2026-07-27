# Momar Figma redesign — agent handover

**Checkpoint:** 2026-07-27  
**Branch:** `staging` — **12 commits ahead** of `origin/staging` (not pushed)  
**HEAD:** `3c47f52` — progress API harden + FCFA fix + (then) profile modal restore  
**Prior redesign commit:** `f11e0b4` — T6 + C1 full-bleed dashboard  

Pair with [momar-figma-map.md](./momar-figma-map.md).

---

## Mission

Replicate **Momar’s approved Figma** into the Next.js app — not the outdated html.to.design capture.

| Role | File | Key |
|------|------|-----|
| **Source of truth** | [Sama-Naffa-UI](https://www.figma.com/design/blKrnZxk8pWEjfPFa2XS9K/Sama-Naffa-UI) | `blKrnZxk8pWEjfPFa2XS9K` |
| **Local Bridge copy** | “Sama Naffa UI (Copy)” when Desktop Bridge is connected | often `unsaved-…` |
| **Ignore** | Samanaffa html.to.design | `sZKClSLEQJG77PRHnkreVL` |

Page: `0:1` (`🎨 Components`). Flows: **E0–E9** + **C1–C8**.

---

## Progress snapshot (2026-07-27)

### Done on `staging` (committed)

| Area | Status |
|------|--------|
| E0 → E8 onboarding (Momar) | Shipped through `868c303` |
| T6 handoff | Shipped in `f11e0b4` |
| C1 dashboard + full-bleed bg | Shipped in `f11e0b4` |
| Progress PATCH validation / T6 gates | `3c47f52` |
| Double “FCFA FCFA” on C1/T6 | Fixed in `3c47f52` |
| `useSamaNaffaAccounts` (no `limit=1000`) | `3c47f52` |
| Dashboard `router.push` during render | Fixed in `3c47f52` |

### WIP — staged, **not committed** (incomplete)

| Change | State |
|--------|--------|
| `T2bContactConsents.tsx` | New UI: email + privacy (+ optional marketing) |
| `OnboardingStep` + `T2B` + `ONBOARDING_VISIBLE_STEPS = 9` | Types/index updated |
| Dashboard `ProfileCompletionModal` | Removed again in staged diff (replaces restore from `3c47f52`) |
| **Step machine wire-up** | **Missing** — no `step === 'T2B'` render; T2 still jumps to E3 |
| Progress API `STEPS` / transitions | **Still omit `T2B`** in `src/app/api/onboarding/progress/route.ts` |

**Finish T2B before portal C2**, or unstage if abandoning. Intended flow once complete:

```
E1 → E2 → T2B (email/consents) → E3 → E4 → E5 → E6 → E8 → T6 → C1
```

Product intent: collect real email + privacy in onboarding so portal does not need a blocking profile-completion gate.

### Portal Momar (not started)

| Step | Node | Target |
|------|------|--------|
| **C2** Liste | `124:43007` | `/portal/sama-naffa` |
| **C2** Détail | `10:2878` | Kondanné detail |
| **C3** Alimenter | `10:2977` | Deposit |
| **C4–C8** | see map | create / retrait / relevés / profil / aide |

Suggested after T2B is committed: **C2 list/detail → C3 → C4–C8**.

---

## How to pull designs

1. Prefer **Figma MCP Bridge** (`user-figma-bridge`) when Desktop is on the Momar file.  
2. Load **figma-design-to-code** before official `get_design_context`.  
3. Starter plan rate limits are common — **do not freestyle assets**; ask user to export fills.  
4. URL node ids use `-`; tools use `:` (`10-2754` → `10:2754`).

---

## C1 — keep these rules

- Fill asset: `public/figma/c1/dashboard-bg.jpg`  
- Full-bleed via `C1PageBackground` (`fixed` + `object-fit: cover`) — **behind** header and cards  
- **No** inset bordered shell as the page background  
- `.c1-shell` = transparent content column only  
- `object-position: 70% 8%` (tune if crop is off)

Key files: `C1Dashboard.tsx`, `C1PageBackground.tsx`, `portal/dashboard/page.tsx`, `.c1-*` in `globals.css`, `PortalHeader` `variant="momar"`.

---

## Known gaps

1. **T2B incomplete** (see WIP above) — also check copy (“identité vérifiée via Didit” is wrong if step sits **before** KYC).  
2. `priority` on a plain `<img>` in `T2bContactConsents` is invalid — remove or use `next/image`.  
3. C1 pixel polish vs `10:2754` still open (spacing, activity labels, mobile crop).  
4. Profile-completion policy: decide **onboarding T2B vs portal modal** — staged work chooses T2B; don’t leave both half-done.  
5. `staging` not pushed (12 commits ahead).

---

## Next actions (recommended order)

1. **Finish or discard staged T2B** — wire render + progress API transitions + commit, or `git restore --staged` / restore files.  
2. **Push `staging`** when ready (ask user).  
3. **Start C2** Liste/Détail (`124:43007` / `10:2878`) per Momar.  
4. Update this file + `momar-figma-map.md` when each screen lands.

---

## Agent playbook

1. Map → pick next node.  
2. Bridge screenshot / design context.  
3. Reuse `--sama-*` tokens; scoped classes (`.c1-*`, `.e1-*`, …).  
4. IMAGE fills → export original, commit under `public/figma/…`, cover wire-up.  
5. Conventional Commits on `staging`; no push unless asked; no `Co-authored-by`.

---

## Quick verify

```bash
bun run dev
# /portal/dashboard — full-bleed sand+trunks, Momar header, left cards
npx tsc --noEmit
git status   # expect clean after T2B commit or restore
```

## Transcripts

- C1/T6 thread: `8a794f9c-9e42-468c-8416-a8cda97fe0a3`  
- This checkpoint chat: current session after handover

## Do / don’t

| Do | Don’t |
|----|--------|
| Momar file `blKrnZxk8pWEjfPFa2XS9K` | html.to.design as truth |
| Report MCP rate limits / wait | Fake assets |
| Keep C1 bg full-bleed | Inset framed page bg |
| Finish T2B or clean WIP first | Start C2 with half-wired onboarding |
| Ask before push | Force-push `staging` / `main` |
