# Momar Figma redesign — agent handover

**Date:** 2026-07-24  
**Branch:** `staging` (local, ahead of `origin/staging`)  
**Last related commit before this handover:** `868c303` — `feat(onboarding): add Momar E8 mandate signature step`  
**This commit:** T6 handoff + C1 portal dashboard + full-bleed background

Use this doc to continue the Momar redesign without re-discovering context. Pair with [momar-figma-map.md](./momar-figma-map.md).

---

## Mission

Replicate **Momar’s approved Figma** into the Next.js app — not the outdated html.to.design capture.

| Role | File | Key |
|------|------|-----|
| **Source of truth** | [Sama-Naffa-UI](https://www.figma.com/design/blKrnZxk8pWEjfPFa2XS9K/Sama-Naffa-UI) | `blKrnZxk8pWEjfPFa2XS9K` |
| **Local Bridge copy** (when Desktop Bridge is connected) | “Sama Naffa UI (Copy)” | often `unsaved-…` |
| **Ignore** | Samanaffa html.to.design | `sZKClSLEQJG77PRHnkreVL` |

Figma page: `0:1` (`🎨 Components`). Flows: **E0–E9** (onboarding / marketing) + **C1–C8** (portal).

---

## Progress snapshot

### Done (committed earlier on `staging`)

| Step | Node | Status |
|------|------|--------|
| E0 Entrée | `12:302` | Landing + hero video + footer reveal |
| E0 Nattukaay | `19:463` | `/sama-naffa` simulator |
| E1 phone + OTP | `10:1904` / `10:1977` | First `/onboarding` step |
| E2 personal info | `10:2048` | Done |
| E3 create Kondanné | `10:3058` | Done (no quiz; default Formule Équilibre) |
| E4 deposit | `10:2230` | Done |
| E5 KYC Didit | `10:2317` | Done |
| E6 payment | `166:185` | Done (Figma badge wrongly says E5) |
| E8 mandate + signature | `10:2560` | Done — session created after E1 OTP, not after E8 |

### In this handover commit

| Step | Node | Status |
|------|------|--------|
| **T6** success handoff | *no Figma frame* | Restyled as branded bridge → `/portal/dashboard` |
| **C1** Tableau de bord | `10:2754` | New Momar dashboard + full-bleed bg |
| Profile completion modal | — | **Removed** from dashboard + `SamaNaffaPortal` (Momar/E8 already covers terms/signature) |

### Not started (next)

| Step | Node | Suggested app target |
|------|------|----------------------|
| **C2** Liste Kondanne | `124:43007` | `/portal/sama-naffa` list |
| **C2** Détail Kondanne | `10:2878` | Account detail |
| **C3** Alimenter | `10:2977` | Deposit |
| **C4** Créer (portal) | `10:3058` | Reprend E3 in portal |
| **C5** Retrait | `10:3131` | Withdrawal |
| **C6** Relevés | `10:3223` | Statements |
| **C7** Profil | `10:3293` | Profile/security |
| **C8** Aide | `10:3376` | Support |

Suggested order after handover: **C2 list/detail → C3 Alimenter → remaining C4–C8**.

---

## How to pull designs

1. Prefer **Figma MCP Bridge** (`user-figma-bridge`) when Desktop is open on the Momar file — avoids Starter plan rate limits on official `plugin-figma-figma`.
2. Load skill **figma-design-to-code** before `get_design_context` on the official plugin.
3. Official plugin `download_assets` / heavy `get_design_context` often hits: *“You've reached the Figma MCP tool call limit on the Starter plan.”*  
   - **Do not freestyle assets.** Ask the user to export the fill, or wait for quota / upgrade.
4. Node IDs in URLs use `-`; in tools use `:` (e.g. `10-2754` → `10:2754`).

---

## C1 — what was built and why

### Layout model (critical)

Figma frame **Tableau de bord** `10:2754` contains:

- Top chrome / header area  
- **`Background+Border+Shadow` `10:2760`** — a **single IMAGE fill** (`imageHash` `3cad939…`, scaleMode **CROP**), not CSS noise + separate trunks crop  
- UI cards overlaid on the **left**; trunks stay visible on the **right**

Rebuilding with a cropped trunks PNG + flat beige **cannot** match. The user exported the original fill:

```
public/figma/c1/dashboard-bg.jpg   (~960×1200, ~214KB)
```

(Filename was briefly `dahsboard-bg.jpg` — typo fixed.)

### Implementation

| Piece | Path | Role |
|-------|------|------|
| Page | `src/app/portal/dashboard/page.tsx` | Auth, data hooks, Momar header, C1 |
| Dashboard UI | `src/components/portal/C1Dashboard.tsx` | Bonjour, create CTA, balance, Kondannés, activité |
| Background | `src/components/portal/C1PageBackground.tsx` | Fixed full-viewport `<img object-fit: cover>` |
| Styles | `src/app/globals.css` — `.c1-*` | Page, bg, shell, cards |
| Header | `src/components/portal/PortalHeader.tsx` | `variant="momar"` (compact white bar) |
| Body class | `html/body.c1-dashboard` | Set/cleared in dashboard `useEffect` so body isn’t white around the fill |

**Background rules (user-validated):**

- Image must be **edge-to-edge** — no white gutters, no inset rounded “card” frame around the whole page.  
- Image sits **behind** header + all content.  
- Use `C1PageBackground` (`position: fixed; inset: 0` + `object-fit: cover`), not a bordered `.c1-shell` background.  
- `.c1-shell` is a **transparent content column** only.  
- `object-position: 70% 8%` approximates Figma’s CROP bias (trunks right). Tune if crop feels off on wide screens.

### Product behavior changes

- **`ProfileCompletionModal` removed** from portal dashboard and `SamaNaffaPortal` — deposit confirm is no longer gated on profile-completion; Momar E8 already collects signature + CGSM.  
- Pending deposit banner on C1 still links to `/portal/sama-naffa?confirmDeposit=1`.

### T6

- `src/components/onboarding/T6Dashboard.tsx` — Momar-styled “ton Naffa est prêt” handoff into portal.  
- No dedicated Figma celebration frame; treat as bridge into C1.  
- Onboarding page includes T6 in the same shell layout as E8.

---

## Onboarding flow (current)

```
E1 OTP → (session) → E2 → E3 → E4 → E5 KYC → E6 payment → E8 mandate → T6 → /portal/dashboard (C1)
```

- E7 / E9: **absent** from Figma — do not invent unless product asks.  
- Progress / step machine: `src/app/onboarding/page.tsx` + onboarding progress helpers.

---

## Known gaps / polish for C1

Not blockers for handover, but expect visual iteration:

1. **Pixel parity** vs Figma `10:2754` — spacing, type scale, activity row copy (“Versement — {name}”), empty states.  
2. **Deposit banner copy** — may show “FCFA FCFA” if currency is double-appended; check `formatCurrency` usage.  
3. **`background` / `object-position`** may need per-breakpoint tweaks so trunk stack matches Figma on ultrawide.  
4. **Mobile** C1 — verify cards + cover crop; Figma is primarily desktop 1200-wide frames.  
5. Official Figma MCP Starter **rate limit** — prefer Bridge + user-exported assets.

---

## Agent playbook for next screens

1. Open map: [momar-figma-map.md](./momar-figma-map.md) — pick next C* node.  
2. Bridge: `get_design_context` / `get_screenshot` / `get_node` on that node.  
3. Reuse Momar tokens in `globals.css` (`--sama-*`); Geist already loaded.  
4. Prefer dedicated page/section components under `src/components/portal/` with scoped CSS classes (pattern: `.c1-*`, `.e0-*`, `.e8-*`).  
5. If a frame uses an **IMAGE fill** for the whole surface (like C1 `10:2760`), export the **original fill**, commit under `public/figma/c…/`, and wire as cover — do not reconstruct from screenshots.  
6. Commit in Conventional Commits on `staging`; do **not** push unless asked; **never** add `Co-authored-by`.  
7. Update `momar-figma-map.md` status row when a screen lands.

---

## Quick verify

```bash
bun run dev
# or: npm run dev

# After login / completed onboarding:
open http://localhost:3000/portal/dashboard
# Expect: full-bleed sand+trunks, white Momar header, left column cards, no page frame gutters
```

```bash
npx tsc --noEmit   # ignore known mock-otp noise if any
```

---

## Key chat / transcript

Prior agent thread (E8 → T6 → C1 background debugging):  
Cursor agent transcript id `8a794f9c-9e42-468c-8416-a8cda97fe0a3`.

---

## Do / don’t

| Do | Don’t |
|----|--------|
| Follow Momar file `blKrnZxk8pWEjfPFa2XS9K` | Use html.to.design Samanaffa as design truth |
| Report Figma MCP auth/rate-limit failures and wait | Freestyle fake generative assets as substitutes |
| Keep C1 bg full-bleed behind content | Put bg only inside a bordered/inset shell |
| Continue portal at C2 | Re-open E0–E8 unless fixing a regression |
| Ask before `git push` | Force-push `staging` / `main` |
