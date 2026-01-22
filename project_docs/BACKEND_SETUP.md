# Sama Naffa Backend Setup Guide (Monorepo)

## 🚀 Quick Start

This guide will help you set up the backend for the Sama Naffa platform in a monorepo with:

- Frontend: TanStack Start
- Backend: Hono (Vercel Serverless - Node)
- Database: PostgreSQL (Neon recommended)

## 📋 Prerequisites

- [Bun](https://bun.sh/) installed
- PostgreSQL database (local or cloud)
- Vercel account (for Vercel Blob)
- Email service (Gmail/SendGrid)
- Twilio account (for SMS OTP)

## 🛠 Installation & Setup

### 1. Install Dependencies

```bash
bun install
```

### 2. Environment Variables

Copy the example environment file and configure your variables.

In the monorepo target, environment variables are split between:

- Frontend (`apps/web`)
- Backend (`apps/backend`)

```bash
cp env.example .env.local
```

Update `.env.local` (or Vercel project env vars) with your actual values.

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/sama_naffa_db"

# Auth (user)
# better-auth (target state)
BETTER_AUTH_URL="http://localhost:3000"
BETTER_AUTH_SECRET="your-secret-key-here"

# Vercel Blob
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxx"

# Email (Nodemailer)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"

# Twilio (SMS OTP)
TWILIO_ACCOUNT_SID="your-twilio-account-sid"
TWILIO_AUTH_TOKEN="your-twilio-auth-token"
TWILIO_PHONE_NUMBER="+1234567890"

# Admin Configuration
ADMIN_EMAIL="admin@samanaffa.com"
ADMIN_PASSWORD="secure-admin-password"

# Backend
ADMIN_JWT_SECRET="change-me"

# Application
NODE_ENV="development"
```

### 3. Database Setup

#### Option A: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database:
   ```sql
   CREATE DATABASE sama_naffa_db;
   ```
3. Update `DATABASE_URL` in `.env.local`

#### Option B: Cloud Database (Recommended)

- **Neon**: Free PostgreSQL hosting
- **Supabase**: Free PostgreSQL with additional features
- **Railway**: Simple PostgreSQL hosting

### 4. Run Database Migration

```bash
bunx prisma migrate dev --name init
```

### 5. Generate Prisma Client

```bash
bunx prisma generate
```

### 6. Seed Database (Optional)

```bash
bunx prisma db seed
```

## 🔧 Service Configuration

### Vercel Blob Setup

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to Storage → Blob
3. Create a new Blob store
4. Copy the `BLOB_READ_WRITE_TOKEN` to your `.env.local`

### Email Service Setup

#### Gmail (Recommended for Development)

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use your Gmail address and the app password in `.env.local`

#### SendGrid (Recommended for Production)

1. Create a SendGrid account
2. Generate an API key
3. Update `SENDGRID_API_KEY` in `.env.local`

### Twilio Setup (SMS OTP)

1. Create a Twilio account
2. Get your Account SID and Auth Token
3. Purchase a phone number
4. Update Twilio credentials in `.env.local`

## 🚀 Running the Application

### Development Mode

```bash
bun run dev
```

The frontend will be available at `http://localhost:3000`.

The backend will be exposed via its own Vercel project URL in production; in development you can run it locally and point the frontend to it via an env variable (e.g. `BACKEND_URL`).

### Production Build

```bash
bun run build
bun run start
```

## 📡 API Endpoints

### Authentication (User)

- `POST /api/auth/send-otp` - Send OTP to user
- `POST /api/auth/verify-otp` - Verify OTP and authenticate
- NextAuth is legacy; target state is better-auth in the backend service.

### User Management

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/accounts` - Get user accounts

### Transaction Intents

- `POST /api/transactions/intent` - Create transaction intent
- `GET /api/transactions/intent?userId=xxx` - Get user's transaction intents

### KYC Documents

- `POST /api/kyc/upload` - Upload KYC document
- `GET /api/kyc/upload?userId=xxx` - Get user's KYC documents

### Admin

- `GET /api/admin/users` - List all users
- `GET /api/admin/transactions` - List all transaction intents
- `PUT /api/admin/transactions/[id]` - Update transaction intent status

### Payments (Intouch)

- `POST /api/payments/intouch/callback` - Webhook callback (verify signature + update DB + return 200)

## 🗄 Database Schema

The database includes the following main tables:

- **users** - User profiles and authentication
- **user_accounts** - Sama Naffa and APE investment accounts
- **transaction_intents** - User transaction requests
- **kyc_documents** - KYC document storage
- **otp_codes** - Temporary OTP storage
- **sessions** - User sessions
- **admin_users** - Admin user management

## 🔒 Security Features

- OTP-based authentication (no passwords)
- Rate limiting on OTP requests
- File type validation for KYC documents
- Input sanitization
- Session-based authentication
- Admin role-based access

## 📧 Email Templates

The system includes pre-built email templates for:

- OTP verification
- Transaction intent confirmations
- Admin notifications
- Status updates

## 🧪 Testing

### Test OTP Flow

1. Send OTP: `POST /api/auth/send-otp`
2. Verify OTP: `POST /api/auth/verify-otp`
3. Access protected routes

### Test Transaction Intent

1. Create transaction intent: `POST /api/transactions/intent`
2. Check admin dashboard for notification
3. Update status: `PUT /api/admin/transactions/[id]`

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check `DATABASE_URL` format
   - Ensure PostgreSQL is running
   - Verify database exists

2. **OTP Not Sending**
   - Check email/SMS service credentials
   - Verify rate limiting settings
   - Check service quotas

3. **File Upload Issues**
   - Verify Vercel Blob token
   - Check file size limits
   - Validate file types

4. **Authentication Errors**
   - Check `NEXTAUTH_SECRET`
   - Verify session configuration
   - Check OTP expiry settings

### Debug Mode

Enable debug logging by setting:

```bash
NODE_ENV=development
DEBUG=*
```

## 📈 Monitoring

### Key Metrics to Monitor

- OTP delivery success rate
- Transaction intent creation rate
- File upload success rate
- API response times
- Database connection health

### Logs

- Application logs: Check console output
- Database logs: Check PostgreSQL logs
- Email logs: Check email service dashboard
- SMS logs: Check Twilio console

## 🔄 Deployment

### Vercel Deployment

In the monorepo target, you will deploy two Vercel projects:

1. Frontend (TanStack Start)
2. Backend (Hono API)

### Environment Variables for Production

Ensure all environment variables are set in your production environment:

- Database connection string
- NextAuth secret
- Vercel Blob token
- Email service credentials
- Twilio credentials
- Admin configuration

## 📚 Next Steps

1. **Set up monitoring** - Add application monitoring
2. **Implement rate limiting** - Add API rate limiting
3. **Add logging** - Implement structured logging
4. **Set up backups** - Configure database backups
5. **Add tests** - Write unit and integration tests

## 🆘 Support

For issues or questions:

1. Check the troubleshooting section
2. Review the API documentation
3. Check the database schema
4. Verify environment configuration

---

**Ready to launch!** 🚀

Your Sama Naffa backend is now set up and ready for the 2-week MVP launch.
