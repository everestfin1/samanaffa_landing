# Intouch Payment Integration Improvement Tracker

_Last updated: 2025-10-02_

This document tracks the outstanding work required to harden and refine the Intouch payment integration across frontend, backend, and operational workflows.

---

## Summary of Current Gaps

| Area | Issue | Impact |
| --- | --- | --- |
| Transaction Intent Flow | Frontend and API do not surface precise failure reasons (KYC pending, account missing, insufficient balance). | Users see generic errors and cannot self-resolve issues. |
| Script Handling | `IntouchPayment` auto-invokes on script load; lacks guards against duplicate execution and does not populate customer data fields. | Inconsistent UX, potential duplicate payment attempts, poor reconciliation data. |
| Webhook Security | Callback endpoint accepts any payload; no signature/HMAC verification or idempotency controls. | Payments can be spoofed; duplicate callbacks mutate balances multiple times. |
| Balance Updates | Amount from callback is trusted without cross-check; withdrawal math can drive negative balances. | Risk of incorrect balances and undetected fraud. |
| Environment Config | API keys default to hard-coded values; no sandbox/production differentiation at runtime. | Misconfiguration risk, difficult troubleshooting. |
| Reconciliation & Monitoring | No follow-up for stale `PENDING` intents; no raw callback logging or notifications for failed/cancelled statuses. | Operational blind spots and delayed user support. |
| User Experience | Modal does not communicate callback wait time, retry options, or support paths. | Users abandon flow or lack guidance post-payment. |

---

## Action Plan

### 1. Backend Security & Reliability

- [ ] **Signature Verification**: Validate incoming callbacks using `INTOUCH_WEBHOOK_SECRET` (HMAC or provided scheme).  
- [ ] **Payload Validation**: Ensure `amount`, `referenceNumber`, and `transactionId` match the existing intent; reject mismatches.  
- [ ] **Idempotency Control**: Record last processed callback ID/status to prevent duplicate balance updates.  
- [ ] **Transactional Balance Updates**: Wrap status changes and balance mutations in a single Prisma transaction; enforce non-negative balances on withdrawals.  
- [ ] **Raw Callback Logging**: Persist callback payloads (sanitized) for audit and dispute resolution.

### 2. Transaction Intent Flow

- [ ] **Frontend Pre-flight Checks**: Block payment initiation when KYC status ≠ APPROVED or account prerequisites fail, showing actionable messaging.  
- [ ] **API Error Codes**: Standardize structured error responses (`kyc_required`, `account_missing`, `insufficient_balance`, etc.) and relay them to the UI.  
- [ ] **Reference Management**: Ensure reference numbers are generated once and reused across retries to maintain traceability.

### 3. Frontend Intouch Component

- [ ] **Script Lifecycle**: Load Intouch script once per session (or via provider), guard against duplicate loads, and clean up listeners.  
- [ ] **Single Invocation Control**: Disable the pay button after submission, provide explicit retry logic, and prevent automatic re-triggering on re-render.  
- [ ] **Customer Metadata**: Pass available `name`, `email`, and `phone` to `sendPaymentInfos` for better reconciliation.  
- [ ] **Status UX**: Display clear states (initiating, waiting for confirmation, success, error, manual retry) and inform users that confirmation may take time.

### 4. Environment & Configuration

- [ ] **Mandatory Config Validation**: Throw at startup if `NEXT_PUBLIC_INTOUCH_*` variables or webhook secrets are missing—no fallback defaults.  
- [ ] **Environment Awareness**: Use sandbox credentials/URLs in non-production environments; document deployment steps in `.env`.  
- [ ] **Secret Management**: Store production keys in secure secret stores (e.g., Vercel env, Vault) and rotate regularly.

### 5. Reconciliation & Monitoring

- [ ] **Stale Intent Job**: Add a scheduled task to detect intents stuck in `PENDING` beyond SLA, notify admins, and optionally revert to `FAILED`.  
- [ ] **User Notifications**: Send email/SMS/WhatsApp updates for `FAILED` or `CANCELLED` intents with next steps.  
- [ ] **Operational Dashboard**: Display live counts of intents by status and highlight reconciliation metrics.

### 6. User Experience Enhancements

- [ ] **Modal Messaging**: Communicate that payment confirmation may arrive via callback and that the page can be safely closed.  
- [ ] **Support CTA**: Offer a “Contact support” option when payments stall, ideally deep-linking to WhatsApp or help center.  
- [ ] **Analytics & Logging**: Track milestones (script loaded, payment initiated, callback received) using structured logs and client-side analytics.

---

## Next Steps & Ownership

| Priority | Task | Owner | Target Date |
| --- | --- | --- | --- |
| High | Implement webhook signature verification and idempotency | Backend engineer | 2025-10-05 |
| High | Add frontend pre-flight checks with descriptive messaging | Frontend engineer | 2025-10-06 |
| Medium | Introduce stale intent reconciliation job & notifications | Backend engineer | 2025-10-10 |
| Medium | Improve Intouch modal UX and retry flow | Frontend engineer | 2025-10-11 |
| Medium | Enforce config validation and environment separation | DevOps | 2025-10-12 |
| Low | Build operational dashboard for payment tracking | Data/BI | 2025-10-20 |

---

## References

- [`src/components/payments/IntouchPayment.tsx`](../src/components/payments/IntouchPayment.tsx)  
- [`src/app/api/transactions/intent/route.ts`](../src/app/api/transactions/intent/route.ts)  
- [`src/app/api/payments/intouch/callback/route.ts`](../src/app/api/payments/intouch/callback/route.ts)  
- [`project_docs/INTOUCH_INTEGRATION_GUIDE.md`](./INTOUCH_INTEGRATION_GUIDE.md)
