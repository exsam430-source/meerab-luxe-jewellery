// src/components/public/collection/CollectionGrid.jsx
import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiFilter, FiX, FiChevronDown, FiSearch,
  FiSliders, FiTag,
} from 'react-icons/fi'
import { HiSparkles } from 'react-icons/hi'
import Breadcrumb from '../../common/Breadcrumb.jsx'
import ProductGrid from '../product/ProductGrid.jsx'

const SORT_OPTIONS = [
  { value: '',           label: 'Featured',         icon: '✦' },
  { value: 'newest',     label: 'Newest First',      icon: '🆕' },
  { value: 'price-low',  label: 'Price: Low → High', icon: '↑' },
  { value: 'price-high', label: 'Price: High → Low', icon: '↓' },
  { value: 'name-az',    label: 'Name: A → Z',       icon: 'A' },
]

const PRICE_RANGES = [
  { label: 'Under Rs.1,000',       min: 0,     max: 1000      },
  { label: 'Rs.1,000 – Rs.3,000',  min: 1000,  max: 3000      },
  { label: 'Rs.3,000 – Rs.5,000',  min: 3000,  max: 5000      },
  { label: 'Rs.5,000 – Rs.10,000', min: 5000,  max: 10000     },
  { label: 'Above Rs.10,000',      min: 10000, max: Infinity   },
]

