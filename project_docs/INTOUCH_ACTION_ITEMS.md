# InTouch Payment Callback - Action Items

## 🚨 IMMEDIATE ACTIONS REQUIRED

### 1. Contact InTouch Team (URGENT)

**Email the InTouch team with this request:**

```
Subject: Basic Authentication Credentials for Webhook Callback

Hello InTouch Team,

We need the Basic Authentication credentials to verify webhook callbacks 
for our payment integration.

Our webhook endpoint:
https://samanaffa.com/api/payments/intouch/callback

According to your API documentation, callbacks are secured with Basic 
Authentication. Please provide:
- Username for webhook authentication
- Password for webhook authentication

Also, could you please send a test callback to this endpoint to verify 
the integration is working correctly?

Thank you!
```

### 2. Update Environment Variables (Once Received)

Add these to your production `.env` file:

```bash
# Replace with actual credentials from InTouch
INTOUCH_BASIC_AUTH_USERNAME="username-from-intouch"
INTOUCH_BASIC_AUTH_PASSWORD="password-from-intouch"

# Set to false in production
INTOUCH_ALLOW_UNSIGNED_CALLBACKS="false"
```

### 3. Test the Integration

#### Step 1: Check current state
```bash
# See all pending transactions
npx tsx scripts/check-pending-transactions.ts
```

#### Step 2: Test callback locally (before InTouch credentials)
```bash
# Enable unsigned callbacks for testing
# Add to .env.local:
INTOUCH_ALLOW_UNSIGNED_CALLBACKS="true"

# Test with a real transaction reference
npx tsx scripts/test-intouch-callback.ts <YOUR-REFERENCE-NUMBER> 200
```

#### Step 3: After InTouch sends credentials
```bash
# Update .env with credentials
# Ask InTouch to send a test callback
# Check server logs for "[Intouch Callback]" entries
```

### 4. Monitor Production Logs

After deployment, watch for these log patterns:

**✅ Success (what you want to see):**
```
[Intouch Callback] POST request received
[Intouch Callback] Basic Auth verification PASSED
[Intouch Callback] Transaction processing completed
```

**❌ Failure (what to fix):**
```
[Intouch Callback] Basic Auth verification FAILED
→ Check credentials match what InTouch is sending
```

```
[Intouch Callback] Transaction intent NOT FOUND
→ Check reference number format
```

## 📋 VERIFICATION CHECKLIST

- [ ] Contacted InTouch team for Basic Auth credentials
- [ ] Received username and password from InTouch
- [ ] Added credentials to production `.env` file
- [ ] Set `INTOUCH_ALLOW_UNSIGNED_CALLBACKS="false"` in production
- [ ] Deployed updated code to production
- [ ] Asked InTouch to send test callback
- [ ] Verified test callback succeeded in logs
- [ ] Made a real test payment through the UI
- [ ] Confirmed transaction status updated to COMPLETED
- [ ] Confirmed user balance updated correctly
- [ ] Confirmed email notification was sent

## 🔧 TROUBLESHOOTING

### If callbacks still don't work:

1. **Check server logs:**
   ```bash
   # Look for InTouch callback entries
   grep "Intouch Callback" /path/to/application/logs
   ```

2. **Run diagnostics:**
   ```bash
   npx tsx scripts/check-pending-transactions.ts
   ```

3. **Test manually:**
   ```bash
   # Test callback endpoint is accessible
   curl https://samanaffa.com/api/payments/intouch/callback
   
   # Should return: {"status":"Intouch webhook endpoint active"}
   ```

4. **Check InTouch configuration:**
   - Confirm they have your callback URL
   - Confirm they're sending callbacks
   - Ask for sample request they're sending

### Common Issues

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Verify Basic Auth credentials match |
| 404 Not Found | Check reference number format |
| Transaction not updating | Enable logging, check for callbacks arriving |
| No callbacks arriving | Confirm InTouch has your callback URL configured |

## 📚 DOCUMENTATION

- **Full Fix Details**: `project_docs/INTOUCH_CALLBACK_FIX_SUMMARY.md`
- **Callback Configuration**: `project_docs/INTOUCH_CALLBACK_CONFIGURATION.md`
- **API Documentation**: `project_docs/INTOUCH_DOCS.md`

## 🛠️ UTILITY SCRIPTS

### Test Callback Processing
```bash
npx tsx scripts/test-intouch-callback.ts <reference-number> <status>

# Examples:
npx tsx scripts/test-intouch-callback.ts SAMA_NAFFA-DEPOSIT-1234567890-ABC123 200
npx tsx scripts/test-intouch-callback.ts SAMA_NAFFA-DEPOSIT-1234567890-ABC123 420
```

### Check Pending Transactions
```bash
npx tsx scripts/check-pending-transactions.ts
```

## 📞 QUESTIONS TO ASK INTOUCH

1. ✅ What are the Basic Auth credentials for our webhook?
2. Can you send a test callback to verify our integration?
3. What method do you use: GET or POST? (we support both)
4. Do you retry failed callbacks? How many times?
5. What's your callback timeout threshold?
6. Are there specific IPs we should whitelist?

## 🎯 EXPECTED OUTCOME

After completing these actions:

1. ✅ InTouch callbacks will successfully authenticate
2. ✅ Transaction statuses will update automatically
3. ✅ User balances will update immediately
4. ✅ Email notifications will be sent
5. ✅ Comprehensive logs will be available for monitoring

---

**Status**: 🟡 Waiting for InTouch Basic Auth credentials

**Next Step**: Contact InTouch team (see section 1 above)

