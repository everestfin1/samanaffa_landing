# Intouch Callback Configuration Guide

## Overview
This document provides the callback URL configuration details that need to be shared with the Intouch team to enable proper payment tracking.

## Callback URL

### Production URL
```
https://samanaffa.com/api/payments/intouch/callback
```

### Development/Staging URL
```
https://your-staging-domain.com/api/payments/intouch/callback
```

## Callback Method
The endpoint supports **both GET and POST** requests:
- **GET**: Intouch sends callbacks as GET requests with query parameters
- **POST**: Also supported for JSON or form-urlencoded payloads

## Expected Payload Format

According to Intouch documentation, the callback will include the following parameters:

### Query Parameters (GET) or Body Parameters (POST/JSON)

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `payment_mode` | string | Yes | The mode of payment used (e.g., "INTOUCH_SERVICE_CODE") |
| `paid_sum` | string/number | Yes | The total amount of payments for the order |
| `paid_amount` | string/number | Yes | The amount of payment notified |
| `payment_token` | string | Yes | The transaction ID on Intouch's side |
| `payment_status` | string | Yes | The order status (200 for success, 420 for failure) |
| `command_number` | string | Yes | The order/reference number from our system |
| `payment_validation_date` | string | Yes | The payment validation timestamp |

### Example Callback URL (GET)
```
https://samanaffa.com/api/payments/intouch/callback?payment_mode=INTOUCH_SERVICE_CODE&paid_sum=22200.0&paid_amount=22200.0&payment_token=1565251468191&payment_status=200&command_number=SAMA_NAFFA-DEPOSIT-1234567890-ABC123&payment_validation_date=1565251499748
```

### Example Callback Payload (POST JSON)
```json
{
  "payment_mode": "INTOUCH_SERVICE_CODE",
  "paid_sum": "22200.0",
  "paid_amount": "22200.0",
  "payment_token": "1565251468191",
  "payment_status": "200",
  "command_number": "SAMA_NAFFA-DEPOSIT-1234567890-ABC123",
  "payment_validation_date": "1565251499748"
}
```

## Response Codes

Our callback endpoint will respond with the following HTTP status codes:

| Status Code | Meaning | Description |
|-------------|---------|-------------|
| 200 | Success | Transaction was successfully processed and validated |
| 420 | Failure | Transaction failed in our system |
| 400 | Bad Request | Missing required fields or invalid data |
| 404 | Not Found | Transaction intent not found for the given reference |
| 409 | Conflict | Transaction ID mismatch |
| 500 | Server Error | Internal server error |

## Payment Status Mapping

Our system maps Intouch's `payment_status` values as follows:

| Intouch Status | Our Status | Description |
|----------------|------------|-------------|
| 200, 0, 00 | COMPLETED | Payment successful |
| 420 | FAILED | Payment failed |
| 1xx, 2xx (other) | PENDING | Payment in progress |
| Other codes | FAILED | Payment failed |

## Security

### Basic Authentication (REQUIRED)

**IMPORTANT**: According to InTouch API documentation, all webhook callbacks are secured with **Basic Authentication**.

InTouch will send callbacks with an `Authorization` header:
```
Authorization: Basic <base64(username:password)>
```

**You MUST request Basic Auth credentials from the InTouch team** for webhook verification.

#### Required Environment Variables
```bash
# Basic Auth credentials (REQUEST THESE FROM INTOUCH)
INTOUCH_BASIC_AUTH_USERNAME="your-webhook-username"
INTOUCH_BASIC_AUTH_PASSWORD="your-webhook-password"

# Allow unsigned callbacks during testing only (set to false in production)
INTOUCH_ALLOW_UNSIGNED_CALLBACKS="true"
```

### HMAC Signature Verification (Optional/Fallback)

If InTouch also provides webhook signatures (in addition to Basic Auth), they should be sent in one of these headers:
- `x-intouch-signature`
- `X-Intouch-Signature`
- `x-signature`

