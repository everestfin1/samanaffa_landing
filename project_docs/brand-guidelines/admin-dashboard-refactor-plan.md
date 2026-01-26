# Admin Dashboard Refactoring Plan

> **Version:** 1.0  
> **Last Updated:** January 2025  
> **Status:** Planning Phase  
> **Related Docs:** [console-design-vision.md](./console-design-vision.md), [design-system.md](./design-system.md)

---

## Executive Summary

This document outlines a comprehensive refactoring strategy for the Sama Naffa Admin Dashboard. The goal is to transform a monolithic, state-driven interface into a **modular, scalable, and accessible** admin console that follows established design system principles.

### Current Pain Points

| Problem | Impact | Priority |
|---------|--------|----------|
| Single 4,000-line component | Poor maintainability, slow dev velocity | Critical |
| Tab-based navigation (useState) | No deep linking, lost context on refresh | Critical |
| Inconsistent table implementations | Cognitive load, maintenance burden | High |
| No standardized data patterns | Duplicated fetch/filter/sort logic | High |
| Accessibility gaps | Excludes users, compliance risk | High |
| Custom CSS variables | Drift from design system tokens | Medium |

### Target Outcomes

- **Modular architecture** — Each domain (users, transactions, KYC) as isolated route
- **Unified table system** — Single `<DataTable>` component for all lists
- **URL-based state** — Deep linking, bookmarkable views, preserved context
- **Accessibility first** — WCAG 2.1 AA compliance
- **Scalable patterns** — New features plug in without touching core

---

## Part 0: Information Architecture (IA) and Scaling Boundaries

### 0.1 Primary goal: organize by operator jobs, not by data tables

The admin should feel predictable because **related work is grouped together**, and each area has a consistent structure:

- **Navigate by job** (what the admin is trying to do)
- **Operate on objects** (users, transactions, subscriptions, documents)
- **Use the same list → detail → action pattern everywhere**

This reduces cognitive load and makes it easier to add new features without expanding a single "admin dashboard" page.

**Language note:** All UI content, labels, and user-facing text will remain in French to match the current admin experience.

### 0.2 Proposed navigation groups (sidebar IA)

Group features into a small number of **stable top-level buckets**. Each bucket can grow with sub-pages without changing the overall mental model.

#### Group A — Operations (day-to-day work)

- **Dashboard** (`/admin`)
- **Transactions** (`/admin/transactions`)
- **Reconciliation** (`/admin/reconciliation`)

#### Group B — Customers (accounts and lifecycle)

- **Users** (`/admin/users`)
- **KYC** (`/admin/kyc`)

#### Group C — Programs (business lines)

Treat programs as first-class objects. Programs can generate:

- applications/subscriptions
- leads (pre-account)
- funded clients (post-deposit)

**Current structure (direct links, simple):**

- **APE Sénégal** (`/admin/programs/ape-senegal`)
- **APE Togo** (`/admin/programs/ape-togo`)
- **PEE** (`/admin/programs/pee`)

Each program page should expose a consistent sub-IA:

- **Overview** (KPI + funnel)
- **Pipeline** (leads/applications filtered to this program)
- **Customers** (converted users/clients linked to this program)
- **Transactions** (money events linked to this program when available)

**Scaling note:** When you exceed ~3 programs, introduce a `/admin/programs` hub that lists all programs and links to each program detail page.

#### Group D — Revenue & Growth (acquisition, attribution, conversion)

Leads should not be split by program at the top-level because a lead may:

- originate from APE or PEE
- later become a funded user (transactions)
- have multiple touchpoints (referral, campaign, abandoned)

Recommended structure:

- **Pipeline (Leads)** (`/admin/pipeline`)
  - All leads, with filters for:
    - program (APE/PEE/other)
    - stage (new/contacted/converted/abandoned)
    - identity match (linked to existing user vs not)
  - Views can be saved as presets (e.g. "APE - New", "PEE - Contacted")

- **Attribution**
  - **Sponsor Codes** (`/admin/attribution/sponsor-codes`)
  - (optional future) Campaigns / Sources (`/admin/attribution/sources`)

- **Abandoned** (`/admin/pipeline/abandoned`)

#### Group E — Communication

- **Notifications** (`/admin/notifications`)

#### Group F — System

- **Settings** (`/admin/settings`)

**Rule:** avoid more than ~6 top-level groups. If more are needed, consolidate (e.g. "Growth" can absorb multiple marketing-related features).

### 0.2.1 Object model (how Programs, Leads, Users, Transactions relate)

To make the IA scale, align it with an explicit object model:

- **Program** (APE, PEE, future programs)
- **Lead** (a person/prospect + intent), optionally linked to:
  - `programId`
  - `userId` (if matched/converted)
  - `source` (sponsorCode, campaign, organic, abandoned)
