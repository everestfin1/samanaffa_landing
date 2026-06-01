/** Must match `auto-rows-[…]` on the dashboard grid in EditableDashboard. */
export const DASHBOARD_GRID_ROW_PX = 180
/** Must match `gap-5` (1.25rem) on the dashboard grid. */
export const DASHBOARD_GRID_GAP_PX = 20

export function dashboardRowSpan(n: number): number {
  return Math.max(1, Math.min(4, Math.round(n) || 1))
}

/** Explicit min-height so row span is visible even when Tailwind row-span utilities are purged. */
export function dashboardCardMinHeight(rowSpan: number): number {
  const span = dashboardRowSpan(rowSpan)
  return span * DASHBOARD_GRID_ROW_PX + (span - 1) * DASHBOARD_GRID_GAP_PX
}

export function dashboardGridRowStyle(rowSpan: number): { gridRow: string; minHeight: number } {
  const span = dashboardRowSpan(rowSpan)
  return {
    gridRow: `span ${span} / span ${span}`,
    minHeight: dashboardCardMinHeight(span),
  }
}

// Tailwind-safe col-span class resolver (JIT requires literal strings)
export const colSpanClass = (n: number): string => {
  const map: Record<number, string> = {
    1: 'lg:col-span-1',
    2: 'lg:col-span-2',
    3: 'lg:col-span-3',
    4: 'lg:col-span-4',
    5: 'lg:col-span-5',
    6: 'lg:col-span-6',
    7: 'lg:col-span-7',
    8: 'lg:col-span-8',
    9: 'lg:col-span-9',
    10: 'lg:col-span-10',
    11: 'lg:col-span-11',
    12: 'lg:col-span-12',
  }
  return map[Math.max(1, Math.min(12, n))] ?? 'lg:col-span-3'
}

// Tailwind-safe row-span class resolver
export const rowSpanClass = (n: number): string => {
  const map: Record<number, string> = {
    1: 'row-span-1',
    2: 'row-span-2',
    3: 'row-span-3',
    4: 'row-span-4',
  }
  return map[Math.max(1, Math.min(4, n))] ?? 'row-span-1'
}
