# Intouch Payment Integration Requirements

## Date: 10/03/2025

### Configuration Required from Intouch Team

Based on recent communication with the Intouch team, the following configurations need to be completed:

---

## 1. Redirect URLs (URLs de redirection)

### Success URL (URL de redirection en cas de succès)
```
https://everestfin.com/portal/sama-naffa/payment-success
```

**Purpose**: After a successful payment, redirect the customer to this URL to show a success confirmation and update their balance.

**Query Parameters Expected**:
- `transactionId`: Intouch transaction ID
- `referenceNumber`: Our internal reference number (format: `SAMA_NAFFA-DEPOSIT-{timestamp}-{random}`)
- `amount`: Transaction amount in FCFA
- `status`: Payment status (should be "success" or "completed")

**Example**:
```
https://everestfin.com/portal/sama-naffa/payment-success?transactionId=INTOUCH123456&referenceNumber=SAMA_NAFFA-DEPOSIT-1728000000000-abc123&amount=50000&status=success
```

### Failure URL (URL de redirection en cas d'échec)
```
https://everestfin.com/portal/sama-naffa/payment-failed
```

**Purpose**: After a failed payment, redirect the customer to this URL to inform them of the failure and allow them to retry.

**Query Parameters Expected**:
- `referenceNumber`: Our internal reference number
- `status`: Payment status (e.g., "failed", "declined", "timeout")
- `reason`: (optional) Failure reason message

**Example**:
```
https://everestfin.com/portal/sama-naffa/payment-failed?referenceNumber=SAMA_NAFFA-DEPOSIT-1728000000000-abc123&status=failed&reason=insufficient_funds
```

---

## 2. Callback URL (URL de notification serveur-à-serveur)

### Webhook Endpoint
```
https://everestfin.com/api/payments/intouch/callback
```

**Method**: `POST`

**Content-Type Supported**:
- `application/json` (preferred)
- `application/x-www-form-urlencoded` (also supported)

### Expected Data Format

The callback should be sent as a **POST request** with the following data structure:

#### JSON Format (Preferred):
```json
{
  "transactionId": "INTOUCH_TXN_123456789",
  "referenceNumber": "SAMA_NAFFA-DEPOSIT-1728000000000-abc123",
  "status": "success",
  "amount": 50000,
  "paymentMethod": "orange_money",
  "timestamp": "2025-10-03T10:30:00Z",
  "customerInfo": {
    "phone": "+221771234567",
    "email": "customer@example.com",
    "name": "Amadou Diallo"
  }
}
```

#### Form-Encoded Format (Alternative):
```
transactionId=INTOUCH_TXN_123456789&referenceNumber=SAMA_NAFFA-DEPOSIT-1728000000000-abc123&status=success&amount=50000&paymentMethod=orange_money&timestamp=2025-10-03T10:30:00Z
```

### Required Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `transactionId` | string | **Yes** | Intouch transaction identifier |
| `referenceNumber` | string | **Yes** | Merchant reference number (our internal reference) |
| `status` | string | **Yes** | Payment status (see status values below) |
| `amount` | number | **Yes** | Transaction amount in FCFA |
| `paymentMethod` | string | No | Payment channel used (orange_money, wave, etc.) |
| `timestamp` | string | No | ISO 8601 timestamp of the transaction |
| `customerInfo` | object | No | Customer information (phone, email, name) |

### Status Values

We support the following status values:

**Success/Completion**:
- `success`
- `completed`
- `paid`
- `ok`
- `processed`

**Pending**:
- `pending`
- `processing`
- `in_progress`
- `waiting`
- `init`
- `initialized`

**Failed**:
- `failed`
- `error`
- `declined`
- `rejected`
- `timeout`

**Cancelled**:
- `cancelled`
- `canceled`
- `aborted`

### Signature Verification

For security, we support HMAC-SHA256 signature verification:

**Header**: `X-Intouch-Signature` or `X-Signature`