- **User/Customer** (account identity)
- **Transaction** (deposit/withdrawal), optionally linked to:
  - `userId`
  - `programId` (when attribution is known)

This model enables the UI to support cross-navigation:

- Program → show its leads, subscriptions, and converted customers
- Lead → show whether it matched/created a user, and whether deposits exist
- User → show interests/program associations and lead origin

### 0.3 Standard page content model (consistency)

All list pages should share the same high-level structure:

1. **Page header**
   - Title + short description
   - Primary action (if any)
   - Secondary actions (export, refresh)
2. **Status / KPI strip** (optional)
   - 3–6 StatCards max
3. **Data region**
   - `DataTable` with the same toolbar pattern everywhere
4. **Detail view**
   - Prefer a `Sheet` detail (or a dedicated route) that does not destroy list context

**Rule:** never place multiple unrelated tables in a single page (except Overview). If you need more than one table, it’s a sign the page is mixing jobs.

### 0.4 Object-first design (how details should be structured)

Every entity detail (User, Transaction, KYC Document, Subscription, Sponsor Code, Lead) should use a shared internal layout:

- **Summary header** (identity + current status + key metadata)
- **Tabs or sections** (stable across objects)
  - Overview
  - Timeline / history (auditable actions)
  - Related objects (e.g. user transactions, user KYC)
- **Actions**
  - Put risky actions behind confirmation modals
  - Keep destructive actions visually separate

This makes the console feel like an operating system: lists are predictable; details are structured; actions are discoverable but not noisy.

### 0.5 Module boundaries: how to prevent "god files" from returning

To scale, enforce layering and import rules.

#### Layer 1 — Design system primitives

- Buttons, inputs, badges, typography, spacing tokens
- No admin domain knowledge

#### Layer 2 — Admin patterns (reusable admin building blocks)

- `AdminShell`, `PageHeader`, `StatCard`, `Sheet`, `EmptyState`
- `DataTable` and its subcomponents
- No domain-specific API calls

#### Layer 3 — Feature modules (domain-owned code)

Each feature owns:

- Route pages
- Table `columns.tsx`
- Filters schema (URL search params)
- Detail sheet/page UI
- Feature-specific mutations and forms

**Rule:** feature modules can import patterns, but patterns must not import feature modules.

#### Layer 4 — Data access layer

- `api/admin/*` request functions
- `queries/*` hooks (TanStack Query)
- Typed DTO mapping (server response → UI model)

**Rule:** UI components should not call `fetch()` directly. They call typed API/query functions.

### 0.6 Recommended feature module folder structure

Use consistent structure per feature so engineers can jump between areas without re-learning conventions.

```
app/admin/transactions/
├── index.tsx              # list page
├── $transactionId.tsx     # detail route (or Sheet route)
├── columns.tsx            # TanStack Table column definitions
├── filters.ts             # URL search params + filter options
├── actions.tsx            # row actions (dropdown/buttons)
└── queries.ts             # feature-specific query wrappers
```

**Rule:** if a file grows past ~300–400 lines, split by responsibility (columns, toolbar, actions, queries, types).

---

## Part 1: Architecture

### 1.1 Current vs Target Structure

```
CURRENT                              TARGET
─────────────────────────────────    ─────────────────────────────────
app/admin/                           app/admin/
├── index.tsx (3,946 lines!)         ├── _layout.tsx (shell)
├── login.tsx                        ├── index.tsx (overview)
└── admin.css                        ├── login.tsx
                                     ├── users/
                                     │   ├── index.tsx
                                     │   └── [id].tsx
                                     ├── transactions/
                                     │   ├── index.tsx
                                     │   └── [id].tsx
                                     ├── kyc/
                                     │   ├── index.tsx
                                     │   └── [id].tsx
                                     ├── ape-subscriptions/
                                     │   ├── index.tsx
                                     │   └── [id].tsx
                                     ├── reconciliation/
                                     │   └── index.tsx
                                     ├── sponsor-codes/
                                     │   ├── index.tsx
                                     │   └── [id].tsx
                                     ├── leads/
                                     │   ├── pee.tsx
                                     │   └── abandoned.tsx
                                     ├── notifications/
                                     │   └── index.tsx
                                     └── settings/
                                         └── index.tsx
```

### 1.2 Component Library Structure

