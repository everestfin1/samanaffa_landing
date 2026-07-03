import type { DashboardCardConfig } from '@/lib/admin/types'
import type { DashboardCardType } from '@/lib/admin/dashboard-config-validation'

export type DashboardDataSourceId =
  | 'aum'
  | 'totalUsers'
  | 'pendingKyc'
  | 'underReviewKyc'
  | 'pendingTransactions'
  | 'processingTransactions'
  | 'completedTransactions'
  | 'failedTransactions'
  | 'totalDeposits'
  | 'totalInvestments'
  | 'recentActivity'
  | 'kycQueue'
  | 'kycAction'
  | 'transactionBreakdown'
  | 'apeTotal'
  | 'apePending'
  | 'apePaymentSuccess'
  | 'apeTotalAmount'
  | 'recentApe'
  | 'apeAction'
  | 'peeLeadsTotal'
  | 'peeNew'
  | 'peeConverted'
  | 'recentPee'
  | 'peeAction'
  | 'sponsorCodesTotal'
  | 'sponsorCodesActive'
  | 'sponsorAction'

export type DashboardCardVariant =
  | 'aum'
  | 'link'
  | 'list'
  | 'group'
  | 'stat'

export type DataSourceCategory =
  | 'treasury'
  | 'users'
  | 'transactions'
  | 'kyc'
  | 'ape'
  | 'pee'
  | 'sponsors'

export interface DataSourceMeta {
  id: DashboardDataSourceId
  label: string
  category: DataSourceCategory
  defaultType: DashboardCardType
  variant: DashboardCardVariant
  defaultTitle: string
  defaultIcon: string
  defaultLink?: string
  defaultColSpan?: number
  defaultRowSpan?: number
  isMoney?: boolean
}

export const DATA_SOURCE_CATEGORIES: { id: DataSourceCategory; label: string }[] = [
  { id: 'treasury', label: 'Trésorerie' },
  { id: 'users', label: 'Utilisateurs' },
  { id: 'transactions', label: 'Transactions' },
  { id: 'kyc', label: 'KYC' },
  { id: 'ape', label: 'APE Sénégal' },
  { id: 'pee', label: 'Leads PEE' },
  { id: 'sponsors', label: 'Codes parrain' },
]

