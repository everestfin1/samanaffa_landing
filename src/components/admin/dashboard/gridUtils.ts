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
