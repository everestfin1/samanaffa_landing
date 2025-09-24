# Phone Number Normalization System

This document explains the phone number normalization system implemented to ensure consistent phone number formatting across the entire Sama Naffa application.

## 🎯 Problem Solved

Previously, phone numbers were stored inconsistently in the database:
- User entered: `77XXXXXXX`
- Stored as: `77 722 88 45` (with spaces)
- Login failed because formats didn't match

## ✅ Solution Implemented

### 1. Standardized Phone Format
All phone numbers are now normalized to: `+221XXXXXXXXX`
- Country code: `+221` (Senegal)
- No spaces or special characters
- Consistent 12-digit format

### 2. Supported Input Formats
The system accepts various input formats and converts them to the standard format:

| Input Format | Example | Normalized Output |
|-------------|---------|-------------------|
| 9 digits | `77XXXXXXX` | `+22177XXXXXXX` |
| 10 digits (with 0) | `077XXXXXXX` | `+22177XXXXXXX` |
| 10 digits (without 0) | `77XXXXXXX0` | `+22177XXXXXXX` |
| 12 digits (with +221) | `+22177XXXXXXX` | `+22177XXXXXXX` |
| 12 digits (without +) | `22177XXXXXXX` | `+22177XXXXXXX` |
| With spaces | `77 722 88 45` | `+22177XXXXXXX` |

### 3. Validation Rules
Phone numbers must:
- Start with valid Senegal mobile operator prefixes: `77`, `78`, `76`, `70`, `75`, `33`, `32`, `31`
- Be exactly 9 digits after country code
- Pass format validation

## 🔧 Implementation Details

### Core Functions (`src/lib/utils.ts`)

```typescript
// Normalize any phone format to +221XXXXXXXXX
normalizeSenegalPhone(phone: string): string | null

// Format for display (77 123 45 67)
formatPhoneForDisplay(phone: string): string

// Validate Senegal phone number
isValidSenegalPhone(phone: string): boolean
```

### Updated Components

#### Registration Flow
- **Step1PersonalInfo**: Normalizes phone internally, displays user-friendly format
- **Registration validation**: Uses new `isValidSenegalPhone()` function

#### Login Flow
- **Unified input field**: Auto-detects email vs phone
- **Normalization**: Converts all phone inputs to standard format before API calls

#### API Endpoints
- **send-otp**: Normalizes phone numbers before user lookup
- **verify-otp**: Normalizes phone numbers for user verification
- **NextAuth**: Normalizes phone numbers in credentials provider

## 🚀 How to Use

### For New Registrations
Users can enter phone numbers in any supported format:
- `77XXXXXXX` ✅
- `77 722 88 45` ✅
- `+221 77 722 88 45` ✅

All will be stored as `+22177XXXXXXX`

### For Login
Users can login with any phone format:
- System automatically normalizes before lookup
- Works with existing users regardless of stored format

### For Development
```bash
# Run phone number normalization on existing data
npm run db:normalize-phones
# or
bun run db:normalize-phones
```

## 📊 Database Migration

### Before Migration
```sql
-- Mixed formats in database
phone: "77 722 88 45"
phone: "77XXXXXXX"
phone: "+221771234567"
```

### After Migration
```sql
-- Consistent format
phone: "+22177XXXXXXX"
phone: "+22177XXXXXXX"
phone: "+221771234567"
```

## 🧪 Testing

### Test Cases
```typescript
// These should all normalize to "+22177XXXXXXX"
normalizeSenegalPhone("77XXXXXXX")        // ✅ +22177XXXXXXX
normalizeSenegalPhone("77 722 88 45")     // ✅ +22177XXXXXXX
normalizeSenegalPhone("+22177XXXXXXX")    // ✅ +22177XXXXXXX
normalizeSenegalPhone("077XXXXXXX")       // ✅ +22177XXXXXXX
```

### Validation Tests
```typescript
isValidSenegalPhone("+22177XXXXXXX")      // ✅ true
isValidSenegalPhone("+221999999999")      // ❌ false (invalid prefix)
isValidSenegalPhone("123456789")          // ❌ false (invalid format)
```

## 🔒 Security & Privacy

- Phone numbers are normalized before database storage
- Consistent format prevents authentication bypasses
- All SMS OTP delivery uses normalized format
- No PII leakage through inconsistent formatting

## 📈 Benefits

1. **Consistency**: All phone numbers use the same format
2. **Reliability**: Authentication works regardless of input format
3. **User Experience**: Users can enter phones in familiar formats
4. **SMS Delivery**: Reliable OTP delivery with consistent numbers
5. **Database Integrity**: Clean, standardized data storage
6. **Future-Proof**: Easy to extend for other countries

## 🛠️ Maintenance

### Adding New Countries
To support other countries, update:
1. `normalizeSenegalPhone()` function for new country codes
2. `isValidSenegalPhone()` for new validation rules
3. Operator prefixes list

### Monitoring
- Check logs for normalization failures
- Monitor SMS delivery success rates
- Validate new phone number formats in testing

## 📞 Support

If you encounter phone number formatting issues:
1. Check the normalization logs: `npm run db:normalize-phones`
2. Verify Twilio configuration for Senegal numbers
3. Test with different input formats
4. Check database for inconsistent phone formats