export const DASHBOARD_DATA_SOURCE_REGISTRY: Record<DashboardDataSourceId, DataSourceMeta> = {
  aum: {
    id: 'aum',
    label: 'AUM (actifs sous gestion + tendance)',
    category: 'treasury',
    defaultType: 'chart',
    variant: 'aum',
    defaultTitle: 'Flux confirmés',
    defaultIcon: 'Wallet',
    defaultColSpan: 8,
    defaultRowSpan: 2,
  },
  totalUsers: {
    id: 'totalUsers',
    label: 'Clients enregistrés',
    category: 'users',
    defaultType: 'stat',
    variant: 'stat',
    defaultTitle: 'Clients enregistrés',
    defaultIcon: 'Users',
    defaultColSpan: 4,
    defaultRowSpan: 2,
  },
  totalDeposits: {
    id: 'totalDeposits',
    label: 'Dépôts confirmés (FCFA)',
    category: 'treasury',
    defaultType: 'stat',
    variant: 'stat',
    defaultTitle: 'Dépôts confirmés',
    defaultIcon: 'Wallet',
    isMoney: true,
  },
  totalInvestments: {
    id: 'totalInvestments',
    label: 'Investissements confirmés (FCFA)',
    category: 'treasury',
    defaultType: 'stat',
    variant: 'stat',
    defaultTitle: 'Investissements',
    defaultIcon: 'TrendingUp',
    isMoney: true,
  },
  pendingTransactions: {
    id: 'pendingTransactions',
    label: 'Transactions en attente',
    category: 'transactions',
    defaultType: 'stat',
    variant: 'stat',
    defaultTitle: 'Transactions en attente',
    defaultIcon: 'Clock',
  },
  processingTransactions: {
    id: 'processingTransactions',
    label: 'Transactions en cours',
    category: 'transactions',
    defaultType: 'stat',
    variant: 'stat',
    defaultTitle: 'En cours de traitement',
    defaultIcon: 'Clock',
  },
  completedTransactions: {
    id: 'completedTransactions',
    label: 'Transactions complétées',
    category: 'transactions',
    defaultType: 'stat',
    variant: 'stat',
    defaultTitle: 'Complétées',
    defaultIcon: 'CheckCircle2',
  },
  failedTransactions: {
    id: 'failedTransactions',
    label: 'Transactions échouées',
    category: 'transactions',
    defaultType: 'stat',
    variant: 'stat',
    defaultTitle: 'Échouées',
    defaultIcon: 'ExternalLink',
    defaultColSpan: 3,
  },
  recentActivity: {
    id: 'recentActivity',
    label: 'Dernières transactions',
    category: 'transactions',
    defaultType: 'list',
    variant: 'list',
    defaultTitle: 'Activité récente',
    defaultIcon: 'LayoutDashboard',
    defaultColSpan: 6,
    defaultRowSpan: 3,
    defaultLink: '/admin/transactions',
  },
  transactionBreakdown: {
    id: 'transactionBreakdown',
    label: 'Répartition transactions (attente / complétées)',
    category: 'transactions',
    defaultType: 'group',
    variant: 'group',
    defaultTitle: 'Transactions',
    defaultIcon: 'BarChart3',
    defaultColSpan: 6,
  },
  pendingKyc: {
    id: 'pendingKyc',
    label: 'KYC en attente (utilisateurs)',
    category: 'kyc',
    defaultType: 'stat',
    variant: 'stat',
    defaultTitle: 'KYC en attente',
    defaultIcon: 'ShieldCheck',
  },
  underReviewKyc: {
    id: 'underReviewKyc',
    label: 'KYC en révision',
    category: 'kyc',
    defaultType: 'stat',
    variant: 'stat',
    defaultTitle: 'KYC en révision',
    defaultIcon: 'ShieldCheck',
  },
  kycQueue: {
    id: 'kycQueue',
    label: 'File documents KYC à traiter',
    category: 'kyc',
    defaultType: 'list',
    variant: 'list',
    defaultTitle: 'File KYC',
    defaultIcon: 'ShieldCheck',
    defaultColSpan: 6,
    defaultRowSpan: 3,
    defaultLink: '/admin/kyc',
  },
  kycAction: {
    id: 'kycAction',
    label: 'Raccourci file KYC (CTA)',
    category: 'kyc',
    defaultType: 'link',
    variant: 'link',
    defaultTitle: 'Vérification KYC',
    defaultIcon: 'ShieldCheck',
    defaultColSpan: 6,
    defaultRowSpan: 2,
    defaultLink: '/admin/kyc',
  },
  apeTotal: {
    id: 'apeTotal',
    label: 'Souscriptions APE (total)',
    category: 'ape',
    defaultType: 'stat',
    variant: 'stat',
    defaultTitle: 'Souscriptions APE',
    defaultIcon: 'Users',
    defaultLink: '/admin/ape',
  },
  apePending: {
    id: 'apePending',
    label: 'APE en attente de paiement',
    category: 'ape',
    defaultType: 'stat',
    variant: 'stat',
    defaultTitle: 'APE en attente',
    defaultIcon: 'Clock',
    defaultLink: '/admin/ape',
  },
  apePaymentSuccess: {
    id: 'apePaymentSuccess',
    label: 'APE payées avec succès',
    category: 'ape',
    defaultType: 'stat',
    variant: 'stat',
    defaultTitle: 'APE payées',
    defaultIcon: 'CheckCircle2',
    defaultLink: '/admin/ape',
  },
  apeTotalAmount: {
    id: 'apeTotalAmount',
    label: 'Montant APE encaissé (FCFA)',
    category: 'ape',
    defaultType: 'stat',
    variant: 'stat',
    defaultTitle: 'Volume APE',
    defaultIcon: 'Wallet',
    isMoney: true,
    defaultLink: '/admin/ape',
  },
  recentApe: {
    id: 'recentApe',
    label: 'Dernières souscriptions APE',
    category: 'ape',
    defaultType: 'list',
    variant: 'list',
    defaultTitle: 'APE récentes',
    defaultIcon: 'List',
    defaultColSpan: 6,
    defaultRowSpan: 3,
    defaultLink: '/admin/ape',
  },
  apeAction: {
    id: 'apeAction',
    label: 'Raccourci APE (CTA)',
    category: 'ape',
    defaultType: 'link',
    variant: 'link',
    defaultTitle: 'APE Sénégal',
    defaultIcon: 'ArrowUpRight',
    defaultColSpan: 6,
    defaultRowSpan: 2,
    defaultLink: '/admin/ape',
  },
  peeLeadsTotal: {
    id: 'peeLeadsTotal',
    label: 'Leads PEE (total)',
    category: 'pee',
    defaultType: 'stat',
    variant: 'stat',
    defaultTitle: 'Leads PEE',
    defaultIcon: 'Users',
    defaultLink: '/admin/pee-leads',
  },
  peeNew: {
    id: 'peeNew',
    label: 'Leads PEE nouveaux',
    category: 'pee',
    defaultType: 'stat',
    variant: 'stat',
    defaultTitle: 'PEE nouveaux',
    defaultIcon: 'Clock',
    defaultLink: '/admin/pee-leads',
  },
  peeConverted: {
    id: 'peeConverted',
    label: 'Leads PEE convertis',
    category: 'pee',
    defaultType: 'stat',
    variant: 'stat',
    defaultTitle: 'PEE convertis',
    defaultIcon: 'CheckCircle2',
    defaultLink: '/admin/pee-leads',
  },
  recentPee: {
    id: 'recentPee',
    label: 'Derniers leads PEE',
    category: 'pee',
    defaultType: 'list',
    variant: 'list',
    defaultTitle: 'Leads PEE récents',
    defaultIcon: 'List',
    defaultColSpan: 6,
    defaultRowSpan: 3,
    defaultLink: '/admin/pee-leads',
  },
  peeAction: {
    id: 'peeAction',
    label: 'Raccourci leads PEE (CTA)',
    category: 'pee',
    defaultType: 'link',
    variant: 'link',
    defaultTitle: 'Leads PEE',
    defaultIcon: 'ArrowUpRight',
    defaultColSpan: 6,
    defaultRowSpan: 2,
    defaultLink: '/admin/pee-leads',
  },
  sponsorCodesTotal: {
    id: 'sponsorCodesTotal',
    label: 'Codes parrain (total)',
    category: 'sponsors',
    defaultType: 'stat',
    variant: 'stat',
    defaultTitle: 'Codes parrain',
    defaultIcon: 'Users',
    defaultLink: '/admin/sponsor-codes',
  },
  sponsorCodesActive: {
    id: 'sponsorCodesActive',
    label: 'Codes parrain actifs',
    category: 'sponsors',
    defaultType: 'stat',
    variant: 'stat',
    defaultTitle: 'Codes actifs',
    defaultIcon: 'CheckCircle2',
    defaultLink: '/admin/sponsor-codes',
  },
  sponsorAction: {
    id: 'sponsorAction',
    label: 'Raccourci codes parrain (CTA)',
    category: 'sponsors',
    defaultType: 'link',
    variant: 'link',
    defaultTitle: 'Codes parrain',
    defaultIcon: 'ArrowUpRight',
    defaultColSpan: 4,
    defaultRowSpan: 2,
    defaultLink: '/admin/sponsor-codes',
  },
}

