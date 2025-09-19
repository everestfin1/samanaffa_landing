import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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