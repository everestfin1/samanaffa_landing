import { describe, expect, it } from 'vitest'
import {
  buildDashboardCardPatch,
  clampColSpan,
  clampRowSpan,
  resolveDashboardCardVariant,
  sanitizeDashboardCardLink,
  validateDashboardCardWrite,
} from '@/lib/admin/dashboard-config-validation'

describe('dashboard-config-validation', () => {
  it('clamps colSpan and rowSpan', () => {
    expect(clampColSpan(0)).toBe(1)
    expect(clampColSpan(99)).toBe(12)
    expect(clampRowSpan(-1)).toBe(1)
    expect(clampRowSpan(8)).toBe(4)
  })

  it('sanitizes admin links only', () => {
    expect(sanitizeDashboardCardLink('/admin/kyc')).toBe('/admin/kyc')
    expect(sanitizeDashboardCardLink('https://evil.com')).toBeNull()
    expect(sanitizeDashboardCardLink('/portal/dashboard')).toBeNull()
    expect(sanitizeDashboardCardLink('//evil.com')).toBeNull()
  })

  it('validates create payload', () => {
    const ok = validateDashboardCardWrite({
      title: 'Test',
      type: 'stat',
      dataSource: 'totalUsers',
      colSpan: 20,
    })
    expect(ok.ok).toBe(true)
    if (ok.ok) {
      expect(ok.data.colSpan).toBe(12)
      expect(ok.data.rowSpan).toBe(1)
    }

    const bad = validateDashboardCardWrite({ title: 'X', type: 'nope', dataSource: 'aum' })
    expect(bad.ok).toBe(false)
  })

  it('builds partial patch for PUT', () => {
    const patch = buildDashboardCardPatch({ visible: false, colSpan: 6 })
    expect(patch.ok).toBe(true)
    if (patch.ok) {
      expect(patch.data.visible).toBe(false)
      expect(patch.data.colSpan).toBe(6)
    }
  })

  it('resolveDashboardCardVariant prefers dataSource for charts', () => {
    expect(
      resolveDashboardCardVariant({ type: 'chart', dataSource: 'totalUsers' }),
    ).toBe('stat')
    expect(
      resolveDashboardCardVariant({ type: 'stat', dataSource: 'aum' }),
    ).toBe('aum')
    expect(
      resolveDashboardCardVariant({ type: 'stat', dataSource: 'kycAction' }),
    ).toBe('link')
  })
})