export const DASHBOARD_DATA_SOURCES = Object.keys(
  DASHBOARD_DATA_SOURCE_REGISTRY,
) as DashboardDataSourceId[]

export const DASHBOARD_CARD_TEMPLATES: {
  id: string
  label: string
  dataSource: DashboardDataSourceId
}[] = [
  { id: 'tpl-kyc', label: 'File KYC', dataSource: 'kycAction' },
  { id: 'tpl-tx', label: 'Activité transactions', dataSource: 'recentActivity' },
  { id: 'tpl-ape', label: 'APE en attente', dataSource: 'apePending' },
  { id: 'tpl-ape-list', label: 'Liste APE', dataSource: 'recentApe' },
  { id: 'tpl-pee', label: 'Leads PEE', dataSource: 'peeNew' },
  { id: 'tpl-aum', label: 'AUM + graphique', dataSource: 'aum' },
]

export function getDataSourceMeta(id: string): DataSourceMeta | undefined {
  return DASHBOARD_DATA_SOURCE_REGISTRY[id as DashboardDataSourceId]
}

const LEGACY_CAMPAIGN_CATEGORIES: DataSourceCategory[] = ['ape', 'pee']

export function isLegacyCampaignDataSource(dataSource: string): boolean {
  const meta = getDataSourceMeta(dataSource)
  return meta ? LEGACY_CAMPAIGN_CATEGORIES.includes(meta.category) : false
}

export function filterLegacyCampaignDashboardCards<
  T extends { dataSource: string | null; link?: string | null },
>(cards: T[], hideLegacy: boolean): T[] {
  if (!hideLegacy) return cards
  return cards.filter((card) => {
    if (card.dataSource && isLegacyCampaignDataSource(card.dataSource)) return false
    const link = card.link
    if (
      typeof link === 'string' &&
      (link.startsWith('/admin/ape') ||
        link.startsWith('/admin/pee-leads'))
    ) {
      return false
    }
    return true
  })
}

export function getVisibleDataSourceCategories(hideLegacy: boolean) {
  if (!hideLegacy) return DATA_SOURCE_CATEGORIES
  return DATA_SOURCE_CATEGORIES.filter((c) => !LEGACY_CAMPAIGN_CATEGORIES.includes(c.id))
}

export function resolveDashboardCardVariant(card: {
  type: string
  dataSource: string
}): DashboardCardVariant {
  const meta = getDataSourceMeta(card.dataSource)
  if (meta) return meta.variant
  if (card.dataSource === 'aum') return 'aum'
  if (card.type === 'link') return 'link'
  if (card.type === 'list') return 'list'
  if (card.type === 'group') return 'group'
  return 'stat'
}

