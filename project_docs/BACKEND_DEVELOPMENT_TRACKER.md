# Sama Naffa Platform - Streamlined Backend Development Tracker

**Version:** 2.0 (UPDATED - Streamlined MVP Strategy)  
**Last Updated:** September 19, 2025  
**Status:** 🔄 In Progress  

## 📊 Project Overview

This document tracks the **streamlined backend development** for rapid market entry. Focus on **transaction intent capture** rather than complex financial processing to launch in 2 weeks and start building user base immediately.

### 🎯 Streamlined Development Strategy
- **Approach:** Next.js Full-Stack (API Routes + Frontend)
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js with OTP integration
- **Core Focus:** User profiles + dual account setup + transaction intent system
- **Payment Processing:** Manual (via email notifications to admin/managers)
- **Timeline:** 2 weeks to MVP launch
- **Philosophy:** Validate demand first, build complex features later

---

## 🏗️ Streamlined Backend Components (2-Week MVP)

### 1. Database & User Foundation
- [ ] **PostgreSQL Database Setup**
  - [ ] Local development database
  - [ ] Production database configuration
  - [ ] Prisma ORM configuration
  
- [ ] **Core Database Schema**
  - [ ] Users table (auth, profile, KYC status)
  - [ ] User accounts (auto-created Sama Naffa + APE)
  - [ ] Transaction intents (user requests)
  - [ ] KYC documents table
  - [ ] Admin users table

**Priority:** 🔴 Critical  
**Estimated Time:** 1-2 days  
**Dependencies:** None  

### 2. Authentication & User Management (OTP-Only)
- [x] **NextAuth.js Setup**
  - [x] Install and configure NextAuth.js
  - [x] Session management configuration
  - [x] OTP generation and validation
  - [x] Rate limiting for OTP requests
  
- [x] **OTP Delivery System**
  - [x] Nodemailer configuration for email OTP
  - [x] Twilio integration for SMS OTP
  - [x] OTP template management
  - [x] Delivery status tracking
  
- [x] **User Registration System**
  - [x] Email/phone registration with OTP verification
  - [x] Profile creation workflow
  - [x] Auto-create both accounts (Sama Naffa + APE)
  - [x] Session-based authentication (no passwords)
  
- [x] **User Profile Management**
  - [x] Profile CRUD operations
  - [x] Language preferences (FR/EN)
  - [x] Communication settings
  - [x] KYC document upload

**Priority:** 🔴 Critical  
**Estimated Time:** 2-3 days  
**Dependencies:** Database setup  

### 3. Transaction Intent System (Core Innovation)
- [x] **Intent Capture System**
  - [x] Sama Naffa deposit requests
  - [x] APE investment requests (with tranche selection)
  - [x] Payment method selection
  - [x] User notes and preferences
  
- [x] **Email Notification System**
  - [x] Send transaction requests to admin/managers
  - [x] User confirmation emails
  - [x] Status update notifications
  - [x] Email templates (FR/EN)

**Priority:** 🔴 Critical  
**Estimated Time:** 2-3 days  
**Dependencies:** User system  

### 4. Basic KYC Management
- [x] **Document Management**
  - [x] Secure file upload (Vercel Blob)
  - [x] Document type validation
  - [x] KYC status tracking
  - [x] Admin review interface

**Priority:** 🟡 High  
**Estimated Time:** 1-2 days  
**Dependencies:** User system  

### 5. Admin Dashboard (Simplified)
- [x] **User Management**
  - [x] View registered users
  - [x] KYC status management
  - [x] User search and filtering
  
- [x] **Transaction Intent Management**
  - [x] View all transaction requests
  - [x] Update request status
  - [x] Add admin notes
  - [x] Contact tracking

**Priority:** 🟡 High  
**Estimated Time:** 2-3 days  
**Dependencies:** Core systems  

### 6. API Routes Structure (OTP-Based)
- [x] **Authentication Endpoints**
  - [x] `POST /api/auth/send-otp` - Send OTP (email/SMS)
  - [x] `POST /api/auth/verify-otp` - Verify OTP and create session
  - [x] `GET /api/auth/[...nextauth]` - NextAuth.js endpoints
  
