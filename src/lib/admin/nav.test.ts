import { describe, expect, it, afterEach } from 'vitest'
import { getVisibleAdminNavGroups, isAdminNavItemVisible } from '@/lib/admin/nav'

describe('admin nav visibility', () => {
  const original = process.env.NEXT_PUBLIC_APE_DEPRECATED

  afterEach(() => {
    if (original === undefined) {
      delete process.env.NEXT_PUBLIC_APE_DEPRECATED
    } else {
      process.env.NEXT_PUBLIC_APE_DEPRECATED = original
    }
  })

  it('hides legacy APE/PEE items in mono-produit mode', () => {
    delete process.env.NEXT_PUBLIC_APE_DEPRECATED
    expect(isAdminNavItemVisible('apeSubscriptions')).toBe(false)
    expect(isAdminNavItemVisible('peeLeads')).toBe(false)
    expect(isAdminNavItemVisible('transactions')).toBe(true)
    expect(isAdminNavItemVisible('abandonedLeads')).toBe(true)
  })

  it('shows legacy items when APE_DEPRECATED=false', () => {
    process.env.NEXT_PUBLIC_APE_DEPRECATED = 'false'
    expect(isAdminNavItemVisible('apeSubscriptions')).toBe(true)
    const ids = getVisibleAdminNavGroups().flatMap((g) => g.items.map((i) => i.id))
    expect(ids).toContain('apeSubscriptions')
  })
})