The signature should be a SHA256 HMAC of the request body.

```bash
# Optional: For HMAC signature verification
INTOUCH_WEBHOOK_SECRET="your_webhook_secret_here"
```

### Configuration Priority

Our endpoint checks authentication in this order:
1. **Basic Authentication** (if credentials are configured) - InTouch's primary method
2. **HMAC Signature** (if webhook secret is configured) - Optional additional security
3. **Allow Unsigned** (if enabled) - For testing only, should be disabled in production

## What Happens After Callback

When our system receives a callback:

1. **Validates** the payload (required fields, amount, reference number)
2. **Finds** the transaction intent using the `command_number` (our reference number)
3. **Verifies** the amount matches our records
4. **Updates** the transaction status based on `payment_status`
5. **Updates** the user's account balance (for successful deposits/withdrawals)
6. **Sends** email notification to the user
7. **Logs** the callback for audit purposes
8. **Returns** appropriate HTTP status code

## Testing the Callback

### Automated Testing with Our Scripts

We provide dedicated testing utilities for easier debugging:

#### 1. Test Callback Endpoint
```bash
# Test with a specific transaction reference (success scenario)
npx tsx scripts/test-intouch-callback.ts SAMA_NAFFA-DEPOSIT-1234567890-ABC123 200

# Test failure scenario
npx tsx scripts/test-intouch-callback.ts SAMA_NAFFA-DEPOSIT-1234567890-ABC123 420

# Test against a different server
npx tsx scripts/test-intouch-callback.ts SAMA_NAFFA-DEPOSIT-1234567890-ABC123 200 https://samanaffa.com
```

This script will:
- Fetch the transaction from the database
- Send test callbacks with Basic Auth (GET, POST JSON, and POST form-urlencoded)
- Verify the transaction status updates correctly
- Check balance updates

#### 2. Check Pending Transactions
```bash
# View all pending transactions and diagnostic info
npx tsx scripts/check-pending-transactions.ts
```

This script shows:
- All pending transactions
- Transactions that received callbacks but didn't update
- Transactions missing provider IDs
- Recent completed transactions for comparison
- Summary statistics by status

### Manual Testing with cURL

**Note**: Include Basic Authentication header in all requests.

#### Test with cURL (GET)
```bash
curl "https://samanaffa.com/api/payments/intouch/callback?payment_mode=INTOUCH_SERVICE_CODE&paid_sum=1000&paid_amount=1000&payment_token=TEST123&payment_status=200&command_number=YOUR_REFERENCE_NUMBER&payment_validation_date=1234567890" \
  -u "username:password"
```

#### Test with cURL (POST JSON)
```bash
curl -X POST https://samanaffa.com/api/payments/intouch/callback \
  -u "username:password" \
  -H "Content-Type: application/json" \
  -d '{
    "payment_mode": "INTOUCH_SERVICE_CODE",
    "paid_sum": "1000",
    "paid_amount": "1000",
    "payment_token": "TEST123",
    "payment_status": "200",
    "command_number": "YOUR_REFERENCE_NUMBER",
    "payment_validation_date": "1234567890"
  }'
```

Replace `username:password` with the actual Basic Auth credentials from InTouch.

## Important Notes for Intouch Team

1. **Reference Number Format**: Our reference numbers follow this pattern:
   - `SAMA_NAFFA-DEPOSIT-{timestamp}-{random}`
   - `SAMA_NAFFA-WITHDRAWAL-{timestamp}-{random}`
   - `APE_INVESTMENT-INVESTMENT-{timestamp}-{random}`

2. **Amount Format**: We expect amounts as numbers (can be string or numeric type)

3. **Timestamp Format**: The `payment_validation_date` should be a Unix timestamp (milliseconds)

4. **Idempotency**: Our system handles duplicate callbacks gracefully - sending the same callback multiple times won't cause issues

