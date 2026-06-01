import { describe, expect, it } from 'vitest'
import {
  buildDashboardMetrics,
  linkSummaryForDataSource,
  resolveDashboardCardVariant,
  resolveMetricValue,
} from '@/lib/admin/dashboard-data-registry'

describe('dashboard-data-registry', () => {
  const metrics = buildDashboardMetrics({
    stats: {
      totalUsers: 10,
      pendingKyc: 2,
      underReviewKyc: 1,
      pendingTransactions: 3,
      processingTransactions: 1,
      completedTransactions: 20,
      failedTransactions: 2,
      totalDeposits: 1_000_000,
      totalInvestments: 500_000,
    },
    apeStats: { total: 5, pending: 2, paymentSuccess: 3, totalAmount: 800_000 },
    peeLeadStats: { total: 4, new: 2, contacted: 1, converted: 1 },
    sponsorCodeStats: { total: 6, active: 4 },
  })

  it('resolves APE and PEE metrics', () => {
    expect(resolveMetricValue(metrics, 'apePending')).toBe(2)
    expect(resolveMetricValue(metrics, 'peeNew')).toBe(2)
    expect(resolveMetricValue(metrics, 'aum')).toBe(1_500_000)
  })

  it('routes chart type with non-aum source to stat variant', () => {
    expect(resolveDashboardCardVariant({ type: 'chart', dataSource: 'apePending' })).toBe('stat')
    expect(resolveDashboardCardVariant({ type: 'stat', dataSource: 'aum' })).toBe('aum')
    expect(resolveDashboardCardVariant({ type: 'stat', dataSource: 'kycAction' })).toBe('link')
  })

  it('builds CTA summaries per domain', () => {
    expect(linkSummaryForDataSource('apeAction', metrics).headline).toContain('2')
    expect(linkSummaryForDataSource('peeAction', metrics).headline).toContain('2')
  })
})
