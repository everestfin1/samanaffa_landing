// Shared types for Sama Naffa platform

// Enums
export type KycStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW'
export type AccountType = 'SAMA_NAFFA' | 'APE_INVESTMENT'
export type AccountStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
export type IntentType = 'DEPOSIT' | 'INVESTMENT' | 'WITHDRAWAL'
export type TransactionStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED' | 'FAILED'
export type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW'
export type AdminRole = 'ADMIN' | 'MANAGER' | 'SUPPORT'
export type ApeSubscriptionStatus = 'PENDING' | 'PAYMENT_INITIATED' | 'PAYMENT_SUCCESS' | 'PAYMENT_FAILED' | 'CANCELLED'
export type FormDraftStatus = 'ABANDONED' | 'CONTACTED' | 'CONVERTED' | 'DISMISSED'
export type SponsorCodeStatus = 'ACTIVE' | 'INACTIVE' | 'EXPIRED'

// User types
export interface User {
  id: string
  email: string
  phone: string
  firstName: string
  lastName: string
  dateOfBirth?: Date | null
  nationality?: string | null
  address?: string | null
  city?: string | null
  preferredLanguage: string
  emailVerified: boolean
  phoneVerified: boolean
  kycStatus: KycStatus
  createdAt: Date
  updatedAt: Date
  civilite?: string | null
  country?: string | null
  region?: string | null
}

// Account types
export interface UserAccount {
  id: string
  userId: string
  accountType: AccountType
  accountNumber: string
  productCode?: string | null
  productName?: string | null
  balance: string
  status: AccountStatus
  createdAt: Date
}

// Transaction types
export interface TransactionIntent {
  id: string
  userId: string
  accountId: string
  accountType: AccountType
  intentType: IntentType
  amount: string
  paymentMethod: string
  status: TransactionStatus
  referenceNumber: string
  providerTransactionId?: string | null
  providerStatus?: string | null
  createdAt: Date
  updatedAt: Date
}

// Admin types
export interface AdminUser {
  id: string
  email: string
  name: string
  role: AdminRole
  isActive: boolean
  createdAt: Date
  lastLogin?: Date | null
}

// APE Subscription types
export interface ApeSubscription {
  id: string
  civilite?: string | null
  nom: string
  prenom: string
  dateNaissance?: Date | null
  lieuNaissance?: string | null
  nationalite?: string | null
  adresse?: string | null
  telephone: string
  email?: string | null
  nombreTitres: number
  montantSouscription: string
  modePaiement: string
  status: ApeSubscriptionStatus
  sponsorCode?: string | null
  createdAt: Date
  updatedAt: Date
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Pagination types
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