5. **Asynchronous Processing**: Some payments may complete outside the payment tunnel, which is why the callback is essential

## Contact Information

For any issues or questions regarding the callback integration:
- **Technical Contact**: [Your technical contact email]
- **Support**: [Your support email]

## Checklist for Intouch Team

Please confirm the following with the Intouch team:

- [ ] Callback URL configured: `https://samanaffa.com/api/payments/intouch/callback`
- [ ] Callback method: GET with query parameters (preferred) or POST with JSON
- [ ] All required parameters will be included in callbacks
- [ ] Payment status codes confirmed (200 = success, 420 = failure)
- [ ] Timestamp format confirmed (Unix timestamp in milliseconds)
- [ ] Test callbacks sent and verified successful
- [ ] Production callbacks enabled

## Troubleshooting

### Problem: Callbacks not updating transaction status

**Possible causes:**
1. **Missing Basic Auth credentials** - InTouch requires Basic Authentication
   - Check if `INTOUCH_BASIC_AUTH_USERNAME` and `INTOUCH_BASIC_AUTH_PASSWORD` are set
   - Request credentials from InTouch if not configured
   - Temporarily set `INTOUCH_ALLOW_UNSIGNED_CALLBACKS=true` for testing

2. **InTouch hasn't configured callback URL** - They may not have your webhook URL
   - Confirm with InTouch team they have: `https://samanaffa.com/api/payments/intouch/callback`
   - Ask them to send a test callback

3. **Callbacks being sent but rejected** - Authentication failures
   - Check server logs for `[Intouch Callback]` entries
   - Look for "Basic Auth verification FAILED" errors
   - Verify credentials match what InTouch is sending

4. **Reference number mismatch** - Callback can't find the transaction
   - Run `npx tsx scripts/check-pending-transactions.ts` to see pending transactions
   - Verify InTouch is using the correct `command_number` (our reference number)
   - Check logs for "Transaction intent NOT FOUND" errors

5. **Network/Firewall issues** - Callbacks can't reach your server
   - Verify your server is accessible from InTouch's IP addresses
   - Check firewall rules allow incoming HTTPS traffic
   - Test endpoint manually: `curl https://samanaffa.com/api/payments/intouch/callback`

### Checking Logs

Look for these log patterns in your application logs:

**Successful callback:**
```
[Intouch Callback] POST request received
[Intouch Callback] Basic Auth verification PASSED
[Intouch Callback] Processing callback data...
[Intouch Callback] Transaction intent found
[Intouch Callback] Transaction processing completed
```

**Failed authentication:**
```
[Intouch Callback] POST request received
[Intouch Callback] Basic Auth verification FAILED
```

**Transaction not found:**
```
[Intouch Callback] POST request received
[Intouch Callback] Transaction intent NOT FOUND for reference: XXX
```

### Questions to Ask InTouch

1. **Authentication**: What Basic Auth username/password should we use?
2. **Testing**: Can you send a test callback to verify the integration?
3. **Method**: Do you send callbacks as GET or POST requests?
4. **Retry Logic**: Do you retry failed callbacks? How many times?
5. **Timeout**: What is your callback timeout? (our endpoint responds quickly)
6. **IP Whitelist**: Do you need us to whitelist specific IPs for incoming callbacks?

## Changelog

- **2025-01-09**: Added Basic Authentication support (per InTouch API spec)
- **2025-01-09**: Added comprehensive logging for diagnostics
- **2025-01-09**: Created test-intouch-callback.ts utility script
- **2025-01-09**: Created check-pending-transactions.ts diagnostic script
- **2025-01-09**: Added troubleshooting guide
- **2025-01-08**: Initial callback configuration documentation
- **2025-01-08**: Added support for Intouch-specific field names (payment_token, command_number, payment_status, etc.)
- **2025-01-08**: Added GET request support for query parameter callbacks
