'use client'

import { useState, useMemo } from 'react'
import { 
  ChevronUp, 
  ChevronDown, 
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  Search,
  X
} from 'lucide-react'

export interface Column<T> {
  key: string
  label: string
  sortable?: boolean
  filterable?: boolean
  render?: (item: T) => React.ReactNode
  className?: string
  headerClassName?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  keyExtractor: (item: T) => string
  searchable?: boolean
  searchPlaceholder?: string
  searchKeys?: string[]
  pageSize?: number
  emptyIcon?: React.ReactNode
  emptyTitle?: string
  emptyDescription?: string
  actions?: (item: T) => React.ReactNode
  onRowClick?: (item: T) => void
  className?: string
}

type SortDirection = 'asc' | 'desc' | null

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DataTable<T extends Record<string, any>>({
  data,
  columns,
  keyExtractor,
  searchable = true,
  searchPlaceholder = 'Rechercher...',
  searchKeys = [],
  pageSize = 10,
  emptyIcon,
  emptyTitle = 'Aucune donnée',
  emptyDescription = 'Les données apparaîtront ici',
  actions,
  onRowClick,
  className = '',
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)
  const [currentPage, setCurrentPage] = useState(1)

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data

    const query = searchQuery.toLowerCase()
    return data.filter((item) => {
      const keysToSearch = searchKeys.length > 0 ? searchKeys : Object.keys(item)
      return keysToSearch.some((key) => {
        const value = getNestedValue(item, key)
        return String(value).toLowerCase().includes(query)
      })
    })
  }, [data, searchQuery, searchKeys])

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortKey || !sortDirection) return filteredData

    return [...filteredData].sort((a, b) => {
      const aValue = getNestedValue(a, sortKey)
      const bValue = getNestedValue(b, sortKey)

      if (aValue === bValue) return 0
      if (aValue === null || aValue === undefined) return 1
      if (bValue === null || bValue === undefined) return -1

      const comparison = aValue < bValue ? -1 : 1
      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [filteredData, sortKey, sortDirection])

  // Paginate data
  const totalPages = Math.ceil(sortedData.length / pageSize)
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return sortedData.slice(start, start + pageSize)
  }, [sortedData, currentPage, pageSize])

  // Reset to page 1 when search changes
  useMemo(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') setSortDirection('desc')
      else if (sortDirection === 'desc') {
        setSortKey(null)
        setSortDirection(null)
      }
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  const getSortIcon = (key: string) => {
    if (sortKey !== key) return <ChevronsUpDown className="w-3.5 h-3.5 opacity-40" />
    if (sortDirection === 'asc') return <ChevronUp className="w-3.5 h-3.5" />
    return <ChevronDown className="w-3.5 h-3.5" />
  }

  return (
    <div className={`admin-data-table ${className}`}>
      {/* Search Bar */}
      {searchable && (
        <div className="admin-data-table-toolbar">
          <div className="admin-data-table-search">
            <Search className="admin-data-table-search-icon" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-data-table-search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="admin-data-table-search-clear"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="admin-data-table-info">
            {filteredData.length} résultat{filteredData.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th 
                  key={column.key}
                  className={column.headerClassName}
                >
                  {column.sortable ? (
                    <button
                      onClick={() => handleSort(column.key)}
                      className="admin-table-sort-btn"
                    >
                      <span>{column.label}</span>
                      {getSortIcon(column.key)}
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
              {actions && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => (
              <tr 
                key={keyExtractor(item)}
                onClick={() => onRowClick?.(item)}
                className={onRowClick ? 'cursor-pointer' : ''}
              >
                {columns.map((column) => (
                  <td key={column.key} className={column.className}>
                    {column.render 
                      ? column.render(item) 
                      : String(getNestedValue(item, column.key) ?? '-')
                    }
                  </td>
                ))}
                {actions && (
                  <td onClick={(e) => e.stopPropagation()}>
                    {actions(item)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {paginatedData.length === 0 && (
          <div className="admin-empty">
            {emptyIcon && <div className="admin-empty-icon">{emptyIcon}</div>}
            <p className="admin-empty-title">{emptyTitle}</p>
            <p className="admin-empty-text">{emptyDescription}</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="admin-data-table-pagination">
          <div className="admin-data-table-pagination-info">
            Page {currentPage} sur {totalPages}
          </div>
          <div className="admin-data-table-pagination-controls">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="admin-btn admin-btn-ghost admin-btn-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              <ChevronLeft className="w-4 h-4 -ml-2" />
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="admin-btn admin-btn-ghost admin-btn-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {/* Page numbers */}
            <div className="admin-data-table-pagination-pages">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`admin-data-table-pagination-page ${currentPage === pageNum ? 'active' : ''}`}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="admin-btn admin-btn-ghost admin-btn-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="admin-btn admin-btn-ghost admin-btn-sm"
            >
              <ChevronRight className="w-4 h-4" />
              <ChevronRight className="w-4 h-4 -ml-2" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper to get nested object values like "user.name"
function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce((acc: unknown, part: string) => {
    if (acc && typeof acc === 'object' && part in acc) {
      return (acc as Record<string, unknown>)[part]
    }
    return undefined
  }, obj)
}
