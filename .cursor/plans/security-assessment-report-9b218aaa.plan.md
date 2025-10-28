<!-- 9b218aaa-87de-459d-8487-6a7f7654f11c 85351244-cf63-495c-98f5-45e723aa0c07 -->
# Security Implementation Assessment & Priority Plan

## Executive Summary

The platform has solid foundational security (password hashing, OTP, basic rate limiting, HMAC verification) but lacks critical enterprise-grade protections for production deployment.

## Current Security Status

### ✅ IMPLEMENTED

1. **Strong password requirements** - Frontend + backend validation (min 8 chars, complexity requirements)
2. **Bcrypt password hashing** - 12 salt rounds for user & admin passwords
3. **OTP authentication** - Email & SMS with 5-minute expiration
4. **Admin account lockout** - 5 failed attempts = 1 hour lock
5. **Admin rate limiting** - 5 attempts per 15 minutes
6. **HMAC signature verification** - For Intouch payment callbacks
7. **Session management** - NextAuth JWT with 30-day max age
8. **Database encryption at rest** - Via Neon PostgreSQL
9. **Basic input sanitization** - Some validation exists
10. **Password authentication** - Dual auth (password + OTP fallback)

### ⚠️ PARTIALLY IMPLEMENTED (Needs Fixes)

1. **Strong password requirements** - Frontend validation complete, backend validation incomplete (only checks length, not complexity)

### ❌ NOT IMPLEMENTED (Prioritized Below)

---

## CRITICAL PRIORITY (Implement Immediately - Week 1)

### 0. Complete Backend Password Validation

**Risk**: Users can bypass frontend validation with API calls

**Current**: Backend only validates minimum 8 characters

**Required**: Backend must validate all complexity requirements (uppercase, lowercase, number, special char)

**Files to modify**:

- `src/app/api/auth/setup-password/route.ts` - Add full complexity validation
- `src/app/api/auth/reset-password/route.ts` - Same validation (if exists)

**Implementation**:

```typescript
// Add comprehensive validation
const hasUpperCase = /[A-Z]/.test(password);
const hasLowerCase = /[a-z]/.test(password);
const hasNumbers = /\d/.test(password);
const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

if (password.length < 8 || !hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
  return NextResponse.json(
    { error: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial' },
    { status: 400 }
  )
}
```

### 1. Rate Limiting for User-Facing APIs

**Risk**: Brute force attacks, API abuse, DoS

**Current**: Only admin routes protected

**Required**:

- Login endpoint: 5 attempts per 15 min per IP
- OTP request: 3 attempts per hour per user
- Transaction creation: 10 requests per minute per user
- KYC upload: 5 uploads per hour per user

**Files to modify**:

- `src/lib/rate-limit.ts` - Add user-facing rate limiters
- `src/app/api/auth/login/route.ts`
- `src/app/api/auth/send-otp/route.ts`
- `src/app/api/transactions/intent/route.ts`

### 2. User Account Lockout

**Risk**: Credential stuffing, brute force

**Current**: Only admin accounts lock after 5 attempts

**Required**: User accounts lock after 3 failed attempts for 30 minutes

**Files to modify**:

- `src/lib/db/schema.ts` - Add `failedAttempts`, `lockedUntil` to users table
- `src/app/api/auth/login/route.ts` - Implement lockout logic
- Create migration for new fields

### 3. HTTPS Enforcement

**Risk**: Man-in-the-middle attacks, data interception

**Current**: Depends on deployment environment

**Required**:

- Force HTTPS redirects in `next.config.ts`
- Add security headers middleware
- CSP, HSTS, X-Frame-Options, X-Content-Type-Options

**Files to modify**:

- `next.config.ts` - Add security headers
- Create `src/middleware.ts` - Add HTTPS redirect

### 4. XSS & CSRF Protection

**Risk**: Script injection, unauthorized actions

**Current**: React escapes by default, but needs explicit CSRF

**Required**:

- CSRF tokens for state-changing operations
- CSP headers
- Sanitize all HTML/markdown content
- Validate/escape user-generated content

**Files to modify**:

- `src/middleware.ts` - Add CSP headers
- `src/lib/csrf.ts` - Create CSRF token utility
- All POST/PUT/DELETE API routes - Verify CSRF tokens

### 5. Admin Audit Logging