export interface DashboardMetrics {
  totalUsers: number
  pendingKyc: number
  underReviewKyc: number
  pendingTransactions: number
  processingTransactions: number
  completedTransactions: number
  failedTransactions: number
  totalDeposits: number
  totalInvestments: number
  apeTotal: number
  apePending: number
  apePaymentSuccess: number
  apeTotalAmount: number
  peeLeadsTotal: number
  peeNew: number
  peeContacted: number
  peeConverted: number
  sponsorCodesTotal: number
  sponsorCodesActive: number
}

export function buildDashboardMetrics(input: {
  stats: {
    totalUsers: number
    pendingKyc: number
    underReviewKyc: number
    pendingTransactions: number
    completedTransactions: number
    totalDeposits: number
    totalInvestments: number
    processingTransactions?: number
    failedTransactions?: number
  }
  apeStats: { total: number; pending: number; paymentSuccess: number; totalAmount: number }
  peeLeadStats: { total: number; new: number; contacted: number; converted: number }
  sponsorCodeStats: { total: number; active: number }
}): DashboardMetrics {
  return {
    ...input.stats,
    processingTransactions: input.stats.processingTransactions ?? 0,
    failedTransactions: input.stats.failedTransactions ?? 0,
    apeTotal: input.apeStats.total,
    apePending: input.apeStats.pending,
    apePaymentSuccess: input.apeStats.paymentSuccess,
    apeTotalAmount: input.apeStats.totalAmount,
    peeLeadsTotal: input.peeLeadStats.total,
    peeNew: input.peeLeadStats.new,
    peeContacted: input.peeLeadStats.contacted,
    peeConverted: input.peeLeadStats.converted,
    sponsorCodesTotal: input.sponsorCodeStats.total,
    sponsorCodesActive: input.sponsorCodeStats.active,
  }
}

export function resolveMetricValue(metrics: DashboardMetrics, dataSource: string): number {
  if (dataSource === 'aum') return metrics.totalDeposits + metrics.totalInvestments
  const key = dataSource as keyof DashboardMetrics
  const v = metrics[key]
  return typeof v === 'number' ? v : 0
}

export function isMoneyDataSource(dataSource: string): boolean {
  const meta = getDataSourceMeta(dataSource)
  if (meta?.isMoney) return true
  return dataSource === 'totalDeposits' || dataSource === 'totalInvestments'
}

export function listConfigForDataSource(dataSource: string): {
  listKey: 'recent' | 'kycQueue' | 'recentApe' | 'recentPee'
  viewAllHref: string
  emptyLabel: string
} {
  switch (dataSource) {
    case 'kycQueue':
      return { listKey: 'kycQueue', viewAllHref: '/admin/kyc', emptyLabel: 'Aucun document en attente.' }
    case 'recentApe':
      return { listKey: 'recentApe', viewAllHref: '/admin/ape', emptyLabel: 'Aucune souscription récente.' }
    case 'recentPee':
      return { listKey: 'recentPee', viewAllHref: '/admin/pee-leads', emptyLabel: 'Aucun lead PEE.' }
    default:
      return { listKey: 'recent', viewAllHref: '/admin/transactions', emptyLabel: 'Aucune transaction.' }
  }
}

export function linkSummaryForDataSource(
  dataSource: string,
  metrics: DashboardMetrics,
): { headline: string; subline: string } {
  switch (dataSource) {
    case 'apeAction':
      return {
        headline: `${metrics.apePending} en attente`,
        subline: `${metrics.apePaymentSuccess} payées · ${metrics.apeTotal} total`,
      }
    case 'peeAction':
      return {
        headline: `${metrics.peeNew} nouveaux`,
        subline: `${metrics.peeConverted} convertis · ${metrics.peeLeadsTotal} total`,
      }
    case 'sponsorAction':
      return {
        headline: `${metrics.sponsorCodesActive} actifs`,
        subline: `${metrics.sponsorCodesTotal} codes au total`,
      }
    default:
      return {
        headline: `${metrics.pendingKyc + metrics.underReviewKyc} dossiers`,
        subline: `${metrics.pendingKyc} en attente · ${metrics.underReviewKyc} en révision`,
      }
  }
}

export function defaultsFromDataSource(
  dataSource: DashboardDataSourceId,
  overrides?: Partial<DashboardCardConfig>,
): Partial<DashboardCardConfig> {
  const meta = DASHBOARD_DATA_SOURCE_REGISTRY[dataSource]
  return {
    title: meta.defaultTitle,
    type: meta.defaultType,
    dataSource: meta.id,
    color: overrides?.color ?? 'default',
    colSpan: meta.defaultColSpan ?? 3,
    rowSpan: meta.defaultRowSpan ?? 1,
    icon: meta.defaultIcon,
    link: meta.defaultLink,
    visible: true,
    ...overrides,
  }
}