// ── Filter Sidebar ────────────────────────────────────────────
const FilterSidebar = ({
  subcategories,
  activeSubcat,
  setActiveSubcat,
  activePriceRange,
  setActivePriceRange,
  activeSort,
  setActiveSort,
  searchQuery,
  setSearchQuery,
  onClear,
  hasFilters,
  resultCount,
  onClose,
}) => (
  <div className="flex flex-col h-full">

    {/* Header */}
    <div className="flex items-center justify-between pb-4 mb-5" style={{ borderBottom: '1px solid #1e1e1e' }}>
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.18)' }}
        >
          <FiSliders size={14} style={{ color: '#d4af37' }} />
        </div>
        <span className="font-semibold text-white text-sm">Refine</span>
        {hasFilters && (
          <span
            className="text-[10px] px-2 py-0.5 rounded-full font-bold"
            style={{ background: '#d4af37', color: '#0a0a0a' }}
          >
            ON
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {hasFilters && (
          <button
            onClick={onClear}
            className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
          >
            <FiX size={11} /> Reset
          </button>
        )}
        {onClose && (
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all lg:hidden"
            style={{ background: '#1e1e1e', color: '#6b7280' }}
          >
            <FiX size={14} />
          </button>
        )}
      </div>
    </div>

    <div className="flex-1 overflow-y-auto space-y-6 pr-1 sidebar-scroll">

      {/* Search */}
      <div>
        <p className="sidebar-label">Search</p>
        <div
          className="flex items-center gap-2 rounded-xl px-3 py-2.5 transition-all"
          style={{
            background: '#111',
            border: `1px solid ${searchQuery ? 'rgba(212,175,55,0.4)' : '#1e1e1e'}`,
          }}
        >
          <FiSearch size={13} style={{ color: '#4b5563', flexShrink: 0 }} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="bg-transparent outline-none text-sm text-white placeholder-[#3d3d3d] w-full"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-[#4b5563] hover:text-white transition-colors">
              <FiX size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Sort */}
      <div>
        <p className="sidebar-label">Sort By</p>
        <div className="space-y-0.5">
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setActiveSort(opt.value)}
              className="sidebar-btn w-full flex items-center gap-2.5"
              style={{
                background: activeSort === opt.value ? 'rgba(212,175,55,0.07)' : 'transparent',
                color: activeSort === opt.value ? '#d4af37' : '#5a5a5a',
              }}
            >
              <span
                className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{
                  background: activeSort === opt.value ? 'rgba(212,175,55,0.14)' : '#141414',
                  color: activeSort === opt.value ? '#d4af37' : '#3d3d3d',
                }}
              >
                {opt.icon}
              </span>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category */}
      {subcategories?.length > 0 && (
        <div>
          <p className="sidebar-label">Category</p>
          <div className="space-y-0.5">
            <button
              onClick={() => setActiveSubcat('')}
              className="sidebar-btn w-full flex items-center gap-2.5"
              style={{
                background: !activeSubcat ? 'rgba(212,175,55,0.07)' : 'transparent',
                color: !activeSubcat ? '#d4af37' : '#5a5a5a',
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: !activeSubcat ? '#d4af37' : '#2d2d2d' }}
              />
              All Items
            </button>
            {subcategories.map(sub => (
              <button
                key={sub}
                onClick={() => setActiveSubcat(activeSubcat === sub ? '' : sub)}
                className="sidebar-btn w-full flex items-center gap-2.5"
                style={{
                  background: activeSubcat === sub ? 'rgba(212,175,55,0.07)' : 'transparent',
                  color: activeSubcat === sub ? '#d4af37' : '#5a5a5a',
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: activeSubcat === sub ? '#d4af37' : '#2d2d2d' }}
                />
                {sub}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div>
        <p className="sidebar-label">Price Range</p>
        <div className="space-y-0.5">
          <button
            onClick={() => setActivePriceRange(null)}
            className="sidebar-btn w-full flex items-center gap-2.5"
            style={{
              background: !activePriceRange ? 'rgba(212,175,55,0.07)' : 'transparent',
              color: !activePriceRange ? '#d4af37' : '#5a5a5a',
            }}
          >
            <FiTag size={11} style={{ flexShrink: 0 }} />
            Any Price
          </button>
          {PRICE_RANGES.map(range => {
            const isActive = activePriceRange?.label === range.label
            return (
              <button
                key={range.label}
                onClick={() => setActivePriceRange(isActive ? null : range)}
                className="sidebar-btn w-full flex items-center gap-2.5"
                style={{
                  background: isActive ? 'rgba(212,175,55,0.07)' : 'transparent',
                  color: isActive ? '#d4af37' : '#5a5a5a',
                }}
              >
                <FiTag size={11} style={{ flexShrink: 0 }} />
                {range.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>

    {/* Mobile apply button */}
    {onClose && (
      <div className="pt-4 mt-4" style={{ borderTop: '1px solid #1e1e1e' }}>
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl font-semibold text-sm transition-all"
          style={{
            background: 'linear-gradient(135deg, #d4af37, #b8962e)',
            color: '#0a0a0a',
            boxShadow: '0 4px 22px rgba(212,175,55,0.28)',
          }}
        >
          View {resultCount} Result{resultCount !== 1 ? 's' : ''}
        </button>
      </div>
    )}
  </div>
)

// ── Active Filter Pills ───────────────────────────────────────
const ActiveFilters = ({ activeSubcat, setActiveSubcat, activePriceRange, setActivePriceRange, searchQuery, setSearchQuery }) => {
  const pills = [
    activeSubcat      && { label: activeSubcat,              clear: () => setActiveSubcat('') },
    activePriceRange  && { label: activePriceRange.label,    clear: () => setActivePriceRange(null) },
    searchQuery       && { label: `"${searchQuery}"`,        clear: () => setSearchQuery('') },
  ].filter(Boolean)

  if (!pills.length) return null

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="flex flex-wrap gap-2 mb-5"
    >
      {pills.map((pill, i) => (
        <motion.button
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={pill.clear}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:opacity-75"
          style={{
            background: 'rgba(212,175,55,0.08)',
            border: '1px solid rgba(212,175,55,0.22)',
            color: '#d4af37',
          }}
        >
          {pill.label}
          <FiX size={11} />
        </motion.button>
      ))}
    </motion.div>
  )
}

// ── SEO Block ─────────────────────────────────────────────────
const SeoBlock = ({ text }) => {
  const [expanded, setExpanded] = useState(false)
  if (!text) return null
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-14 mb-4 rounded-2xl p-6"
      style={{
        background: 'linear-gradient(135deg, #0e0e0e, #141414)',
        border: '1px solid #1a1a1a',
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <HiSparkles style={{ color: '#d4af37' }} size={15} />
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#3a3a3a]">
          About This Collection
        </span>
      </div>
      <p
        className="text-[#4a4a4a] text-sm leading-relaxed transition-all"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: expanded ? 'unset' : 3,
          WebkitBoxOrient: 'vertical',
          overflow: expanded ? 'visible' : 'hidden',
        }}
      >
        {text}
      </p>
      <button
        onClick={() => setExpanded(e => !e)}
        className="mt-2 text-xs font-medium flex items-center gap-1 transition-colors"
        style={{ color: '#d4af37' }}
      >
        {expanded ? 'Show less' : 'Read more'}
        <FiChevronDown
          size={12}
          style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}
        />
      </button>
    </motion.div>
  )
}

// ── Main CollectionGrid ───────────────────────────────────────
const CollectionGrid = ({
  products = [],
  loading,
  breadcrumbs,
  seoDescription,
  emptyMessage = 'No products found',
  emptyDesc = 'Check back soon!',
  subcategories = [],
}) => {
  const [activeSubcat,      setActiveSubcat]      = useState('')
  const [activePriceRange,  setActivePriceRange]  = useState(null)
  const [activeSort,        setActiveSort]        = useState('')
  const [searchQuery,       setSearchQuery]       = useState('')
  const [visibleCount,      setVisibleCount]      = useState(12)
  const [mobileOpen,        setMobileOpen]        = useState(false)
  const loaderRef = useRef(null)

  useEffect(() => { setVisibleCount(12) }, [activeSubcat, activePriceRange, activeSort, searchQuery])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  // Infinite scroll
  useEffect(() => {
    if (!loaderRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisibleCount(p => p + 12) },
      { threshold: 0.1 }
    )
    observer.observe(loaderRef.current)
    return () => observer.disconnect()
  }, [])

  const filtered = useMemo(() => {
    let result = [...products]

    if (activeSubcat) result = result.filter(p => p.subCategory === activeSubcat)

    if (activePriceRange) {
      result = result.filter(p => p.price >= activePriceRange.min && p.price <= activePriceRange.max)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.subCategory?.toLowerCase().includes(q)
      )
    }

    switch (activeSort) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        break
      case 'price-low':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        result.sort((a, b) => b.price - a.price)
        break
      case 'name-az':
        result.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
        break
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    }

    return result
  }, [products, activeSubcat, activePriceRange, activeSort, searchQuery])

  const hasFilters = !!(activeSubcat || activePriceRange || searchQuery || activeSort)

  const handleClear = useCallback(() => {
    setActiveSubcat('')
    setActivePriceRange(null)
    setActiveSort('')
    setSearchQuery('')
  }, [])

  const activeFilterCount = [activeSubcat, activePriceRange, searchQuery].filter(Boolean).length

  const filterProps = {
    subcategories,
    activeSubcat, setActiveSubcat,
    activePriceRange, setActivePriceRange,
    activeSort, setActiveSort,
    searchQuery, setSearchQuery,
    hasFilters,
    onClear: handleClear,
    resultCount: filtered.length,
  }

  return (
    <section className="py-8 md:py-12" style={{ background: '#0d0d0d', minHeight: '60vh' }}>

      <style>{`
        .sidebar-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #3a3a3a;
          margin-bottom: 8px;
          padding-left: 4px;
        }
        .sidebar-btn {
          font-size: 13px;
          text-align: left;
          padding: 7px 10px;
          border-radius: 8px;
          transition: all 0.2s;
          width: 100%;
        }
        .sidebar-btn:hover {
          background: rgba(255,255,255,0.02) !important;
        }
        .sidebar-scroll::-webkit-scrollbar { width: 3px; }
        .sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
        .sidebar-scroll::-webkit-scrollbar-thumb { background: #1e1e1e; border-radius: 4px; }
        .load-more-btn {
          position: relative;
          overflow: hidden;
        }
        .load-more-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
          transform: translateX(-100%);
          transition: transform 0.6s;
        }
        .load-more-btn:hover::before {
          transform: translateX(100%);
        }
      `}</style>

      <div className="container-custom">

        {/* Breadcrumb */}
        {breadcrumbs && (
          <div className="mb-6">
            <Breadcrumb items={breadcrumbs} />
          </div>
        )}

        {/* Toolbar */}
        <div
          className="flex flex-wrap items-center gap-3 mb-6 px-4 py-3 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, #111111, #161616)',
            border: '1px solid #1e1e1e',
          }}
        >
          {/* Result count */}
          <div className="flex-1 min-w-fit">
            {loading ? (
              <div className="h-5 w-28 rounded animate-pulse" style={{ background: '#1e1e1e' }} />
            ) : (
              <p className="text-sm text-[#4b5563]">
                <span className="font-semibold text-white">{filtered.length}</span>
                {' '}piece{filtered.length !== 1 ? 's' : ''}
                {hasFilters && <span className="text-[#d4af37]"> (filtered)</span>}
              </p>
            )}
          </div>

          {/* Mobile filter button */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: activeFilterCount > 0 ? 'rgba(212,175,55,0.08)' : '#161616',
              border: `1px solid ${activeFilterCount > 0 ? 'rgba(212,175,55,0.28)' : '#1e1e1e'}`,
              color: activeFilterCount > 0 ? '#d4af37' : '#6b7280',
            }}
          >
            <FiFilter size={14} />
            Filter
            {activeFilterCount > 0 && (
              <span
                className="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
                style={{ background: '#d4af37', color: '#0a0a0a' }}
              >
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Quick sort — desktop */}
          <div className="hidden sm:flex items-center gap-2">
            {SORT_OPTIONS.slice(0, 3).map(opt => (
              <button
                key={opt.value}
                onClick={() => setActiveSort(activeSort === opt.value ? '' : opt.value)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: activeSort === opt.value ? 'rgba(212,175,55,0.1)' : '#161616',
                  border: `1px solid ${activeSort === opt.value ? 'rgba(212,175,55,0.28)' : '#1e1e1e'}`,
                  color: activeSort === opt.value ? '#d4af37' : '#4b5563',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Clear */}
          {hasFilters && (
            <button
              onClick={handleClear}
              className="flex items-center gap-1 text-xs text-red-400/70 hover:text-red-300 transition-colors px-2"
            >
              <FiX size={12} /> Clear all
            </button>
          )}
        </div>

        {/* Active pills */}
        <AnimatePresence>
          {hasFilters && (
            <ActiveFilters
              activeSubcat={activeSubcat}
              setActiveSubcat={setActiveSubcat}
              activePriceRange={activePriceRange}
              setActivePriceRange={setActivePriceRange}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          )}
        </AnimatePresence>

        {/* Layout: Sidebar + Grid */}
        <div className="flex gap-6 lg:gap-8">

          {/* Desktop Sidebar */}
          <aside className="hidden lg:flex flex-col flex-shrink-0" style={{ width: '230px' }}>
            <div
              className="rounded-2xl p-5 sticky top-24"
              style={{
                background: 'linear-gradient(180deg, #111111, #0e0e0e)',
                border: '1px solid #181818',
                maxHeight: 'calc(100vh - 120px)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <FilterSidebar {...filterProps} onClose={null} />
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1 min-w-0">
            <ProductGrid
              products={filtered.slice(0, visibleCount)}
              loading={loading}
              emptyMessage={emptyMessage}
              emptyDesc={emptyDesc}
            />

            {/* Load more */}
            {!loading && visibleCount < filtered.length && (
              <div ref={loaderRef} className="mt-10 flex flex-col items-center gap-3">
                <div className="w-full max-w-xs h-0.5 rounded-full overflow-hidden" style={{ background: '#141414' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #d4af37, #b8962e)' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(visibleCount / filtered.length) * 100}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
                <p className="text-xs text-[#2d2d2d]">
                  Showing {Math.min(visibleCount, filtered.length)} of {filtered.length}
                </p>
                <button
                  onClick={() => setVisibleCount(p => p + 12)}
                  className="load-more-btn px-8 py-3 rounded-xl font-semibold text-sm transition-all"
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(212,175,55,0.35)',
                    color: '#d4af37',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(212,175,55,0.07)'
                    e.currentTarget.style.borderColor = '#d4af37'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.borderColor = 'rgba(212,175,55,0.35)'
                  }}
                >
                  Load More ({filtered.length - visibleCount} remaining)
                </button>
              </div>
            )}

            {/* All shown */}
            {!loading && filtered.length > 0 && visibleCount >= filtered.length && (
              <p className="text-center text-xs text-[#2a2a2a] py-10">
                ✦ All {filtered.length} products shown ✦
              </p>
            )}
          </div>
        </div>

        <SeoBlock text={seoDescription} />
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 lg:hidden"
              style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 z-50 lg:hidden flex flex-col"
              style={{
                width: 'min(310px, 88vw)',
                background: 'linear-gradient(180deg, #111111, #0e0e0e)',
                borderRight: '1px solid #181818',
                padding: '24px 20px 20px',
              }}
            >
              <FilterSidebar {...filterProps} onClose={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  )
}

export default CollectionGrid