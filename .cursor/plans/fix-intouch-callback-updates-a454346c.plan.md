<!-- a454346c-10f8-4902-9496-7c3421cbdde9 7d64c739-f694-4ec5-968c-6e04050594be -->
# Fix InTouch Payment Callback Authentication & Status Updates

## Root Causes Identified

### 1. **Authentication Mismatch (CRITICAL)**

Your callback endpoint (`src/app/api/payments/intouch/callback/route.ts`) implements HMAC signature verification, but according to INTOUCH_DOCS.md (lines 71-75), InTouch uses **Basic Authentication**. This means:

- InTouch sends callbacks with `Authorization: Basic <base64(username:password)>` header
- Your endpoint expects `x-intouch-signature` header (which InTouch doesn't send)
- Result: All callbacks are likely rejected with 401 Unauthorized

### 2. **Missing Environment Variables**

- `INTOUCH_WEBHOOK_SECRET` - not in env.example (used for HMAC, but InTouch uses Basic Auth)
- `INTOUCH_ALLOW_UNSIGNED_CALLBACKS` - not in env.example (needed to bypass signature checks)
- No Basic Auth credentials configured

### 3. **No Logging for Diagnostics**

- Can't verify if callbacks are arriving
- No visibility into authentication failures
- Can't debug status update issues

## Implementation Steps

### Step 1: Add Logging & Diagnostics

**File**: `src/app/api/payments/intouch/callback/route.ts`

- Add comprehensive logging at the start of POST/GET handlers
- Log all incoming headers (especially Authorization)
- Log request body/query params
- Log authentication attempts and failures
- This will help us see if callbacks are arriving and why they're failing

### Step 2: Implement Basic Authentication

**File**: `src/app/api/payments/intouch/callback/route.ts`

According to InTouch docs, callbacks require Basic Auth validation. Add:

- Extract Basic Auth credentials from `Authorization` header
- Verify against environment variables: `INTOUCH_BASIC_AUTH_USERNAME` and `INTOUCH_BASIC_AUTH_PASSWORD`
- Allow bypassing authentication if `INTOUCH_ALLOW_UNSIGNED_CALLBACKS=true` (for testing)
- Keep existing HMAC signature verification as fallback (in case InTouch sends both)

Key changes:

```typescript
// Extract and verify Basic Auth
const authHeader = request.headers.get('authorization');
if (authHeader?.startsWith('Basic ')) {
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');
  // Verify against environment variables
}
```

### Step 3: Update Environment Configuration

**File**: `env.example`

Add missing InTouch webhook configuration:

```bash
# InTouch Webhook Configuration
INTOUCH_WEBHOOK_SECRET="your-webhook-secret-here"
INTOUCH_ALLOW_UNSIGNED_CALLBACKS="true"  # Set to false in production
# Basic Auth credentials (ask InTouch team for these)
INTOUCH_BASIC_AUTH_USERNAME="your-username"
INTOUCH_BASIC_AUTH_PASSWORD="your-password"
```

### Step 4: Create Callback Testing Utility

**File**: `scripts/test-intouch-callback.ts`

Create a script to simulate InTouch callbacks locally:

- Test with Basic Auth headers
- Test with different payment statuses (200, 420)
- Test with actual reference numbers from your database
- Verify status updates work end-to-end

### Step 5: Add Database Query for Debugging

**File**: `scripts/check-pending-transactions.ts`

Create utility to check:

- All pending transaction intents
- Missing providerTransactionId values
- Transactions with lastCallbackAt timestamps
- Helps identify stuck transactions

### Step 6: Update Documentation

**File**: `project_docs/INTOUCH_CALLBACK_CONFIGURATION.md`

Update to clarify:

- InTouch uses Basic Authentication (not HMAC signatures)
- Required environment variables
- How to request Basic Auth credentials from InTouch
- Testing procedures with proper auth headers

## Verification Steps

After implementation:

1. Check server logs for incoming callback requests
2. Verify Basic Auth headers are being received
3. Test callback endpoint with curl/Postman using Basic Auth
4. Monitor transaction_intents table for status updates
5. Verify balance updates occur on COMPLETED status
6. Confirm email notifications are sent

## Questions for InTouch Team

1. What Basic Auth username/password should we use for webhook verification?
2. Do they send callbacks as GET or POST? (Our endpoint supports both)
3. Is there a test/sandbox callback URL we can use for testing?
4. Do they have webhook retry logic if our endpoint is temporarily down?

### To-dos

- [ ] Add comprehensive logging to callback endpoint to diagnose incoming requests
- [ ] Implement Basic Authentication verification as per InTouch API specs
- [ ] Add missing InTouch webhook environment variables to env.example
- [ ] Create callback testing utility script with Basic Auth simulation
- [ ] Create database debugging script to check pending transactions
- [ ] Update InTouch callback documentation with Basic Auth requirements