```
components/admin/
├── layout/
│   ├── AdminShell.tsx          # Root layout with sidebar + header + content
│   ├── AdminSidebar.tsx        # Navigation (refactored for Link-based routing)
│   ├── AdminHeader.tsx         # Page header with title, breadcrumb, actions
│   └── PageContainer.tsx       # Consistent page wrapper with spacing
│
├── data-display/
│   ├── DataTable/
│   │   ├── DataTable.tsx       # Main table component (TanStack Table)
│   │   ├── DataTableToolbar.tsx
│   │   ├── DataTablePagination.tsx
│   │   ├── DataTableColumnHeader.tsx
│   │   ├── DataTableFacetedFilter.tsx
│   │   ├── DataTableViewOptions.tsx
│   │   └── index.ts
│   ├── StatCard.tsx            # Metric display card
│   ├── Badge.tsx               # Status badges with semantic colors
│   └── EmptyState.tsx          # Zero-state illustrations
│
├── forms/
│   ├── FormField.tsx           # Label + input + error wrapper
│   ├── Select.tsx              # Dropdown with search
│   ├── DatePicker.tsx          # Date selection
│   └── SearchInput.tsx         # Search with debounce
│
├── feedback/
│   ├── Toast.tsx               # Non-blocking notifications
│   ├── Modal.tsx               # Blocking dialogs
│   ├── Sheet.tsx               # Slide-over panel for details
│   ├── Skeleton.tsx            # Loading placeholders
│   └── Spinner.tsx             # Inline loading indicator
│
└── hooks/
    ├── useAdminAuth.ts         # Auth guard and token management
    ├── useDataTable.ts         # Table state management
    ├── usePagination.ts        # URL-synced pagination
    ├── useFilters.ts           # URL-synced filters
    └── useToast.ts             # Toast notification API
```

### 1.3 Routing Strategy

Using **TanStack Router** with file-based routing:

```tsx
// app/admin/_layout.tsx
export const Route = createFileRoute('/admin')({
  component: AdminLayout,
  beforeLoad: async ({ context }) => {
    // Auth guard
    if (!isAdminAuthenticated()) {
      throw redirect({ to: '/admin/login' })
    }
  },
})

function AdminLayout() {
  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  )
}
```

**URL Structure:**

| Route | Purpose |
|-------|---------|
| `/admin` | Dashboard overview with KPIs |
| `/admin/users` | User list with filters |
| `/admin/users/:id` | User detail (sheet or page) |
| `/admin/transactions` | Transaction list |
| `/admin/transactions/:id` | Transaction detail |
| `/admin/kyc` | KYC documents pending review |
| `/admin/kyc/:id` | Document review interface |
| `/admin/ape-subscriptions` | APE Sénégal subscriptions |
| `/admin/reconciliation` | Intouch reconciliation |
| `/admin/sponsor-codes` | Referral code management |
| `/admin/leads/pee` | PEE leads |
| `/admin/leads/abandoned` | Abandoned cart leads |
| `/admin/notifications` | Push notification sender |
| `/admin/settings` | Admin settings |

---

## Part 2: Unified Table System

### 2.1 Design Philosophy

Every data table in the admin dashboard should:

1. **Look identical** — Same visual structure, spacing, typography
2. **Behave identically** — Same interactions for sort, filter, search, paginate
3. **Be declarative** — Define columns and data; table handles the rest
4. **Support URL state** — Filters/sort/page synced to URL for shareability
5. **Be accessible** — Proper ARIA roles, keyboard navigation, screen reader support

### 2.2 DataTable Component API

```tsx
interface DataTableProps<TData, TValue> {
  // Core
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  
  // Pagination
  pageCount?: number
  pageSize?: number
  pageIndex?: number
  onPaginationChange?: (pagination: PaginationState) => void
  
  // Sorting
  sorting?: SortingState
  onSortingChange?: (sorting: SortingState) => void
  
  // Filtering
  columnFilters?: ColumnFiltersState
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void
  globalFilter?: string
  onGlobalFilterChange?: (value: string) => void
  
  // Selection
  rowSelection?: RowSelectionState
  onRowSelectionChange?: (selection: RowSelectionState) => void
  enableRowSelection?: boolean
  
  // Features
  enableSorting?: boolean
  enableFiltering?: boolean
  enableColumnVisibility?: boolean
  enablePagination?: boolean
  
  // Slots
  toolbar?: React.ReactNode
  emptyState?: React.ReactNode
  
  // Loading
  isLoading?: boolean
  
  // Density
  density?: 'comfortable' | 'compact'
  
  // Row actions
  onRowClick?: (row: TData) => void
  getRowId?: (row: TData) => string
}
```

### 2.3 Column Definition Patterns

```tsx
// Standardized column helpers
import { createColumnHelper } from '@tanstack/react-table'

const columnHelper = createColumnHelper<User>()

export const userColumns = [
  // Selection column
  columnHelper.display({
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  }),
  
  // Text column with sorting
  columnHelper.accessor('name', {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nom" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('name')}</div>
    ),
  }),
  
  // Email with secondary styling
  columnHelper.accessor('email', {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <span className="text-muted">{row.getValue('email')}</span>
    ),
  }),
  
  // Status with Badge
  columnHelper.accessor('status', {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Statut" />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return <StatusBadge status={status} />
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  }),
  
  // Date column
  columnHelper.accessor('createdAt', {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => formatDate(row.getValue('createdAt')),
    sortingFn: 'datetime',
  }),
  
  // Currency column
  columnHelper.accessor('amount', {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Montant" className="text-right" />
    ),
    cell: ({ row }) => (
      <div className="text-right font-mono">
        {formatCurrency(row.getValue('amount'))} <span className="text-muted">FCFA</span>
      </div>
    ),
  }),
  
  // Actions column
  columnHelper.display({
    id: 'actions',
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <RowActions row={row} />,
    enableSorting: false,
    enableHiding: false,
  }),
]
```