- [x] **User Management Endpoints**
  - [x] `GET /api/users/profile` - Get user profile
  - [x] `PUT /api/users/profile` - Update user profile
  - [x] `GET /api/accounts` - Get user's accounts
  - [x] `POST /api/kyc/upload` - Upload KYC documents
  
- [x] **Transaction Intent Endpoints**
  - [x] `POST /api/transactions/intent` - Submit transaction request
  - [x] `GET /api/transactions/intent` - Get user's transaction history
  
- [x] **Admin Endpoints**
  - [x] `GET /api/admin/users` - List users (admin only)
  - [x] `GET /api/admin/transactions` - List all intents (admin only)
  - [x] `PUT /api/admin/transactions/:id` - Update intent status (admin only)
  - [x] `POST /api/admin/auth/login` - Admin login with JWT
  - [x] `POST /api/admin/auth/logout` - Admin logout

**Priority:** 🔴 Critical  
**Estimated Time:** 1 day  
**Dependencies:** All core systems  

### 7. Frontend Integration (Current Phase)
- [ ] **Authentication Flow Updates**
  - [ ] Replace mock login with OTP-based authentication
  - [ ] Update registration flow to use backend APIs
  - [ ] Implement proper session management
  - [ ] Add loading states and error handling
  
- [ ] **User Profile Integration**
  - [ ] Connect profile management to backend
  - [ ] Implement KYC document upload
  - [ ] Add account information display
  - [ ] Update user preferences handling
  
- [ ] **Transaction Intent Integration**
  - [ ] Connect transaction forms to backend APIs
  - [ ] Implement real-time status updates
  - [ ] Add transaction history display
  - [ ] Update notification system
  
- [ ] **Admin Dashboard Integration**
  - [ ] Connect admin dashboard to backend
  - [ ] Implement real-time data updates
  - [ ] Add proper error handling
  - [ ] Update user management interface

**Priority:** 🔴 Critical  
**Estimated Time:** 3-4 days  
**Dependencies:** Backend APIs completed  

---

## 📋 Detailed Database Schema

### Core Tables Structure
```sql
-- Users (main authentication and profile - OTP-only)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    nationality VARCHAR(100),
    address TEXT,
    city VARCHAR(100),
    preferred_language VARCHAR(5) DEFAULT 'fr',
    email_verified BOOLEAN DEFAULT false,
    phone_verified BOOLEAN DEFAULT false,
    kyc_status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- OTP Sessions (managed by Lucid Auth)
CREATE TABLE otp_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- OTP Codes (temporary storage)
CREATE TABLE otp_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    code VARCHAR(6) NOT NULL,
    type VARCHAR(20) NOT NULL, -- 'email' or 'sms'
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Accounts (auto-created: Sama Naffa + APE)
CREATE TABLE user_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    account_type VARCHAR(20) NOT NULL, -- 'sama_naffa' or 'ape_investment'
    account_number VARCHAR(50) UNIQUE NOT NULL,
    balance DECIMAL(15,2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transaction Intents (core innovation)
CREATE TABLE transaction_intents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    account_type VARCHAR(20) NOT NULL,
    intent_type VARCHAR(20) NOT NULL, -- 'deposit', 'investment', 'withdrawal'
    amount DECIMAL(15,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    investment_tranche CHAR(1), -- A, B, C, D (for APE only)
    investment_term INTEGER, -- 3, 5, 7, 10 years (for APE only)
    user_notes TEXT,
    admin_notes TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    reference_number VARCHAR(50) UNIQUE NOT NULL, -- Auto-generated format
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- KYC Documents
CREATE TABLE kyc_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verification_status VARCHAR(20) DEFAULT 'pending',
    admin_notes TEXT
);

-- Admin Users
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(200) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin',
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```  

---

## 📧 Email Notification System

### Transaction Intent Email Templates

#### For Sama Naffa Deposit Requests
```
Subject: 🏦 Nouvelle demande de dépôt Sama Naffa - [User Name]

Bonjour,

Une nouvelle demande de dépôt a été reçue :

👤 CLIENT
• Nom : [First Name] [Last Name]
• Email : [Email]
• Téléphone : [Phone]
• Compte : [Account Number]

💰 TRANSACTION
• Type : Dépôt Sama Naffa
• Montant : [Amount] FCFA
• Méthode : [Payment Method]
• Notes client : "[User Notes]"

📋 RÉFÉRENCE
• Numéro : [Reference Number]
• Date : [Date]
• Statut : En attente de contact

👋 ACTION REQUISE
Veuillez contacter le client dans les 24h pour finaliser la transaction.

Lien admin : [Admin Dashboard URL]
```

