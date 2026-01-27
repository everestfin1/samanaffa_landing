import { apiUrl } from '../../../lib/api-config'

export interface IntouchTransaction {
  id: string
  idTransaction: string
  telephone: string
  montant: number
  service?: string
  date: string
  idPartenaireDistributeur: string
  reference?: string
  statut?: string
}

export interface ReconciliationMatch {
  apeReferenceNumber: string
  apeId: string
  apeTelephone: string
  apeMontant: number
  intouchMontant: number
  intouchTransactionId: string
  intouchDate: string
  matchType: 'exact' | 'amount_mismatch'
  discrepancy?: number
}

export interface ReconciliationResult {
  matches: ReconciliationMatch[]
  notFoundInApe: IntouchTransaction[]
  notFoundInIntouch: string[]
  summary: {
    total: number
    exact: number
    amountMismatch: number
    notFound: number
  }
}

export interface AnalyzeReconciliationResponse {
  success: boolean
  result: ReconciliationResult
}

export interface ApplyReconciliationResponse {
  success: boolean
  updated: number
  subscriptions: unknown[]
}

export async function analyzeReconciliation(intouchTransactions: IntouchTransaction[]): Promise<AnalyzeReconciliationResponse> {
  const token = localStorage.getItem('admin_token')

  const response = await fetch(apiUrl('/api/admin/reconciliation/analyze'), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ intouchTransactions }),
  })

  if (!response.ok) {
    throw new Error('Failed to analyze reconciliation file')
  }

  return response.json()
}

export async function applyReconciliation(matches: ReconciliationMatch[]): Promise<ApplyReconciliationResponse> {
  const token = localStorage.getItem('admin_token')

  const response = await fetch(apiUrl('/api/admin/reconciliation/apply'), {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ matches }),
  })

  if (!response.ok) {
    throw new Error('Failed to apply reconciliation')
  }

  return response.json()
}