### 2.4 Table Toolbar Pattern

Every table includes a consistent toolbar:

```
┌────────────────────────────────────────────────────────────────────┐
│ [🔍 Search...]          [Status ▼] [Date ▼]    [Columns] [Export] │
├────────────────────────────────────────────────────────────────────┤
│ Active filters: ● En attente  ● Cette semaine         [Clear all] │
└────────────────────────────────────────────────────────────────────┘
```

Components:
- **Search** — Global text search with debounce (300ms)
- **Faceted Filters** — Multi-select dropdowns for categorical columns
- **Date Range** — Preset ranges + custom picker
- **Column Visibility** — Toggle which columns display
- **Export** — CSV/Excel download
- **Active Filters** — Pill display of applied filters with clear action

### 2.5 Pagination Pattern

```
┌────────────────────────────────────────────────────────────────────┐
│ 1-25 sur 234 résultats    [10 ▼] par page    [◀] 1 2 3 ... 10 [▶] │
└────────────────────────────────────────────────────────────────────┘
```

Features:
- Row count display
- Page size selector (10, 25, 50, 100)
- Page navigation with ellipsis for large sets
- First/Last page buttons for >5 pages

### 2.6 URL State Synchronization

All table state syncs to URL for shareability:

```
/admin/transactions?status=pending&sort=createdAt:desc&page=2&pageSize=25
```

Implementation with TanStack Router:

```tsx
// hooks/useTableSearchParams.ts
export function useTableSearchParams() {
  const search = useSearch({ from: '/admin/transactions' })
  const navigate = useNavigate()
  
  const setSearch = useCallback((updates: Partial<TableSearchParams>) => {
    navigate({
      search: (prev) => ({ ...prev, ...updates }),
      replace: true,
    })
  }, [navigate])
  
  return {
    // Pagination
    page: search.page ?? 1,
    pageSize: search.pageSize ?? 25,
    
    // Sorting
    sortBy: search.sortBy,
    sortOrder: search.sortOrder ?? 'desc',
    
    // Filters
    status: search.status,
    dateFrom: search.dateFrom,
    dateTo: search.dateTo,
    q: search.q, // search query
    
    setSearch,
  }
}
```

### 2.7 Table Visual Specifications

Following design system tokens:

```css
/* Table density modes */
.data-table[data-density="comfortable"] {
  --table-row-height: 56px;
  --table-cell-padding: var(--space-4) var(--space-3);
  --table-font-size: var(--text-sm);
}

.data-table[data-density="compact"] {
  --table-row-height: 40px;
  --table-cell-padding: var(--space-2) var(--space-3);
  --table-font-size: var(--text-xs);
}

/* Table structure */
.data-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--elevation-1);
}

.data-table thead {
  background: var(--color-surface-secondary);
  border-bottom: 1px solid var(--color-border);
}

.data-table th {
  padding: var(--table-cell-padding);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.data-table td {
  padding: var(--table-cell-padding);
  font-size: var(--table-font-size);
  color: var(--color-text-primary);
  border-bottom: 1px solid var(--color-border-subtle);
}

.data-table tr:hover {
  background: var(--state-hover);
}

.data-table tr[data-selected="true"] {
  background: var(--color-interactive-subtle);
}
```

---

## Part 3: Page Patterns

### 3.1 Standard Page Template

Every admin page follows this structure:

```tsx
export default function UsersPage() {
  return (
    <PageContainer>
      {/* 1. Page Header */}
      <PageHeader
        title="Utilisateurs"
        description="Gérez les comptes utilisateurs et leurs permissions"
        actions={
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Nouvel utilisateur
          </Button>
        }
      />
      
      {/* 2. Stats Row (optional) */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Total" value={stats.total} icon={Users} />
        <StatCard label="Actifs" value={stats.active} color="success" />
        <StatCard label="KYC en attente" value={stats.pendingKyc} color="warning" />
        <StatCard label="Suspendus" value={stats.suspended} color="danger" />
      </div>
      
      {/* 3. Data Table */}
      <DataTable
        columns={columns}
        data={users}
        isLoading={isLoading}
        onRowClick={(user) => navigate({ to: `/admin/users/${user.id}` })}
      />
    </PageContainer>
  )
}
```