#### For APE Investment Requests
```
Subject: 📈 Nouvelle demande d'investissement APE - [User Name]

Bonjour,

Une nouvelle demande d'investissement APE a été reçue :

👤 CLIENT
• Nom : [First Name] [Last Name]
• Email : [Email]
• Téléphone : [Phone]
• Compte : [Account Number]

🏛️ INVESTISSEMENT
• Type : Obligation d'État APE
• Tranche : [Tranche] ([Term] ans, [Rate]%)
• Montant : [Amount] FCFA
• Méthode : [Payment Method]
• Notes client : "[User Notes]"

📋 RÉFÉRENCE
• Numéro : [Reference Number]
• Date : [Date]
• Statut : En attente de contact

👋 ACTION REQUISE
Veuillez contacter le client pour finaliser l'investissement.

Lien admin : [Admin Dashboard URL]
```

### Reference Number Generation System

#### Format Specification
```
[ACCOUNT_PREFIX]-[INTENT_TYPE]-[YYYYMMDD]-[HHMMSS]-[USER_ID_SHORT]-[SEQUENCE]

Examples:
- SN-DEP-20250919-143052-001-001 (Sama Naffa Deposit)
- APE-INV-20250919-143052-001-001 (APE Investment)
- SN-WIT-20250919-143052-001-001 (Sama Naffa Withdrawal)
```

#### Components Breakdown
- **ACCOUNT_PREFIX**: `SN` (Sama Naffa) or `APE` (APE Investment)
- **INTENT_TYPE**: `DEP` (Deposit), `INV` (Investment), `WIT` (Withdrawal)
- **YYYYMMDD**: Date of intent creation
- **HHMMSS**: Time of intent creation (24-hour format)
- **USER_ID_SHORT**: First 3 digits of user ID for quick identification
- **SEQUENCE**: 3-digit sequence number for same user on same day

#### Implementation Logic
```typescript
function generateReferenceNumber(
  accountType: 'sama_naffa' | 'ape_investment',
  intentType: 'deposit' | 'investment' | 'withdrawal',
  userId: string,
  createdAt: Date
): string {
  const prefix = accountType === 'sama_naffa' ? 'SN' : 'APE';
  const intentCode = intentType === 'deposit' ? 'DEP' : 
                    intentType === 'investment' ? 'INV' : 'WIT';
  const date = createdAt.toISOString().slice(0, 10).replace(/-/g, '');
  const time = createdAt.toTimeString().slice(0, 8).replace(/:/g, '');
  const userShort = userId.slice(-3);
  
  // Get sequence number for this user on this day
  const sequence = await getSequenceNumber(userId, date);
  
  return `${prefix}-${intentCode}-${date}-${time}-${userShort}-${sequence.toString().padStart(3, '0')}`;
}
```

### Email Configuration
- **Provider:** SendGrid or AWS SES
- **Languages:** French (primary), English (secondary)
- **Delivery:** Real-time for transaction intents
- **Tracking:** Open rates, click rates, delivery status  

---

## 📅 2-Week Development Timeline

### Week 1: Core Foundation (Days 1-7)

#### Days 1-2: Database & OTP Authentication
- [x] Project analysis and streamlined planning
- [ ] PostgreSQL database setup (local + production)
- [ ] Prisma ORM configuration and schema
- [ ] Lucid Auth setup and configuration
- [ ] Nodemailer + Twilio OTP delivery system
- [ ] OTP-only user registration and login
- [ ] Auto-create dual accounts on registration

#### Days 3-4: Transaction Intent System
- [ ] Transaction intent capture API
- [ ] Email notification system setup
- [ ] Email templates (Sama Naffa + APE)
- [ ] Reference number generation
- [ ] User confirmation emails

#### Days 5-7: KYC & Basic Admin
- [ ] KYC document upload (Vercel Blob)
- [ ] KYC status management
- [ ] Basic admin authentication
- [ ] Admin view of users and intents
- [ ] Testing and bug fixes

