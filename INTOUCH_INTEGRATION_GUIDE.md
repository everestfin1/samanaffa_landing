# Intouch Payment Integration Guide

## Overview

This guide explains how to integrate Intouch payment provider into your Sama Naffa application. The integration allows users to make real-time payments for deposits, withdrawals, and investments using Intouch's payment system.

## Components Added

### 1. IntouchPayment Component (`src/components/payments/IntouchPayment.tsx`)

A React component that handles the Intouch payment flow:

- **Features:**
  - Loads Intouch payment script dynamically
  - Creates transaction intents before payment
  - Handles payment success/failure/cancellation
  - Provides real-time payment status updates
  - Integrates with your existing transaction system

- **Props:**
  - `amount`: Payment amount in FCFA
  - `userId`: User ID for transaction tracking
  - `accountType`: 'sama_naffa' or 'ape_investment'
  - `intentType`: 'deposit', 'investment', or 'withdrawal'
  - `referenceNumber`: Unique transaction reference
  - `onSuccess`: Callback for successful payments
  - `onError`: Callback for failed payments
  - `onCancel`: Callback for cancelled payments

### 2. Updated PaymentMethodSelect Component

Enhanced to support Intouch as a payment method:

- **Features:**
  - Shows Intouch as the primary payment option
  - Maintains existing UI/UX consistency
  - Supports both selection and display modes

### 3. Updated TransferModal Component

Modified to integrate Intouch payment flow:

- **Features:**
  - Automatically triggers Intouch payment when selected
  - Shows Intouch payment component for real-time processing
  - Falls back to WhatsApp for other payment methods
  - Handles payment success/failure scenarios

### 4. Intouch Callback API (`src/app/api/payments/intouch/callback/route.ts`)

Webhook endpoint for Intouch payment notifications:

- **Features:**
  - Receives payment status updates from Intouch
  - Updates transaction intents in database
  - Handles account balance updates
  - Sends confirmation emails to users
  - Supports both POST (webhook) and GET (verification) requests

## Environment Variables

Add these to your `.env` file:

```env
# Intouch Payment Provider
NEXT_PUBLIC_INTOUCH_MERCHANT_ID="***REMOVED***"
NEXT_PUBLIC_INTOUCH_API_KEY="***REMOVED***"
NEXT_PUBLIC_INTOUCH_DOMAIN="everestfin.com"
INTOUCH_WEBHOOK_SECRET="your-intouch-webhook-secret"
```

## Integration Flow

### 1. User Initiates Payment

1. User clicks "Effectuer un dépôt" or "Effectuer un retrait" in the portal
2. TransferModal opens with Intouch as the default payment method
3. User enters amount and clicks "Payer avec Intouch"

### 2. Payment Processing

1. IntouchPayment component creates a transaction intent
2. Intouch payment script is loaded and initialized
3. User is redirected to Intouch payment interface
4. Payment is processed through Intouch's system

### 3. Payment Completion

1. Intouch sends callback to `/api/payments/intouch/callback`
2. Transaction status is updated in database
3. Account balance is updated (for successful payments)
4. Confirmation email is sent to user
5. User is redirected back to the portal

## Configuration Steps

### 1. Set Up Environment Variables

Copy the Intouch configuration from `env.example` to your `.env` file:

```bash
cp env.example .env
# Edit .env with your Intouch credentials
```

### 2. Configure Intouch Backoffice

1. Log in to your Intouch backoffice at `bo.gutouch.com`
2. Configure webhook URL: `https://yourdomain.com/api/payments/intouch/callback`
3. Set up merchant ID and API key as provided by Intouch
4. Test the webhook connection

### 3. Update Portal Components

The portal components have been updated to pass the `accountType` to TransferModal:

```tsx
<TransferModal
  isOpen={showTransferModal}
  onClose={() => setShowTransferModal(false)}
  currentBalance={samaNaffaAccount.balance}
  type={transferType}
  accountName="Mon Compte Naffa Principal"
  accountType="sama_naffa"  // Added this prop
  onConfirm={handleTransferConfirm}
/>
```

## Testing the Integration

### 1. Test Payment Flow

1. Start your development server: `npm run dev`
2. Navigate to the portal and try to make a deposit
3. Verify that Intouch payment component loads
4. Test with Intouch's sandbox environment first

### 2. Test Webhook

1. Use Intouch's webhook testing tools
2. Send test callbacks to your endpoint
3. Verify database updates and email notifications

### 3. Monitor Logs

Check your application logs for:
- Intouch script loading
- Payment initiation
- Webhook callbacks
- Database updates

## Security Considerations

1. **Webhook Security**: Implement webhook signature verification
2. **Environment Variables**: Keep API keys secure
3. **HTTPS**: Ensure all payment flows use HTTPS
4. **Rate Limiting**: Implement rate limiting for payment endpoints

## Troubleshooting

### Common Issues

1. **Script Not Loading**: Check network connectivity and Intouch script URL
2. **Payment Not Processing**: Verify merchant ID and API key
3. **Webhook Not Receiving**: Check webhook URL configuration
4. **Database Updates Failing**: Verify database connection and permissions

### Debug Steps

1. Check browser console for JavaScript errors
2. Monitor network requests to Intouch
3. Verify webhook endpoint is accessible
4. Check database transaction logs

## Support

For technical support:
- Intouch Documentation: Contact Intouch support
- Application Issues: Check application logs
- Database Issues: Verify Prisma configuration

## Next Steps

1. **Production Deployment**: Update environment variables for production
2. **Monitoring**: Set up payment monitoring and alerts
3. **Analytics**: Track payment success rates and user behavior
4. **Optimization**: Monitor and optimize payment flow performance