**Risk**: No accountability for admin actions, compliance issues

**Current**: No audit trail

**Required**:

- Log all admin actions (KYC approvals, user modifications, transaction updates)
- Store: admin ID, action type, target resource, timestamp, IP

**Implementation**:

- Create `admin_audit_logs` table
- Create `src/lib/audit-logger.ts`
- Add logging to all admin API routes

---

## HIGH PRIORITY (Week 2-3)

### 6. Automatic Session Timeout (Client-Side Inactivity)

**Current**: JWT expires after 30 days, no inactivity detection

**Required**: Auto-logout after 15 minutes of inactivity

**Files**: `src/hooks/useSessionTimeout.ts`, Portal layout components

### 7. 2FA for Admin Accounts

**Current**: Password-only authentication

**Required**: TOTP-based 2FA (Google Authenticator compatible)

**Files**: Admin login flow, new 2FA setup page

### 8. Comprehensive Input Validation

**Current**: Basic validation, ORM prevents SQL injection

**Required**:

- Schema-based validation (Zod) for all API endpoints
- Strict type checking
- File upload validation (size, type, content scanning)

### 9. Environment Variable Validation

**Current**: No validation at startup

**Required**: Validate all required env vars at server start

**Files**: Create `src/lib/env.ts` with validation

### 10. Regular Dependency Updates

**Current**: Manual updates

**Required**:

- Setup Dependabot/Renovate
- Weekly security patch reviews
- Automated vulnerability scanning

---

## MEDIUM PRIORITY (Week 4-6)

### 11. Suspicious Login Detection

**Required**:

- Track login location (IP, country)
- Detect unusual access patterns
- Send email alerts for new device/location
- Optional: CAPTCHA after 2 failed attempts

### 12. Centralized Logging & Monitoring

**Options**: Grafana, ELK Stack, or Datadog

**Required**:

- Application logs
- Error tracking (Sentry)
- Performance monitoring
- Security event alerts

### 13. WAF Deployment

**Options**: Cloudflare, AWS WAF, or Vercel's built-in protection

**Protection**: OWASP Top 10, DDoS, bot attacks

### 14. Database Backup Automation

**Current**: Relies on Neon's built-in backups

**Required**:

- Daily automated backups
- Backup encryption
- Recovery testing quarterly
- Point-in-time recovery capability

### 15. Admin Access Restrictions

**Required**:

- VPN-only access OR IP whitelist
- Separate admin subdomain
- Admin session timeout: 30 minutes
- 2FA enforcement

### 16. Admin Roles & Permissions (RBAC)

**Current**: Single admin role

**Required**:

- SUPER_ADMIN: Full access
- ADMIN: User/transaction management
- SUPPORT: Read-only + KYC review
- AUDITOR: Read-only access

---

## LOW PRIORITY (Ongoing/Future)

### 17. GDPR/CDP Senegal Compliance

**Required**:

- Data export API (user data portability)
- Account deletion API
- Data retention policies (auto-delete after X years)
- Cookie consent management
- Privacy policy acceptance enforcement

### 18. Periodic Key Rotation

**Required**:

- Rotate JWT secrets every 3-6 months
- Rotate API keys (Intouch, email, SMS)
- Automated rotation scripts
- Backup old keys temporarily

### 19. Vulnerability Scanning

**Tools**: Snyk, OWASP ZAP, or npm audit

**Frequency**: Weekly automated scans

**Process**: Prioritize fixes based on severity

### 20. Service Segmentation

**Required**:

- Separate database from application server
- Isolate payment processing
- Network segmentation
- Firewall rules

### 21. Regular Security Audits

**Frequency**: Quarterly

**Scope**: Code review, penetration testing, compliance check

---

## Implementation Roadmap

**Week 1 (Critical)**: Items 1-5

**Week 2-3 (High)**: Items 6-10

**Week 4-6 (Medium)**: Items 11-16

**Ongoing**: Items 17-21

## Estimated Effort

- Critical: 40 hours
- High: 60 hours
- Medium: 80 hours
- Low: Ongoing maintenance

## Compliance Notes

- **CDP Senegal**: Focus on items 17 (data rights)
- **RGPD/GDPR**: Items 4, 5, 17 (transparency, accountability)
- **Financial Regulations**: Items 5, 12, 14 (audit trail, monitoring, backups)