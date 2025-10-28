import { z } from 'zod'

// Environment variable schema with validation
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  
  // NextAuth
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters'),
  NEXTAUTH_URL: z.string().url().optional(),
  
  // Email Service (SendGrid)
  SENDGRID_API_KEY: z.string().min(1, 'SENDGRID_API_KEY is required'),
  FROM_EMAIL: z.string().email('FROM_EMAIL must be a valid email'),
  
  // SMS Service (Twilio)
  TWILIO_ACCOUNT_SID: z.string().min(1, 'TWILIO_ACCOUNT_SID is required'),
  TWILIO_AUTH_TOKEN: z.string().min(1, 'TWILIO_AUTH_TOKEN is required'),
  TWILIO_PHONE_NUMBER: z.string().min(1, 'TWILIO_PHONE_NUMBER is required'),
  
  // Payment Service (Intouch)
  INTOUCH_API_KEY: z.string().min(1, 'INTOUCH_API_KEY is required'),
  INTOUCH_SECRET: z.string().min(1, 'INTOUCH_SECRET is required'),
  INTOUCH_BASE_URL: z.string().url('INTOUCH_BASE_URL must be a valid URL'),
  INTOUCH_CALLBACK_URL: z.string().url('INTOUCH_CALLBACK_URL must be a valid URL'),
  
  // Rate Limiting
  ADMIN_RATE_LIMIT_MAX_ATTEMPTS: z.string().transform(Number).pipe(z.number().min(1)).default(5),
  ADMIN_RATE_LIMIT_WINDOW_MS: z.string().transform(Number).pipe(z.number().min(1000)).default(900000),
  ADMIN_RATE_LIMIT_BLOCK_MS: z.string().transform(Number).pipe(z.number().min(1000)).default(3600000),
  
  LOGIN_RATE_LIMIT_MAX_ATTEMPTS: z.string().transform(Number).pipe(z.number().min(1)).default(5),
  LOGIN_RATE_LIMIT_WINDOW_MS: z.string().transform(Number).pipe(z.number().min(1000)).default(900000),
  LOGIN_RATE_LIMIT_BLOCK_MS: z.string().transform(Number).pipe(z.number().min(1000)).default(1800000),
  
  OTP_RATE_LIMIT_MAX_ATTEMPTS: z.string().transform(Number).pipe(z.number().min(1)).default(3),
  OTP_RATE_LIMIT_WINDOW_MS: z.string().transform(Number).pipe(z.number().min(1000)).default(3600000),
  OTP_RATE_LIMIT_BLOCK_MS: z.string().transform(Number).pipe(z.number().min(1000)).default(3600000),
  
  TRANSACTION_RATE_LIMIT_MAX_ATTEMPTS: z.string().transform(Number).pipe(z.number().min(1)).default(10),
  TRANSACTION_RATE_LIMIT_WINDOW_MS: z.string().transform(Number).pipe(z.number().min(1000)).default(60000),
  TRANSACTION_RATE_LIMIT_BLOCK_MS: z.string().transform(Number).pipe(z.number().min(1000)).default(300000),
  
  KYC_RATE_LIMIT_MAX_ATTEMPTS: z.string().transform(Number).pipe(z.number().min(1)).default(5),
  KYC_RATE_LIMIT_WINDOW_MS: z.string().transform(Number).pipe(z.number().min(1000)).default(3600000),
  KYC_RATE_LIMIT_BLOCK_MS: z.string().transform(Number).pipe(z.number().min(1000)).default(3600000),
  
  // File Upload
  MAX_FILE_SIZE: z.string().transform(Number).pipe(z.number().min(1024)).default(5242880), // 5MB
  ALLOWED_FILE_TYPES: z.string().default('image/jpeg,image/png,image/pdf,application/pdf'),
  
  // Security
  BCRYPT_ROUNDS: z.string().transform(Number).pipe(z.number().min(10).max(15)).default(12),
  SESSION_MAX_AGE: z.string().transform(Number).pipe(z.number().min(300)).default(2592000), // 30 days
  
  // Application
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).pipe(z.number().min(1).max(65535)).default(3000),
})

// Validate environment variables
function validateEnv() {
  try {
    const env = envSchema.parse(process.env)
    return env
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Environment Variable Validation Error:')
      error.issues.forEach((err: any) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`)
      })
      console.error('\nPlease check your .env file and ensure all required variables are set.')
      process.exit(1)
    }
    console.error('❌ Unexpected error validating environment variables:', error)
    process.exit(1)
  }
}

// Export validated environment variables
export const env = validateEnv()

// Export types for TypeScript usage
export type Env = z.infer<typeof envSchema>

// Helper function to check if we're in production
export const isProduction = env.NODE_ENV === 'production'

// Helper function to check if we're in development
export const isDevelopment = env.NODE_ENV === 'development'

// Helper function to check if we're in test
export const isTest = env.NODE_ENV === 'test'

// Log environment status (without sensitive data)
console.log(`🚀 Application starting in ${env.NODE_ENV} mode`)
console.log(`📊 Rate limiting configured:`)
console.log(`  - Admin: ${env.ADMIN_RATE_LIMIT_MAX_ATTEMPTS} attempts per ${env.ADMIN_RATE_LIMIT_WINDOW_MS}ms`)
console.log(`  - Login: ${env.LOGIN_RATE_LIMIT_MAX_ATTEMPTS} attempts per ${env.LOGIN_RATE_LIMIT_WINDOW_MS}ms`)
console.log(`  - OTP: ${env.OTP_RATE_LIMIT_MAX_ATTEMPTS} attempts per ${env.OTP_RATE_LIMIT_WINDOW_MS}ms`)
console.log(`  - Transaction: ${env.TRANSACTION_RATE_LIMIT_MAX_ATTEMPTS} attempts per ${env.TRANSACTION_RATE_LIMIT_WINDOW_MS}ms`)
console.log(`  - KYC: ${env.KYC_RATE_LIMIT_MAX_ATTEMPTS} attempts per ${env.KYC_RATE_LIMIT_WINDOW_MS}ms`)
