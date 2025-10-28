import DOMPurify from 'isomorphic-dompurify'

// HTML sanitization options
const sanitizeOptions = {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
  ALLOWED_ATTR: [],
  KEEP_CONTENT: true,
}

export function sanitizeHTML(input: string): string {
  if (typeof input !== 'string') {
    return ''
  }
  
  return DOMPurify.sanitize(input, sanitizeOptions)
}

export function sanitizeText(input: string): string {
  if (typeof input !== 'string') {
    return ''
  }
  
  // Remove HTML tags and decode HTML entities
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .trim()
}

export function sanitizeFilename(filename: string): string {
  if (typeof filename !== 'string') {
    return 'file'
  }
  
  // Remove or replace dangerous characters
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace non-alphanumeric chars with underscore
    .replace(/\.{2,}/g, '.') // Replace multiple dots with single dot
    .replace(/^\.+|\.+$/g, '') // Remove leading/trailing dots
    .substring(0, 255) // Limit length
}

export function validateEmail(email: string): boolean {
  if (typeof email !== 'string') {
    return false
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

export function validatePhone(phone: string): boolean {
  if (typeof phone !== 'string') {
    return false
  }
  
  // Basic phone validation - adjust regex based on your requirements
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

export function validateAmount(amount: string | number): boolean {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  
  if (isNaN(numAmount)) {
    return false
  }
  
  // Check if amount is positive and reasonable
  return numAmount > 0 && numAmount <= 1000000 // Max 1 million
}

export function escapeSQL(input: string): string {
  if (typeof input !== 'string') {
    return ''
  }
  
  // Basic SQL injection prevention (ORM should handle this, but extra safety)
  return input
    .replace(/'/g, "''") // Escape single quotes
    .replace(/;/g, '') // Remove semicolons
    .replace(/--/g, '') // Remove SQL comments
    .replace(/\/\*/g, '') // Remove block comment start
    .replace(/\*\//g, '') // Remove block comment end
}

// Input validation for common fields
export function validateInput(input: any, type: 'string' | 'number' | 'email' | 'phone' | 'amount'): boolean {
  if (input === null || input === undefined) {
    return false
  }
  
  switch (type) {
    case 'string':
      return typeof input === 'string' && input.trim().length > 0
    case 'number':
      return typeof input === 'number' && !isNaN(input)
    case 'email':
      return validateEmail(input)
    case 'phone':
      return validatePhone(input)
    case 'amount':
      return validateAmount(input)
    default:
      return false
  }
}
