import { describe, expect, it } from 'vitest'
import { dashboardCardMinHeight, dashboardGridRowStyle } from './gridUtils'

describe('gridUtils', () => {
  it('computes min height from row span', () => {
    expect(dashboardCardMinHeight(1)).toBe(180)
    expect(dashboardCardMinHeight(2)).toBe(380)
    expect(dashboardCardMinHeight(4)).toBe(780)
  })

  it('returns gridRow span style', () => {
    expect(dashboardGridRowStyle(3)).toEqual({
      gridRow: 'span 3 / span 3',
      minHeight: 580,
    })
  })
})
