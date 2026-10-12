import { useState } from 'react'
import { FiChevronUp, FiChevronDown, FiSearch, FiFilter } from 'react-icons/fi'
import Loader from '../common/Loader.jsx'

const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  searchable = true,
  searchPlaceholder = 'Search...',
  emptyMessage = 'No data found',
  emptyIcon = null,
}) => {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState('asc')
  const [page, setPage] = useState(1)
  const pageSize = 10

  // ✅ Filter
  const filtered = data.filter(row => {
    if (!search.trim()) return true
    return columns.some(col => {
      const val = col.accessor ? row[col.accessor] : ''
      return String(val || '').toLowerCase().includes(search.toLowerCase())
    })
  })

  // ✅ Sort
  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey) return 0
    const aVal = a[sortKey] || ''
    const bVal = b[sortKey] || ''
    const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true })
    return sortDir === 'asc' ? cmp : -cmp
  })

  // ✅ Paginate
  const totalPages = Math.ceil(sorted.length / pageSize)
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize)

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  return (
    <div className="card-dark rounded-2xl overflow-hidden">

      {/* ✅ Search bar */}
      {searchable && (
        <div
          className="flex items-center gap-3 p-4 border-b"
          style={{ borderColor: '#3d3d3d' }}
        >
          <FiSearch size={16} className="text-[#6b7280] flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder={searchPlaceholder}
            className="flex-1 bg-transparent text-sm text-white placeholder-[#6b7280] outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="text-xs text-[#6b7280] hover:text-white transition-colors"
            >
              Clear
            </button>
          )}
          <span className="text-xs text-[#6b7280] flex-shrink-0">
            {filtered.length} results
          </span>
        </div>
      )}

      {/* ✅ Table */}
      <div className="overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key || col.accessor}
                  onClick={() => col.sortable && handleSort(col.accessor)}
                  style={{
                    cursor: col.sortable ? 'pointer' : 'default',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && sortKey === col.accessor && (
                      sortDir === 'asc'
                        ? <FiChevronUp size={13} />
                        : <FiChevronDown size={13} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-12">
                  <Loader center />
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-12">
                  <div className="flex flex-col items-center gap-3 text-[#6b7280]">
                    {emptyIcon && <div className="text-4xl">{emptyIcon}</div>}
                    <p className="text-sm">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginated.map((row, i) => (
                <tr key={row.id || row._id || i}>
                  {columns.map((col) => (
                    <td key={col.key || col.accessor}>
                      {col.render
                        ? col.render(row[col.accessor], row)
                        : row[col.accessor] || '—'}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Pagination */}
      {totalPages > 1 && (
        <div
          className="flex items-center justify-between px-4 py-3 border-t"
          style={{ borderColor: '#3d3d3d' }}
        >
          <p className="text-xs text-[#6b7280]">
            Page {page} of {totalPages} ({filtered.length} total)
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="px-2 py-1 rounded text-xs text-[#a0a0a0] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              «
            </button>
            <button
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="px-2 py-1 rounded text-xs text-[#a0a0a0] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ‹
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(totalPages - 4, page - 2)) + i
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className="w-7 h-7 rounded text-xs font-medium transition-all"
                  style={{
                    background: page === pageNum
                      ? 'rgba(212,175,55,0.2)'
                      : 'transparent',
                    color: page === pageNum ? '#d4af37' : '#a0a0a0',
                    border: page === pageNum
                      ? '1px solid rgba(212,175,55,0.3)'
                      : '1px solid transparent',
                  }}
                >
                  {pageNum}
                </button>
              )
            })}
            <button
              onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages}
              className="px-2 py-1 rounded text-xs text-[#a0a0a0] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ›
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
              className="px-2 py-1 rounded text-xs text-[#a0a0a0] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DataTable