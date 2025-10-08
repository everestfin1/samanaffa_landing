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

### Webhook Signature (Optional)
If Intouch provides webhook signatures, they should be sent in one of these headers:
- `x-intouch-signature`
- `X-Intouch-Signature`
- `x-signature`

The signature should be a SHA256 HMAC of the request body.

### Environment Variables Required
```bash
# Optional: For signature verification
INTOUCH_WEBHOOK_SECRET=your_webhook_secret_here

# Optional: Allow unsigned callbacks during testing
INTOUCH_ALLOW_UNSIGNED_CALLBACKS=true
```

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

### Test with cURL (GET)
```bash
curl "https://samanaffa.com/api/payments/intouch/callback?payment_mode=INTOUCH_SERVICE_CODE&paid_sum=1000&paid_amount=1000&payment_token=TEST123&payment_status=200&command_number=YOUR_REFERENCE_NUMBER&payment_validation_date=1234567890"
```

### Test with cURL (POST JSON)
```bash
curl -X POST https://samanaffa.com/api/payments/intouch/callback \
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

## Changelog

- **2025-01-08**: Initial callback configuration documentation
- **2025-01-08**: Added support for Intouch-specific field names (payment_token, command_number, payment_status, etc.)
- **2025-01-08**: Added GET request support for query parameter callbacks