**Format**: `sha256=<hex_digest>`

**Algorithm**:
1. Create HMAC-SHA256 hash of the raw request body using the shared webhook secret
2. Send the hash as hex string in the signature header
3. We'll verify the signature on our end

**Example** (Node.js):
```javascript
const crypto = require('crypto');
const signature = crypto
  .createHmac('sha256', WEBHOOK_SECRET)
  .update(rawRequestBody)
  .digest('hex');
  
// Send as header: X-Intouch-Signature: sha256=<signature>
```

### Response Format

Our callback endpoint will respond with:

**Success Response** (HTTP 200):
```json
{
  "success": true,
  "transactionId": "internal_txn_id",
  "status": "COMPLETED",
  "providerTransactionId": "INTOUCH_TXN_123456789",
  "message": "Transaction completed successfully"
}
```

**Error Response** (HTTP 400/404/500):
```json
{
  "error": "Error description",
  "status": "FAILED"
}
```

---

## 3. Merchant Configuration Details

### Merchant Information
- **Merchant ID**: `***REMOVED***` (to be confirmed)
- **Domain**: `https://everestfin.com`
- **Environment**: Production

### Reference Number Format

Our system generates reference numbers in the following format:
```
SAMA_NAFFA-{INTENT_TYPE}-{TIMESTAMP}-{RANDOM}
```

**Examples**:
- `SAMA_NAFFA-DEPOSIT-1728000000000-a1b2c3d4`
- `SAMA_NAFFA-INVESTMENT-1728000000000-x9y8z7w6`

**Constraints**:
- Maximum length: 100 characters
- Characters: alphanumeric, hyphens, underscores
- Must be unique per transaction

---

## 4. Testing & Validation

### Test Callback

To test the callback integration, Intouch can send a test POST request to:
```
https://everestfin.com/api/payments/intouch/callback
```

With test data:
```json
{
  "transactionId": "TEST_123",
  "referenceNumber": "SAMA_NAFFA-DEPOSIT-1728000000000-test123",
  "status": "success",
  "amount": 1000
}
```

### Verification Endpoint

A GET request to the callback URL will return:
```json
{
  "status": "Intouch webhook endpoint active"
}
```

This can be used to verify that the endpoint is reachable.

---

## 5. Security & IP Restrictions

### SSL/TLS
- All endpoints use HTTPS (TLS 1.2+)
- No HTTP connections accepted

### IP Whitelisting
If required, we can provide our server IP addresses for whitelisting. Please confirm if this is needed.

### Webhook Secret
We will provide a shared webhook secret for HMAC signature verification. This should be kept confidential and used to sign all webhook requests.

---

## 6. Support & Monitoring

### Contact Information
- **Technical Contact**: [Your team's contact email]
- **Support Hours**: [Business hours]

### Logging
We maintain detailed logs of all webhook callbacks for troubleshooting:
- Request headers
- Request body
- Response status
- Processing errors

### Notification Settings
Please ensure webhook notifications are:
1. ✅ Enabled for our merchant account
2. ✅ Configured with retry logic for temporary failures
3. ✅ Set to send immediately after payment completion

---

## Summary Checklist for Intouch Team

- [ ] Configure Success Redirect URL: `https://everestfin.com/portal/sama-naffa/payment-success`
- [ ] Configure Failure Redirect URL: `https://everestfin.com/portal/sama-naffa/payment-failed`
- [ ] Configure Webhook Callback URL: `https://everestfin.com/api/payments/intouch/callback`
- [ ] Enable webhook notifications for merchant ID `***REMOVED***`
- [ ] Test webhook delivery with sample payload
- [ ] Confirm webhook secret for signature verification
- [ ] Verify redirect URL accessibility from Intouch servers
- [ ] Provide any IP restrictions or firewall requirements

---

**Document Version**: 1.0  
**Last Updated**: 10/03/2025  
**Status**: Pending Intouch Team Configuration
