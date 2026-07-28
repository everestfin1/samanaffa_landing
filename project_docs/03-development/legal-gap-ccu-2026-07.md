# Legal gap — CCU 21/07/2026 + privacy (2)

**Status:** staging content swapped. Product rules **not** changed yet.  
**Sources:** `CCU Sama Naffa 21072026 VF.docx`, `Politique de confidentialite et mentions legales (2).docx`  
**Old keep:** `CGU Sama Naffa 24062026 VF.docx` (rollback), privacy `(1).docx`

Both new docs say *projet soumis à revue juridique*. Pages `/terms` and `/privacy` show an amber draft banner.

---

## Done in staging (this pass)

1. `/terms` → CCU (4 livres) from 21/07 draft  
2. `/privacy` + mentions → privacy `(2)` (RCCM/NINEA/adresse kept from previous complete version where `(2)` had `[à compléter]`)  
3. E8 acceptance label → CCU + Livre III signature wording  
4. Soft yield copy → “rendement annuel moyen **net** par horizon, non garanti” (`compliance-copy`, FAQ). Rate **numbers/grids kept**.

---

## Blockers for legal (send as-is)

1. Confirm CCU + privacy are publishable (remove *projet*).  
2. Fill CDP récépissés/autorisations + any remaining mentions placeholders.  
3. Acceptance UX: layered disclosure OK, or keep full-scroll gate?  
4. Yield display: can simulator keep a rate table if labelled **net / non garanti**, or must the grid disappear?

---

## Product rules deferred (need PM + legal)

| Rule (CCU) | App today | Action when unblocked |
|---|---|---|
| No residency requirement (I.2) | T2 asks pays de résidence | Review T2 |
| 30-day KYC complete or close + full refund (I.2) | Deposit held pending KYC only | Build timer + refund |
| Investor questionnaire before mandate (III.2) | Missing | New onboarding step |
| Origine des fonds declaration (I.2) | Missing | Add field |
| Withdrawal window −15d / +14d; 48h cancel; ≤5 jours (III.7) | C5 simplified | Rebuild C5 |
| No auto new term (III.7 / III.10) | Old CGU auto-renewed | Update copy + logic |
| Anniversary = kondane creation date (defs) | Likely first deposit / lock | Align dates |
| Never show bruto; no rate grid (III.5) | Simulator grids | Soft-fixed labels only |
| Quarterly reporting (III.9) | C6 mocked | Real docs |
| Fees published in-app (Livre IV) | FAQ had hardcodes | Soft-fixed FAQ; need grille page |

---

## Open naming

CCU spells **kondane**; product UI uses **Kondanné**. Decide with PM before more copy churn.

---

## Files touched

- `src/lib/legal/ccu.ts` (new canonical)
- `src/lib/legal/cgu.ts` (re-exports)
- `src/lib/legal/privacy-policy.ts`
- `src/components/legal/LegalDocumentPage.tsx` (`draftBanner`)
- `src/app/terms/page.tsx`, `src/app/privacy/page.tsx`
- `src/components/onboarding/E8Mandate.tsx`
- `src/lib/compliance-copy.ts`, `src/app/faq/page.tsx`
- `src/app/api/onboarding/mandate/route.ts`