### 3.2 Detail View Pattern (Sheet)

For entity details, use a slide-over sheet to preserve list context:

```
┌──────────────────────────────────────────────────────────────────────────┐
│ Admin > Utilisateurs                                      [+ Nouveau]    │
├────────────────────────────────────┬─────────────────────────────────────┤
│                                    │                                     │
│  [🔍 Rechercher...]                │  ┌─────────────────────────────┐    │
│                                    │  │ Détails utilisateur    [×]  │    │
│  ┌──────────────────────────────┐  │  ├─────────────────────────────┤    │
│  │ ☐ Nom    Email    Statut    │  │  │                             │    │
│  ├──────────────────────────────┤  │  │  👤 Jean Dupont             │    │
│  │ ► Jean   jean@..  ● Actif   │  │  │  jean.dupont@email.com      │    │
│  │   Marie  marie..  ● Actif   │  │  │                             │    │
│  │   Paul   paul@..  ○ Suspendu│  │  │  ─────────────────────────  │    │
│  │                              │  │  │  Statut: ● KYC Approuvé    │    │
│  │                              │  │  │  Créé: 15 Jan 2025         │    │
│  │                              │  │  │  Dernier login: il y a 2h  │    │
│  │                              │  │  │                             │    │
│  │                              │  │  │  [Modifier] [Suspendre]     │    │
│  └──────────────────────────────┘  │  └─────────────────────────────┘    │
│                                    │                                     │
│  Affichage 1-25 sur 156  [◀][▶]   │                                     │
└────────────────────────────────────┴─────────────────────────────────────┘
```

Benefits:
- List remains visible and interactive
- No loss of scroll position or filters
- Quick comparison between items
- Natural back navigation (close sheet)

### 3.3 Empty State Pattern

Consistent zero-state across all tables:

```tsx
<EmptyState
  icon={FileText}
  title="Aucun document KYC"
  description="Les documents soumis par les utilisateurs apparaîtront ici"
  action={
    <Button variant="secondary" onClick={handleRefresh}>
      <RefreshCw className="w-4 h-4 mr-2" />
      Actualiser
    </Button>
  }
/>
```

Visual specifications:
- Centered in table area
- Muted icon (48x48)
- Title in `--text-lg`, `--font-medium`
- Description in `--text-sm`, `--color-text-muted`
- Optional action button

### 3.4 Loading State Pattern

Skeleton loaders that match table structure:

```tsx
// Table loading state
<DataTable
  columns={columns}
  data={[]}
  isLoading={true}
  // Renders skeleton rows matching column widths
/>

// Card loading state
<StatCard.Skeleton />
```

---

## Part 4: Accessibility

### 4.1 WCAG 2.1 AA Requirements

| Criterion | Implementation |
|-----------|----------------|
| **1.1.1 Non-text Content** | All icons have aria-labels or sr-only text |
| **1.3.1 Info and Relationships** | Tables use proper `<th>` with scope, forms use labels |
| **1.4.3 Contrast** | All text meets 4.5:1 ratio (7:1 for small text) |
| **1.4.11 Non-text Contrast** | UI components have 3:1 contrast against background |
| **2.1.1 Keyboard** | All interactive elements focusable and operable |
| **2.4.3 Focus Order** | Logical tab order matching visual layout |
| **2.4.7 Focus Visible** | Clear focus ring (2px solid, offset) |
| **4.1.2 Name, Role, Value** | All components have proper ARIA attributes |

### 4.2 Table Accessibility

```tsx
<table role="grid" aria-label="Liste des utilisateurs">
  <thead>
    <tr>
      <th scope="col" aria-sort="ascending">
        <button className="sort-button">
          Nom
          <ArrowUp className="sort-icon" aria-hidden="true" />
        </button>
      </th>
      {/* ... */}
    </tr>
  </thead>
  <tbody>
    {rows.map((row) => (
      <tr 
        key={row.id}
        tabIndex={0}
        aria-selected={row.isSelected}
        onClick={() => onRowClick(row)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onRowClick(row)
          }
        }}
      >
        {/* ... */}
      </tr>
    ))}
  </tbody>
</table>
```

### 4.3 Focus Management

```tsx
// Sheet focus trap
<Sheet open={isOpen} onOpenChange={setIsOpen}>
  <FocusTrap>
    <SheetContent>
      {/* First focusable element receives focus on open */}
      <SheetHeader>
        <SheetTitle>Détails utilisateur</SheetTitle>
        <SheetClose aria-label="Fermer" />
      </SheetHeader>
      {/* ... */}
    </SheetContent>
  </FocusTrap>
</Sheet>
```

### 4.4 Screen Reader Announcements

