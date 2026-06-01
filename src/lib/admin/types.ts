// Shared admin domain types, used by the data provider and route components.

export interface DashboardStats {
  totalUsers: number
  pendingKyc: number
  underReviewKyc: number
  pendingTransactions: number
  processingTransactions: number
  completedTransactions: number
  failedTransactions: number
  totalDeposits: number
  totalInvestments: number
}

export interface AdminUser {
  id: string
  email: string
  phone: string
  firstName: string
  lastName: string
  kycStatus: string
  createdAt: string
  stats: {
    totalTransactions: number
    totalKycDocuments: number
  }
}

export interface AdminTransaction {
  id: string
  referenceNumber: string
  user: {
    name: string
    email: string
    phone: string
  }
  intentType: string
  amount: number
  status: string
  createdAt: string
}

export interface KycDocument {
  id: string
  documentType: string
  fileName: string
  fileUrl: string
  uploadDate: string
  verificationStatus: string
  adminNotes?: string
  user: {
    id: string
    name: string
    email: string
    phone: string
    kycStatus: string
  }
}

export interface ApeSubscription {
  id: string
  referenceNumber: string
  civilite: string
  prenom: string
  nom: string
  email: string
  telephone: string
  paysResidence: string
  ville: string
  categorieSocioprofessionnelle: string
  trancheInteresse: string
  montantCfa: string
  codeParrainage?: string
  status: string
  providerTransactionId?: string
  providerStatus?: string
  paymentInitiatedAt?: string
  paymentCompletedAt?: string
  createdAt: string
  updatedAt: string
}

export interface ApeStats {
  total: number
  pending: number
  paymentInitiated: number
  paymentSuccess: number
  paymentFailed: number
  cancelled: number
  totalAmount: number
}

export interface SponsorCode {
  id: string
  code: string
  description?: string
  status: string
  usageCount: number
  maxUsage?: number
  expiresAt?: string
  createdAt: string
  updatedAt: string
  createdBy: string
  createdByAdmin?: {
    id: string
    name: string
    email: string
  }
}

export interface SponsorCodeStats {
  total: number
  active: number
  inactive: number
  expired: number
}

export interface PeeLead {
  id: string
  civilite: string
  prenom: string
  nom: string
  categorie: string
  pays: string
  ville: string
  telephone: string
  email?: string
  referenceNumber?: string
  montantCfa?: string | number
  status: string
  crmStatus?: string | null
  adminNotes?: string
  createdAt: string
  updatedAt: string
}

export interface PeeLeadStats {
  total: number
  new: number
  contacted: number
  converted: number
}

export const EMPTY_DASHBOARD_STATS: DashboardStats = {
  totalUsers: 0,
  pendingKyc: 0,
  underReviewKyc: 0,
  pendingTransactions: 0,
  processingTransactions: 0,
  completedTransactions: 0,
  failedTransactions: 0,
  totalDeposits: 0,
  totalInvestments: 0,
}

export const EMPTY_APE_STATS: ApeStats = {
  total: 0,
  pending: 0,
  paymentInitiated: 0,
  paymentSuccess: 0,
  paymentFailed: 0,
  cancelled: 0,
  totalAmount: 0,
}

export const EMPTY_SPONSOR_STATS: SponsorCodeStats = {
  total: 0,
  active: 0,
  inactive: 0,
  expired: 0,
}

export const EMPTY_PEE_STATS: PeeLeadStats = {
  total: 0,
  new: 0,
  contacted: 0,
  converted: 0,
}

export interface DashboardCardConfig {
  id: string
  title: string
  type: 'stat' | 'chart' | 'list' | 'link' | 'group'
  dataSource: string
  color: string
  colSpan: number
  rowSpan: number
  order: number
  icon?: string
  link?: string
  visible: boolean
  createdAt: string
  updatedAt: string
}
