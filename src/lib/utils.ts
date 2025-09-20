import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Normalizes Senegalese phone numbers to a consistent format
 * Converts various formats to +221XXXXXXXXX (no spaces, no special chars)
 * @param phone - Phone number in any format
 * @returns Normalized phone number or null if invalid
 */
export function normalizeSenegalPhone(phone: string): string | null {
  if (!phone) return null

  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '')

  console.log('🧹 Phone cleaning:', { original: phone, cleaned, length: cleaned.length })

  // Handle different input formats in order of specificity:
  // 1. Already normalized: +221XXXXXXXXX (12 digits starting with 221)
  if (cleaned.startsWith('221') && cleaned.length === 12) {
    const result = `+${cleaned}`
    console.log('✅ Already normalized:', result)
    return result
  }

  // 2. With country code but no +: 221XXXXXXXXX (12 digits)
  if (cleaned.length === 12 && cleaned.startsWith('221')) {
    const result = `+${cleaned}`
    console.log('✅ Added + to 12-digit number:', result)
    return result
  }

  // 3. With leading zero: 0XXXXXXXXX (10 digits starting with 0) - remove leading 0
  if (cleaned.length === 10 && cleaned.startsWith('0')) {
    const result = `+221${cleaned.slice(1)}`
    console.log('✅ Removed leading 0 from 10-digit number:', result)
    return result
  }

  // 4. Without country code: XXXXXXXXX (9 digits) - add +221 prefix
  if (cleaned.length === 9) {
    const result = `+221${cleaned}`
    console.log('✅ Added +221 to 9-digit number:', result)
    return result
  }

  // 5. Without country code: XXXXXXXXXX (10 digits without leading 0) - add +221 prefix
  if (cleaned.length === 10 && !cleaned.startsWith('0')) {
    const result = `+221${cleaned}`
    console.log('✅ Added +221 to 10-digit number:', result)
    return result
  }

  // Invalid format
  console.log('❌ Invalid phone format:', { original: phone, cleaned, length: cleaned.length })
  return null
}

/**
 * Formats phone number for display (human-readable format)
 * @param phone - Normalized phone number (+221XXXXXXXXX)
 * @returns Formatted phone number for display
 */
export function formatPhoneForDisplay(phone: string): string {
  const normalized = normalizeSenegalPhone(phone)
  if (!normalized) return phone // Return original if can't normalize

  // Remove +221 prefix and format as XX XXX XX XX
  const digits = normalized.replace('+221', '')
  if (digits.length === 9) {
    return digits.replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4')
  }

  return normalized // Return normalized if can't format for display
}

/**
 * Validates if a phone number is a valid Senegalese number
 * @param phone - Phone number to validate
 * @returns true if valid, false otherwise
 */
export function isValidSenegalPhone(phone: string): boolean {
  const normalized = normalizeSenegalPhone(phone)
  if (!normalized) return false

  // Check if it matches Senegal mobile operators pattern
  const digits = normalized.replace('+221', '')
  const validPrefixes = ['77', '78', '76', '70', '75', '33', '32', '31']

  return digits.length === 9 && validPrefixes.some(prefix => digits.startsWith(prefix))
}

export function generateAccountNumber(prefix: string): string {
  const timestamp = Date.now().toString().slice(-8)
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `${prefix}-${timestamp}-${random}`
}

export function generateReferenceNumber(
  accountType: 'sama_naffa' | 'ape_investment',
  intentType: 'deposit' | 'investment' | 'withdrawal',
  userId: string,
  createdAt: Date
): string {
  const prefix = accountType === 'sama_naffa' ? 'SN' : 'APE'
  const intentCode = intentType === 'deposit' ? 'DEP' : 
                    intentType === 'investment' ? 'INV' : 'WIT'
  const date = createdAt.toISOString().slice(0, 10).replace(/-/g, '')
  const time = createdAt.toTimeString().slice(0, 8).replace(/:/g, '')
  const userShort = userId.slice(-3)
  
  // For now, we'll use a simple sequence. In production, you might want to track this in the database
  const sequence = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  
  return `${prefix}-${intentCode}-${date}-${time}-${userShort}-${sequence}`
}

export function formatCurrency(amount: number, currency: string = 'FCFA'): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF', // West African CFA franc
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace('XOF', currency)
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone: string): boolean {
  // Basic phone validation for Senegalese numbers
  const phoneRegex = /^(\+221|221)?[0-9]{9}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '')
}

export function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function calculateAccountBalance(
  completedTransactions: Array<{
    intentType: string
    amount: number
  }>
): number {
  let balance = 0
  
  for (const transaction of completedTransactions) {
    if (transaction.intentType === 'DEPOSIT') {
      balance += Number(transaction.amount)
    } else if (transaction.intentType === 'WITHDRAWAL') {
      balance -= Number(transaction.amount)
    }
    // INVESTMENT transactions don't affect the main account balance
  }
  
  return balance
}