```tsx
// Live region for dynamic updates
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {isLoading ? 'Chargement des données...' : `${data.length} résultats trouvés`}
</div>

// Status changes
<Toast role="status" aria-live="polite">
  Utilisateur mis à jour avec succès
</Toast>
```

---

## Part 5: State Management

### 5.1 Data Fetching Strategy

Use **TanStack Query** for all API calls:

```tsx
// hooks/useUsers.ts
export function useUsers(params: UsersParams) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => fetchUsers(params),
    staleTime: 30_000, // 30 seconds
    placeholderData: keepPreviousData, // Smooth pagination
  })
}

// hooks/useUpdateUser.ts
export function useUpdateUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: updateUser,
    onMutate: async (newUser) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['users'] })
      const previous = queryClient.getQueryData(['users'])
      queryClient.setQueryData(['users'], (old) => 
        old.map((u) => u.id === newUser.id ? { ...u, ...newUser } : u)
      )
      return { previous }
    },
    onError: (err, newUser, context) => {
      // Rollback on error
      queryClient.setQueryData(['users'], context.previous)
      toast.error('Échec de la mise à jour')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
```

### 5.2 URL State Pattern

All filters, sorting, and pagination live in URL:

```tsx
// Route definition with search params validation
export const Route = createFileRoute('/admin/users')({
  validateSearch: (search) => ({
    page: Number(search.page) || 1,
    pageSize: Number(search.pageSize) || 25,
    sortBy: search.sortBy as string | undefined,
    sortOrder: (search.sortOrder as 'asc' | 'desc') || 'desc',
    status: search.status as string | undefined,
    q: search.q as string | undefined,
  }),
})

// Component usage
function UsersPage() {
  const { page, pageSize, sortBy, sortOrder, status, q } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  
  const { data, isLoading } = useUsers({ page, pageSize, sortBy, sortOrder, status, q })
  
  const handleFilterChange = (key: string, value: string) => {
    navigate({ search: (prev) => ({ ...prev, [key]: value, page: 1 }) })
  }
  
  // ...
}
```

### 5.3 Auth Context

```tsx
// contexts/AdminAuthContext.tsx
interface AdminAuthContext {
  user: AdminUser | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<void>
}

export function AdminAuthProvider({ children }) {
  // Token refresh on mount and interval
  // Redirect to login on 401
  // Persist to localStorage
}
```

---

## Part 6: Design Token Integration

### 6.1 CSS Variables Mapping

Migrate from current `admin.css` variables to design system tokens:

| Current | Target |
|---------|--------|
| `--admin-primary` | `--color-interactive` |
| `--admin-bg-secondary` | `--color-surface-secondary` |
| `--admin-text-muted` | `--color-text-muted` |
| `--admin-border` | `--color-border` |
| `--admin-success` | `--color-success` |
| `--admin-warning` | `--color-warning` |
| `--admin-danger` | `--color-critical` |

### 6.2 Spacing Consistency

All spacing uses 8px grid:

```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  
  /* Semantic aliases */
  --space-page-x: var(--space-6);
  --space-page-y: var(--space-8);
  --space-card: var(--space-5);
  --space-section: var(--space-8);
}
```

### 6.3 Typography Scale

```css
:root {
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px - base for ERP */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  
  /* Semantic styles */
  --text-page-title: var(--text-2xl);
  --text-section-title: var(--text-lg);
  --text-card-title: var(--text-base);
  --text-body: var(--text-sm);
  --text-caption: var(--text-xs);
}
```

---

## Part 7: Implementation Phases

### Phase 1: Foundation (Sprint 1)

**Goal:** Establish core patterns without breaking existing functionality

| Task | Priority | Effort |
|------|----------|--------|
| Create `AdminShell` layout component | Critical | 1d |
| Build `DataTable` component with TanStack Table | Critical | 3d |
| Implement `PageContainer` and `PageHeader` | High | 0.5d |
| Create `StatCard` component | High | 0.5d |
| Set up design token CSS variables | High | 0.5d |
| Build `Badge` component with variants | Medium | 0.5d |
| Create `EmptyState` component | Medium | 0.5d |

**Deliverable:** Reusable component library ready for page migration

### Phase 2: Route Migration (Sprint 2-3)

**Goal:** Convert tab-based navigation to URL routes

| Task | Priority | Effort |
|------|----------|--------|
| Set up admin route structure in TanStack Router | Critical | 0.5d |
| Migrate Overview page | High | 1d |
| Migrate Users page with DataTable | High | 1.5d |
| Migrate Transactions page | High | 1.5d |
| Migrate KYC page | High | 1.5d |
| Migrate APE Subscriptions page | High | 1.5d |
| Migrate Reconciliation page | Medium | 1d |
| Migrate Sponsor Codes page | Medium | 1d |
| Migrate Leads pages (PEE + Abandoned) | Medium | 1d |
| Migrate Notifications page | Low | 0.5d |
| Migrate Settings page | Low | 0.5d |

