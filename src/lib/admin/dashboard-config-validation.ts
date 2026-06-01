import type { DashboardCardConfig } from '@/lib/admin/types'
import {
  DASHBOARD_DATA_SOURCES,
  resolveDashboardCardVariant,
} from '@/lib/admin/dashboard-data-registry'

export { DASHBOARD_DATA_SOURCES, resolveDashboardCardVariant }

export const DASHBOARD_CARD_TYPES = ['stat', 'chart', 'list', 'link', 'group'] as const
export type DashboardCardType = (typeof DASHBOARD_CARD_TYPES)[number]

export const DASHBOARD_ICONS = [
  'Wallet',
  'Users',
  'ShieldCheck',
  'Clock',
  'CheckCircle2',
  'TrendingUp',
  'ArrowUpRight',
  'LayoutDashboard',
  'BarChart3',
  'List',
  'ExternalLink',
] as const

const CARD_TYPE_SET = new Set<string>(DASHBOARD_CARD_TYPES)
const DATA_SOURCE_SET = new Set<string>(DASHBOARD_DATA_SOURCES)
const ICON_SET = new Set<string>(DASHBOARD_ICONS)

export function clampColSpan(value: unknown): number {
  const n = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(n)) return 3
  return Math.min(12, Math.max(1, Math.round(n)))
}

export function clampRowSpan(value: unknown): number {
  const n = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(n)) return 1
  return Math.min(4, Math.max(1, Math.round(n)))
}

/** Admin dashboard links must stay under /admin/ */
export function sanitizeDashboardCardLink(link: unknown): string | null {
  if (link === undefined || link === null || link === '') return null
  if (typeof link !== 'string') return null
  const trimmed = link.trim()
  if (!trimmed.startsWith('/admin/') || trimmed.startsWith('//')) return null
  if (trimmed.includes('://') || trimmed.includes('..')) return null
  return trimmed
}

export function parseDashboardCardType(value: unknown): DashboardCardType | null {
  if (typeof value !== 'string' || !CARD_TYPE_SET.has(value)) return null
  return value as DashboardCardType
}

export function parseDashboardDataSource(value: unknown): string | null {
  if (typeof value !== 'string' || !DATA_SOURCE_SET.has(value)) return null
  return value
}

export function parseDashboardIcon(value: unknown): string | null {
  if (value === undefined || value === null || value === '') return null
  if (typeof value !== 'string' || !ICON_SET.has(value)) return null
  return value
}

export type DashboardCardWriteInput = {
  title: string
  type: DashboardCardType
  dataSource: string
  color: string
  colSpan: number
  rowSpan: number
  order: number
  icon: string | null
  link: string | null
  visible: boolean
}

export function buildDashboardCardPatch(
  body: Record<string, unknown>,
): { ok: true; data: Partial<DashboardCardWriteInput> } | { ok: false; error: string } {
  const data: Partial<DashboardCardWriteInput> = {}

  if (body.title !== undefined) {
    const title = typeof body.title === 'string' ? body.title.trim() : ''
    if (!title) return { ok: false, error: 'Title is required' }
    data.title = title
  }
  if (body.type !== undefined) {
    const type = parseDashboardCardType(body.type)
    if (!type) return { ok: false, error: 'Invalid type' }
    data.type = type
  }
  if (body.dataSource !== undefined) {
    const dataSource = parseDashboardDataSource(body.dataSource)
    if (!dataSource) return { ok: false, error: 'Invalid dataSource' }
    data.dataSource = dataSource
  }
  if (body.color !== undefined) {
    data.color = typeof body.color === 'string' && body.color.trim() ? body.color.trim() : 'default'
  }
  if (body.colSpan !== undefined) data.colSpan = clampColSpan(body.colSpan)
  if (body.rowSpan !== undefined) data.rowSpan = clampRowSpan(body.rowSpan)
  if (body.order !== undefined) {
    data.order = typeof body.order === 'number' && Number.isFinite(body.order) ? Math.round(body.order) : 0
  }
  if (body.icon !== undefined) data.icon = parseDashboardIcon(body.icon)
  if (body.link !== undefined) data.link = sanitizeDashboardCardLink(body.link)
  if (body.visible !== undefined) data.visible = body.visible !== false

  return { ok: true, data }
}

export function validateDashboardCardWrite(
  body: Record<string, unknown>,
  options: { requireTitle?: boolean } = {},
): { ok: true; data: DashboardCardWriteInput } | { ok: false; error: string } {
  const requireTitle = options.requireTitle !== false
  const title = typeof body.title === 'string' ? body.title.trim() : ''
  if (requireTitle && !title) {
    return { ok: false, error: 'Title, type, and dataSource are required' }
  }

  const type = parseDashboardCardType(body.type)
  const dataSource = parseDashboardDataSource(body.dataSource)
  if (!type || !dataSource) {
    return { ok: false, error: 'Invalid type or dataSource' }
  }

  const color = typeof body.color === 'string' && body.color.trim() ? body.color.trim() : 'default'

  return {
    ok: true,
    data: {
      title: title || 'Carte',
      type,
      dataSource,
      color,
      colSpan: clampColSpan(body.colSpan),
      rowSpan: clampRowSpan(body.rowSpan),
      order: typeof body.order === 'number' && Number.isFinite(body.order) ? Math.round(body.order) : 0,
      icon: parseDashboardIcon(body.icon),
      link: sanitizeDashboardCardLink(body.link),
      visible: body.visible !== false,
    },
  }
}

export function serializeDashboardCard(card: {
  id: string
  title: string
  type: string
  dataSource: string
  color: string
  colSpan: number
  rowSpan?: number | null
  order: number
  icon?: string | null
  link?: string | null
  visible: boolean
  createdAt: Date | string
  updatedAt: Date | string
}): DashboardCardConfig {
  return {
    id: card.id,
    title: card.title,
    type: card.type as DashboardCardConfig['type'],
    dataSource: card.dataSource,
    color: card.color,
    colSpan: card.colSpan,
    rowSpan: card.rowSpan ?? 1,
    order: card.order,
    icon: card.icon ?? undefined,
    link: card.link ?? undefined,
    visible: card.visible,
    createdAt: typeof card.createdAt === 'string' ? card.createdAt : card.createdAt.toISOString(),
    updatedAt: typeof card.updatedAt === 'string' ? card.updatedAt : card.updatedAt.toISOString(),
  }
}