### Week 2: Admin Dashboard & Integration (Days 8-14)

#### Days 8-10: Admin Dashboard
- [ ] Admin user management interface
- [ ] Transaction intent management
- [ ] Status update system
- [ ] Admin notes and tracking
- [ ] Email notification triggers

#### Days 11-12: Frontend Integration
- [ ] Connect existing UI to real APIs
- [ ] Replace mock data with real backend calls
- [ ] Error handling and loading states
- [ ] Form validation and submission

#### Days 13-14: Testing & Deployment
- [ ] End-to-end testing
- [ ] Production deployment setup
- [ ] Environment configuration
- [ ] Launch preparation and documentation

---

## 🎯 Success Metrics (2-Week MVP)

### Technical KPIs
- [ ] User registration completion rate > 85%
- [ ] Email delivery success rate > 98%
- [ ] API response time < 1s for all endpoints
- [ ] Zero critical security vulnerabilities
- [ ] 100% uptime during launch week

### Business KPIs
- [ ] 100+ user registrations in first week post-launch
- [ ] 50+ transaction intents submitted
- [ ] 24-hour admin response time to intents
- [ ] 80%+ user satisfaction with onboarding process
- [ ] 90%+ email open rate for transaction notifications

### User Experience KPIs
- [ ] Registration flow completion in < 5 minutes
- [ ] Transaction intent submission in < 3 minutes
- [ ] KYC document upload success rate > 95%
- [ ] Mobile responsiveness across all flows  

---

## 🔒 Security & Deployment Considerations

### Security Implementation
- **Data Encryption:** AES-256 for PII at rest, TLS 1.3 in transit
- **Authentication:** OTP-only with Lucid Auth session management
- **OTP Security:** 6-digit codes, 5-minute expiry, rate limiting
- **Rate Limiting:** Protect all public endpoints and OTP requests
- **Input Validation:** Sanitize all user inputs
- **File Upload Security:** Virus scanning, type validation
- **Audit Logging:** Track all admin actions and user transactions

### Production Deployment
- **Database:** PostgreSQL on AWS RDS with automated backups
- **File Storage:** Vercel Blob (MVP) → AWS S3 + CloudFront (Phase 2)
- **Application:** Vercel or AWS with auto-scaling
- **Monitoring:** Application monitoring and error tracking
- **Email:** SendGrid with delivery tracking

---

## 🚀 Post-Launch Roadmap

### Phase 2: Payment Integration (Weeks 3-6)
- [ ] Orange Money API integration
- [ ] Wave payment API integration
- [ ] Bank transfer automation
- [ ] Real-time payment processing
- [ ] Automated transaction confirmation
- [ ] **File Storage Migration:** Vercel Blob → AWS S3 + CloudFront CDN

### Phase 3: Advanced Features (Weeks 7-10)
- [ ] Savings calculators and goal tracking
- [ ] Investment portfolio management
- [ ] Automated savings challenges
- [ ] Advanced admin analytics
- [ ] Mobile app preparation

### Phase 4: Scale & Optimize (Weeks 11+)
- [ ] Performance optimization
- [ ] Advanced security features
- [ ] Multi-language support (Wolof)
- [ ] Regional expansion features
- [ ] AI-powered insights  

---

## 📁 Vercel Blob File Storage Implementation

### Why Vercel Blob for MVP
- **Zero Setup Time:** Works immediately with Next.js + Vercel
- **Cost-Effective:** Free tier (1GB storage, 1GB bandwidth/month)
- **Security Built-in:** Automatic HTTPS, access controls
- **Fast Implementation:** Simple API, TypeScript support
- **Migration Path:** Easy transition to AWS S3 in Phase 2

### KYC Document Upload Implementation
```typescript
// Install Vercel Blob
npm install @vercel/blob

// API Route: app/api/kyc/upload/route.ts
import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  
  // Validate file type (KYC documents only)
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
  }

  // Validate file size (max 10MB for KYC docs)
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large' }, { status: 400 });
  }

  try {
    const blob = await put(`kyc/${Date.now()}-${file.name}`, file, {
      access: 'public', // For admin review access
    });

    return NextResponse.json({
      url: blob.url,
      filename: file.name,
      size: file.size,
      uploadedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
```