**Deliverable:** All pages accessible via direct URLs, sidebar uses Link components

### Phase 3: Detail Views (Sprint 4)

**Goal:** Implement Sheet pattern for entity details

| Task | Priority | Effort |
|------|----------|--------|
| Build `Sheet` component | High | 1d |
| User detail sheet | High | 1d |
| Transaction detail sheet | High | 1d |
| KYC review sheet | High | 1.5d |
| APE subscription detail | Medium | 1d |
| Sponsor code edit sheet | Medium | 0.5d |

**Deliverable:** Context-preserving detail views

### Phase 4: Data Layer (Sprint 5)

**Goal:** Consolidate data fetching with TanStack Query

| Task | Priority | Effort |
|------|----------|--------|
| Set up QueryClient with defaults | High | 0.5d |
| Create query hooks for all entities | High | 2d |
| Implement optimistic updates for mutations | High | 1.5d |
| Add loading skeletons | Medium | 1d |
| Implement error boundaries | Medium | 0.5d |

**Deliverable:** Consistent, cacheable data fetching

### Phase 5: Polish (Sprint 6)

**Goal:** Refinement and accessibility audit

| Task | Priority | Effort |
|------|----------|--------|
| Accessibility audit and fixes | High | 2d |
| Add toast notification system | Medium | 0.5d |
| Implement density toggle | Medium | 1d |
| Performance optimization (virtualization for large tables) | Medium | 1d |
| Documentation and examples | Low | 1d |
| Remove legacy code | Low | 0.5d |

**Deliverable:** Production-ready admin dashboard

---

## Part 8: Migration Checklist

### Per-Page Migration Steps

For each page being migrated:

- [ ] Create new route file in appropriate directory
- [ ] Extract page-specific types to `types.ts`
- [ ] Define TanStack Table columns
- [ ] Implement with `DataTable` component
- [ ] Add `PageHeader` with title and actions
- [ ] Add `StatCard` row if applicable
- [ ] Implement URL-synced filters
- [ ] Add loading skeleton state
- [ ] Add empty state
- [ ] Verify accessibility (keyboard, screen reader)
- [ ] Update sidebar navigation to use Link
- [ ] Test all CRUD operations
- [ ] Remove corresponding code from old `index.tsx`

### DataTable Feature Checklist

For each table implementation:

- [ ] Sorting on relevant columns
- [ ] Global search with debounce
- [ ] Status/type faceted filters
- [ ] Date range filter (if applicable)
- [ ] Pagination with page size selector
- [ ] Row selection (if bulk actions needed)
- [ ] Column visibility toggle
- [ ] Export to CSV/Excel
- [ ] Row click to open detail
- [ ] Empty state
- [ ] Loading skeleton
- [ ] Responsive (horizontal scroll on mobile)

---

## Appendix A: Component Examples

### A.1 Complete DataTable Usage

```tsx
// pages/admin/transactions/index.tsx
import { DataTable } from '@/components/admin/data-display/DataTable'
import { transactionColumns } from './columns'
import { useTransactions } from '@/hooks/useTransactions'
import { Route } from './+types'

export default function TransactionsPage() {
  const search = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  
  const { data, isLoading, error } = useTransactions({
    page: search.page,
    pageSize: search.pageSize,
    status: search.status,
    sortBy: search.sortBy,
    sortOrder: search.sortOrder,
    q: search.q,
  })
  
  return (
    <PageContainer>
      <PageHeader
        title="Transactions"
        description="Gérez les dépôts et retraits des utilisateurs"
      />
      
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard 
          label="Total" 
          value={data?.stats.total ?? 0} 
          icon={CreditCard}
        />
        <StatCard 
          label="En attente" 
          value={data?.stats.pending ?? 0} 
          color="warning"
          icon={Clock}
        />
        <StatCard 
          label="Complétées" 
          value={data?.stats.completed ?? 0} 
          color="success"
          icon={CheckCircle}
        />
        <StatCard 
          label="Volume (FCFA)" 
          value={formatCurrency(data?.stats.volume ?? 0)} 
          icon={TrendingUp}
        />
      </div>
      
      <DataTable
        columns={transactionColumns}
        data={data?.transactions ?? []}
        pageCount={data?.pageCount}
        isLoading={isLoading}
        
        // URL-synced state
        pageIndex={search.page - 1}
        pageSize={search.pageSize}
        sorting={search.sortBy ? [{ id: search.sortBy, desc: search.sortOrder === 'desc' }] : []}
        globalFilter={search.q}
        
        onPaginationChange={({ pageIndex, pageSize }) => {
          navigate({ search: (prev) => ({ ...prev, page: pageIndex + 1, pageSize }) })
        }}
        onSortingChange={(sorting) => {
          const [sort] = sorting
          navigate({ 
            search: (prev) => ({ 
              ...prev, 
              sortBy: sort?.id, 
              sortOrder: sort?.desc ? 'desc' : 'asc',
              page: 1,
            }) 
          })
        }}
        onGlobalFilterChange={(q) => {
          navigate({ search: (prev) => ({ ...prev, q, page: 1 }) })
        }}
        
        toolbar={
          <DataTableToolbar>
            <DataTableFacetedFilter
              column="status"
              title="Statut"
              options={[
                { value: 'PENDING', label: 'En attente' },
                { value: 'PROCESSING', label: 'En cours' },
                { value: 'COMPLETED', label: 'Complété' },
                { value: 'FAILED', label: 'Échoué' },
              ]}
            />
            <DataTableFacetedFilter
              column="type"
              title="Type"
              options={[
                { value: 'DEPOSIT', label: 'Dépôt' },
                { value: 'WITHDRAWAL', label: 'Retrait' },
              ]}
            />
          </DataTableToolbar>
        }
        
        emptyState={
          <EmptyState
            icon={CreditCard}
            title="Aucune transaction"
            description="Les transactions apparaîtront ici"
          />
        }
        
        onRowClick={(transaction) => {
          navigate({ to: `/admin/transactions/${transaction.id}` })
        }}
      />
    </PageContainer>
  )
}
```

