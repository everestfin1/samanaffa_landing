import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { parsePhoneNumber, isValidPhoneNumber, isPossiblePhoneNumber } from 'libphonenumber-js'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Normalizes Senegalese phone numbers to a consistent format
 * Uses libphonenumber-js for reliable parsing and formatting
 * @param phone - Phone number in any format
 * @returns Normalized phone number or null if invalid
 */
export function normalizeSenegalPhone(phone: string): string | null {
  if (!phone) return null

  try {
    // Try to parse with Senegal as default country
    const phoneNumber = parsePhoneNumber(phone, 'SN')
    if (phoneNumber && phoneNumber.isValid()) {
      return phoneNumber.number
    }

    // If that fails, try parsing as international number
    const internationalNumber = parsePhoneNumber(phone)
    if (internationalNumber && internationalNumber.country === 'SN' && internationalNumber.isValid()) {
      return internationalNumber.number
    }

    return null
  } catch (error) {
    console.log('❌ Invalid phone format:', { original: phone, error })
    return null
  }
}

/**
 * Formats phone number for display (human-readable format)
 * Uses libphonenumber-js for consistent formatting
 * @param phone - Phone number in any format
 * @returns Formatted phone number for display
 */
export function formatPhoneForDisplay(phone: string): string {
  if (!phone) return ''

  try {
    const phoneNumber = parsePhoneNumber(phone)
    if (phoneNumber) {
      // Return in national format for better readability
      return phoneNumber.formatNational()
    }
    return phone // Return original if can't parse
  } catch (error) {
    return phone // Return original if parsing fails
  }
}

/**
 * Validates if a phone number is a valid Senegalese number
 * Uses libphonenumber-js for accurate validation
 * @param phone - Phone number to validate
 * @returns true if valid, false otherwise
 */
export function isValidSenegalPhone(phone: string): boolean {
  if (!phone) return false

  try {
    const phoneNumber = parsePhoneNumber(phone, 'SN')
    return phoneNumber ? phoneNumber.country === 'SN' && phoneNumber.isValid() : false
  } catch (error) {
    return false
  }
}

export function generateAccountNumber(prefix: string): string {
  const timestamp = Date.now().toString().slice(-8)
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `${prefix}-${timestamp}-${random}`
}

export function addMonths(date: Date, months: number): Date {
  const result = new Date(date.getTime())
  const desiredMonth = result.getMonth() + months
  result.setMonth(desiredMonth)

  // Handle cases where adding months rolls over to the next month (e.g., Jan 31 + 1 month)
  if (result.getMonth() !== ((desiredMonth % 12) + 12) % 12) {
    result.setDate(0)
  }

  return result
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
  
  return `${prefix}-${intentCode}-${date}-${time}-${userShort}-${sequence}`.replace(/_/g, '-');
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

/**
 * Basic phone validation for legacy compatibility
 * @deprecated Use isValidPhoneNumber from libphonenumber-js instead
 */
export function validatePhone(phone: string): boolean {
  try {
    return isValidPhoneNumber(phone, 'SN')
  } catch {
    return false
  }
}

/**
 * Validates international phone numbers using libphonenumber-js
 * @param phone - Phone number with or without country code
 * @param countryCode - ISO country code (optional, for default country)
 * @returns true if valid, false otherwise
 */
export function validateInternationalPhone(phone: string, countryCode?: string): boolean {
  try {
    if (countryCode) {
      return isValidPhoneNumber(phone, countryCode.toUpperCase() as any)
    }
    return isValidPhoneNumber(phone)
  } catch {
    return false
  }
}

/**
 * Formats phone number for international display
 * @param phone - Phone number with country code
 * @returns Formatted phone number
 */
export function formatInternationalPhoneForDisplay(phone: string): string {
  if (!phone) return ''

  // If already in good format, return as is
  if (phone.includes(' ') && phone.startsWith('+')) return phone

  // Try to format based on country code
  const cleaned = phone.replace(/[^\d+]/g, '')
  if (!cleaned.startsWith('+')) return phone

  // Extract parts
  const match = cleaned.match(/^(\+\d{1,4})(\d+)$/)
  if (!match) return phone

  const countryCode = match[1]
  const localNumber = match[2]

  // Format based on country
  switch (countryCode) {
    case '+221': // Senegal
      if (localNumber.length === 9) {
        return `${countryCode} ${localNumber.slice(0, 2)} ${localNumber.slice(2, 5)} ${localNumber.slice(5, 7)} ${localNumber.slice(7)}`
      }
      break
    case '+33': // France
      if (localNumber.length === 9) {
        return `${countryCode} ${localNumber.slice(0, 1)} ${localNumber.slice(1, 3)} ${localNumber.slice(3, 5)} ${localNumber.slice(5, 7)} ${localNumber.slice(7)}`
      }
      break
    case '+1': // USA/Canada
      if (localNumber.length === 10) {
        return `${countryCode} (${localNumber.slice(0, 3)}) ${localNumber.slice(3, 6)}-${localNumber.slice(6)}`
      }
      break
    case '+44': // UK
      if (localNumber.length === 10) {
        return `${countryCode} ${localNumber.slice(0, 4)} ${localNumber.slice(4, 7)} ${localNumber.slice(7)}`
      }
      break
  }

  // Default formatting
  return `${countryCode} ${localNumber}`
}

/**
 * Normalizes international phone numbers to a consistent format
 * Accepts any country code and formats as +XXXXXXXXXXXX
 * @param phone - Phone number in any international format
 * @returns Normalized phone number or null if invalid
 */
export function normalizeInternationalPhone(phone: string): string | null {
  if (!phone) return null

  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, '')

  // Must start with + and have at least country code + local number
  if (!cleaned.startsWith('+') || cleaned.length < 5) {
    return null
  }

  // Extract country code and local number
  const parts = cleaned.substring(1).split(/(\d{1,4})/).filter(p => p.length > 0)
  if (parts.length < 2) {
    return null
  }

  const countryCodeNum = parts[0]
  const localNumber = parts.slice(1).join('')

  // Validate minimum lengths based on country code
  const countryCode = `+${countryCodeNum}`
  if (countryCode === '+221' && localNumber.length !== 9) return null // Senegal
  if ((countryCode === '+33' || countryCode === '+49') && localNumber.length < 9) return null // France, Germany
  if (countryCode === '+1' && localNumber.length !== 10) return null // USA/Canada
  if (countryCode === '+44' && (localNumber.length < 10 || localNumber.length > 11)) return null // UK

  // Generic validation for other countries
  if (localNumber.length < 6 || localNumber.length > 15) return null

  return `${countryCode}${localNumber}`
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