### Environment Variables Required
```bash
# .env.local
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxx
```

### Migration Strategy to AWS S3 (Phase 2)
- **Data Migration:** Export all Vercel Blob files to S3
- **URL Updates:** Update database file URLs
- **CDN Setup:** Configure CloudFront for global delivery
- **Cost Optimization:** S3 lifecycle policies for old documents

---

## 🔐 OTP Authentication Implementation Details

### Lucid Auth Configuration
```typescript
// lucid-auth configuration
import { LucidAuth } from 'lucid-auth'

const auth = new LucidAuth({
  session: {
    expiresIn: '30d',
    updateAge: '1d',
  },
  otp: {
    length: 6,
    expiresIn: '5m',
    maxAttempts: 3,
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 OTP requests per window
  }
})
```

### OTP Delivery Setup
```typescript
// Nodemailer configuration for email OTP
const nodemailer = require('nodemailer')

const emailTransporter = nodemailer.createTransporter({
  service: 'gmail', // or your preferred service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

// Twilio configuration for SMS OTP
const twilio = require('twilio')
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)
```

### OTP Templates
```typescript
// Email OTP Template
const emailOTPTemplate = `
Bonjour,

Votre code de vérification Sama Naffa est : {OTP_CODE}

Ce code expire dans 5 minutes.

Si vous n'avez pas demandé ce code, ignorez cet email.

L'équipe Sama Naffa
`

// SMS OTP Template
const smsOTPTemplate = `Votre code Sama Naffa: {OTP_CODE}. Expire dans 5min.`
```

### Authentication Flow
1. **Registration/Login Request** → User enters email/phone
2. **OTP Generation** → System generates 6-digit code
3. **OTP Delivery** → Send via email (Nodemailer) or SMS (Twilio)
4. **OTP Verification** → User enters code, system validates
5. **Session Creation** → Lucid Auth creates secure session
6. **Account Access** → User gains access to portal

---

## 🔄 Update Log & Next Steps

| Date | Update | Status | Completed By |
|------|--------|---------|-------------|
| 2025-09-19 | Initial comprehensive tracker created | ✅ Complete | Assistant |
| 2025-09-19 | Streamlined to 2-week MVP strategy | ✅ Complete | Assistant |
| 2025-09-19 | Database schema and email templates defined | ✅ Complete | Assistant |
| 2025-09-19 | Updated to OTP-only auth with NextAuth.js | ✅ Complete | Assistant |
| 2025-09-19 | Database setup and Prisma configuration | ✅ Complete | Assistant |
| 2025-09-19 | Authentication system implementation | ✅ Complete | Assistant |
| 2025-09-19 | Transaction intent system | ✅ Complete | Assistant |
| 2025-09-19 | Admin dashboard with JWT security | ✅ Complete | Assistant |
| 2025-09-19 | Frontend integration plan created | ✅ Complete | Assistant |
| TBD | Frontend authentication integration | 🔄 Next | - |
| TBD | Frontend profile management integration | ⏳ Pending | - |
| TBD | Frontend transaction integration | ⏳ Pending | - |

---

## 🚀 Immediate Next Actions (Today)

### Priority 1: Frontend Integration
1. **Update Authentication Flow**
   - Replace mock login with OTP-based authentication
   - Update registration page to use backend APIs
   - Implement proper session management

2. **Connect User Profile Management**
   - Connect profile components to backend APIs
   - Implement KYC document upload
   - Add account information display

3. **Integrate Transaction Forms**
   - Connect transaction forms to backend APIs
   - Implement real-time status updates
   - Add transaction history display

### Priority 2: Testing & Deployment
1. **End-to-End Testing**
   - Test complete user flows
   - Verify API integrations
   - Test error scenarios

2. **Production Deployment**
   - Set up production database
   - Configure environment variables
   - Deploy to production environment

---

**Strategy Confirmed:** ✅ Streamlined 2-week MVP for rapid market entry  
**Focus:** Transaction intent capture + email notifications to admin/managers  
**Timeline:** 2 weeks to launch, payment integration in Phase 2  
**Next Review:** End of Week 1 (Progress checkpoint)  
**Document Owner:** Development Team