### A.2 Column Definitions

```tsx
// pages/admin/transactions/columns.tsx
import { createColumnHelper } from '@tanstack/react-table'
import { Transaction } from '@/types/admin'
import { DataTableColumnHeader } from '@/components/admin/data-display/DataTable'
import { Badge } from '@/components/admin/data-display/Badge'
import { formatCurrency, formatDate } from '@/lib/utils'

const columnHelper = createColumnHelper<Transaction>()

export const transactionColumns = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.id.slice(0, 8)}</span>
    ),
  }),
  
  columnHelper.accessor('user', {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Utilisateur" />,
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.user?.name ?? 'N/A'}</div>
        <div className="text-xs text-muted">{row.original.user?.email}</div>
      </div>
    ),
    enableSorting: false,
  }),
  
  columnHelper.accessor('type', {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
    cell: ({ row }) => (
      <Badge variant={row.original.type === 'DEPOSIT' ? 'info' : 'neutral'}>
        {row.original.type === 'DEPOSIT' ? 'Dépôt' : 'Retrait'}
      </Badge>
    ),
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  }),
  
  columnHelper.accessor('amount', {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Montant" className="text-right" />
    ),
    cell: ({ row }) => (
      <div className="text-right font-mono font-medium">
        {formatCurrency(row.original.amount)}
        <span className="text-muted ml-1">FCFA</span>
      </div>
    ),
  }),
  
  columnHelper.accessor('status', {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Statut" />,
    cell: ({ row }) => {
      const status = row.original.status
      const variants: Record<string, 'warning' | 'success' | 'danger' | 'info'> = {
        PENDING: 'warning',
        PROCESSING: 'info',
        COMPLETED: 'success',
        FAILED: 'danger',
      }
      const labels: Record<string, string> = {
        PENDING: 'En attente',
        PROCESSING: 'En cours',
        COMPLETED: 'Complété',
        FAILED: 'Échoué',
      }
      return <Badge variant={variants[status]}>{labels[status]}</Badge>
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  }),
  
  columnHelper.accessor('createdAt', {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
    cell: ({ row }) => formatDate(row.original.createdAt),
    sortingFn: 'datetime',
  }),
  
  columnHelper.display({
    id: 'actions',
    cell: ({ row }) => (
      <RowActions
        actions={[
          { label: 'Voir détails', icon: Eye, onClick: () => {} },
          { label: 'Modifier statut', icon: Edit, onClick: () => {} },
        ]}
      />
    ),
  }),
]
```

---

## Appendix B: File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Route page | `index.tsx` or `[param].tsx` | `users/index.tsx`, `users/[id].tsx` |
| Component | `PascalCase.tsx` | `DataTable.tsx`, `AdminShell.tsx` |
| Hook | `use[Name].ts` | `useUsers.ts`, `useDataTable.ts` |
| Types | `types.ts` or inline | `users/types.ts` |
| Columns | `columns.tsx` | `transactions/columns.tsx` |
| Utils | `camelCase.ts` | `formatCurrency.ts` |
| CSS | `component.css` or Tailwind | `admin.css` → design tokens |

---

## Appendix C: Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Lines in main component | ~4,000 | <300 per page |
| Time to add new table | ~2 hours | ~30 minutes |
| Deep link support | None | All pages |
| Lighthouse Accessibility | ~70 | >90 |
| Filter/sort persistence | None | Via URL |
| Page load (admin index) | ~800ms | <400ms |

---

*This document is a living reference. Update as implementation progresses.*
