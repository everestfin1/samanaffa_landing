import type { LucideIcon } from 'lucide-react'
import { isLegacyAdminNavHidden } from '@/lib/product-flags'
import {
  LayoutDashboard,
  Users,
  CreditCard,
  FileText,
  FileSpreadsheet,
  MessageSquare,
  Settings,
  Gift,
  GraduationCap,
  RefreshCw,
  Archive,
} from 'lucide-react'

export type AdminTabId =
  | 'overview'
  | 'users'
  | 'transactions'
  | 'kyc'
  | 'apeSubscriptions'
  | 'reconciliation'
  | 'sponsorCodes'
  | 'peeLeads'
  | 'abandonedLeads'
  | 'notifications'
  | 'settings'

export interface AdminNavItem {
  id: AdminTabId
  label: string
  icon: LucideIcon
  href: string
  badgeKey?: 'pendingKyc' | 'pendingTransactions' | 'paymentInitiated'
}

export interface AdminNavGroup {
  id: string
  label: string
  items: AdminNavItem[]
}

export const ADMIN_BASE_PATH = '/admin'

export const ADMIN_TAB_PATHS: Record<AdminTabId, string> = {
  overview: '/admin',
  transactions: '/admin/transactions',
  apeSubscriptions: '/admin/ape',
  reconciliation: '/admin/reconciliation',
  sponsorCodes: '/admin/sponsor-codes',
  peeLeads: '/admin/pee-leads',
  abandonedLeads: '/admin/abandoned-leads',
  users: '/admin/users',
  kyc: '/admin/kyc',
  notifications: '/admin/notifications',
  settings: '/admin/settings',
}

export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    id: 'pilotage',
    label: 'Pilotage',
    items: [{ id: 'overview', label: "Vue d'ensemble", icon: LayoutDashboard, href: ADMIN_TAB_PATHS.overview }],
  },
  {
    id: 'operations',
    label: 'Opérations',
    items: [
      { id: 'transactions', label: 'Transactions', icon: CreditCard, href: ADMIN_TAB_PATHS.transactions, badgeKey: 'pendingTransactions' },
      { id: 'apeSubscriptions', label: 'APE Sénégal', icon: FileSpreadsheet, href: ADMIN_TAB_PATHS.apeSubscriptions, badgeKey: 'paymentInitiated' },
      { id: 'reconciliation', label: 'Réconciliation', icon: RefreshCw, href: ADMIN_TAB_PATHS.reconciliation },
    ],
  },
  {
    id: 'acquisition',
    label: 'Acquisition',
    items: [
      { id: 'sponsorCodes', label: 'Codes parrainage', icon: Gift, href: ADMIN_TAB_PATHS.sponsorCodes },
      { id: 'peeLeads', label: 'PEE Leads', icon: GraduationCap, href: ADMIN_TAB_PATHS.peeLeads },
      { id: 'abandonedLeads', label: 'Leads abandonnés', icon: Archive, href: ADMIN_TAB_PATHS.abandonedLeads },
    ],
  },
  {
    id: 'conformite',
    label: 'Conformité',
    items: [
      { id: 'users', label: 'Utilisateurs', icon: Users, href: ADMIN_TAB_PATHS.users },
      { id: 'kyc', label: 'Vérification KYC', icon: FileText, href: ADMIN_TAB_PATHS.kyc, badgeKey: 'pendingKyc' },
    ],
  },
  {
    id: 'systeme',
    label: 'Système',
    items: [
      { id: 'notifications', label: 'Notifications', icon: MessageSquare, href: ADMIN_TAB_PATHS.notifications },
      { id: 'settings', label: 'Paramètres', icon: Settings, href: ADMIN_TAB_PATHS.settings },
    ],
  },
]

const LEGACY_ADMIN_TABS: AdminTabId[] = [
  'apeSubscriptions',
  'reconciliation',
  'sponsorCodes',
  'peeLeads',
]

export function isAdminNavItemVisible(id: AdminTabId): boolean {
  if (isLegacyAdminNavHidden() && LEGACY_ADMIN_TABS.includes(id)) {
    return false
  }
  return true
}

export function getVisibleAdminNavGroups(): AdminNavGroup[] {
  return ADMIN_NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => isAdminNavItemVisible(item.id)),
  })).filter((group) => group.items.length > 0)
}

const ALL_NAV_ITEMS: AdminNavItem[] = ADMIN_NAV_GROUPS.flatMap((g) => g.items)

/** Resolve the active tab id from a pathname. Longest matching href wins. */
export function tabIdFromPath(pathname: string): AdminTabId {
  const match = [...ALL_NAV_ITEMS]
    .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]
  return match?.id ?? 'overview'
}

/** Find the nav group that contains a given tab. */
export function groupForTab(tabId: AdminTabId): AdminNavGroup | undefined {
  return ADMIN_NAV_GROUPS.find((g) => g.items.some((i) => i.id === tabId))
}

export const ADMIN_TAB_META: Record<
  AdminTabId,
  { title: string; description: string }
> = {
  overview: {
    title: "Vue d'ensemble",
    description: 'Synthèse des utilisateurs, conformité et flux financiers.',
  },
  transactions: {
    title: 'Transactions',
    description: 'Suivi des dépôts et paiements, filtrage par statut.',
  },
  kyc: {
    title: 'Vérification KYC',
    description: 'Documents et décisions de conformité client.',
  },
  apeSubscriptions: {
    title: 'APE Sénégal',
    description: 'Souscriptions obligataires et états de paiement.',
  },
  reconciliation: {
    title: 'Réconciliation',
    description: 'Rapprochement des flux Intouch et du ledger.',
  },
  sponsorCodes: {
    title: 'Codes parrainage',
    description: 'Codes promotionnels pour les souscriptions APE Sénégal.',
  },
  peeLeads: {
    title: 'PEE Leads',
    description: 'Demandes de renseignement Plan Épargne Entreprise.',
  },
  abandonedLeads: {
    title: 'Leads abandonnés',
    description: 'Parcours d’inscription non terminés à relancer.',
  },
  users: {
    title: 'Utilisateurs',
    description: 'Comptes clients, statuts et historique.',
  },
  notifications: {
    title: 'Notifications',
    description: 'Campagnes push et paramètres d’envoi.',
  },
  settings: {
    title: 'Paramètres',
    description: 'Configuration plateforme et préférences admin.',
  },
}
