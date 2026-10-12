// src/pages/public/collections/GoldJewelleryPage.jsx
import { useEffect, useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiRefreshCw, FiFilter, FiX, FiSearch,
  FiSliders, FiTag, FiChevronDown,
} from 'react-icons/fi'
import { HiSparkles } from 'react-icons/hi'
import SEO from '../../../components/common/SEO.jsx'
import Breadcrumb from '../../../components/common/Breadcrumb.jsx'
import ProductGrid from '../../../components/public/product/ProductGrid.jsx'
import { productApi } from '../../../api/productApi.js'
import { goldPriceApi } from '../../../api/goldPriceApi.js'
import CollectionHero from '../../../components/public/collection/CollectionHero.jsx'
import toast from 'react-hot-toast'

const KARAT_OPTIONS = ['24k', '23k', '22k', '21k', '20k', '19k', '18k', '17k', '16k']

const SORT_OPTIONS = [
  { value: '',           label: 'Featured',         icon: '✦' },
  { value: 'price-low',  label: 'Price: Low → High', icon: '↑' },
  { value: 'price-high', label: 'Price: High → Low', icon: '↓' },
  { value: 'newest',     label: 'Newest First',      icon: '🆕' },
]

const PRICE_RANGES = [
  { label: 'Under Rs.50,000',           min: 0,      max: 50000    },
  { label: 'Rs.50,000 – Rs.1,00,000',   min: 50000,  max: 100000   },
  { label: 'Rs.1,00,000 – Rs.2,00,000', min: 100000, max: 200000   },
  { label: 'Above Rs.2,00,000',         min: 200000, max: Infinity  },
]

// ── Gold Price Banner ─────────────────────────────────────────
const GoldPriceBanner = ({ goldPrice, refreshing, onRefresh }) => {
  if (!goldPrice) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="mx-auto w-fit"
    >
      <div
        className="inline-flex flex-wrap items-center gap-5 px-6 py-4 rounded-2xl"
        style={{
          background: 'rgba(212,175,55,0.06)',
          border: '1px solid rgba(212,175,55,0.2)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-[#6b7280] font-medium uppercase tracking-wider">Live Gold Rate</span>
        </div>

        <div className="text-center">
          <p className="text-[10px] text-[#4b5563] mb-0.5">Gold / Gram (24k)</p>
          <p className="font-bold text-[#d4af37] text-lg leading-none">
            Rs. {Number(goldPrice.goldPricePerGram || 0).toLocaleString()}
          </p>
        </div>

        <div className="w-px h-8 bg-[#2a2a2a]" />

        <div className="text-center">
          <p className="text-[10px] text-[#4b5563] mb-0.5">Gold / Tola (24k)</p>
          <p className="font-bold text-[#d4af37] text-lg leading-none">
            Rs. {Number(goldPrice.goldPricePerTola || 0).toLocaleString()}
          </p>
        </div>

        {goldPrice.silverPricePerGram > 0 && (
          <>
            <div className="w-px h-8 bg-[#2a2a2a]" />
            <div className="text-center">
              <p className="text-[10px] text-[#4b5563] mb-0.5">Silver / Gram</p>
              <p className="font-bold text-[#9ca3af] text-lg leading-none">
                Rs. {Number(goldPrice.silverPricePerGram || 0).toLocaleString()}
              </p>
            </div>
          </>
        )}

        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="p-2 rounded-xl text-[#d4af37] transition-all hover:scale-110"
          style={{ background: 'rgba(212,175,55,0.08)' }}
          title="Refresh gold rate"
        >
          <FiRefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
        </button>
      </div>
    </motion.div>
  )
}

// ── Filter Sidebar ────────────────────────────────────────────
const FilterSidebar = ({
  karatFilter, setKaratFilter,
  activePriceRange, setActivePriceRange,
  activeSort, setActiveSort,
  searchQuery, setSearchQuery,
  onClear, hasFilters, resultCount, onClose,
}) => (
  <div className="flex flex-col h-full">

    <div className="flex items-center justify-between pb-4 mb-5" style={{ borderBottom: '1px solid #1a1a1a' }}>
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.18)' }}
        >
          <FiSliders size={14} style={{ color: '#d4af37' }} />
        </div>
        <span className="font-semibold text-white text-sm">Refine</span>
        {hasFilters && (
          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: '#d4af37', color: '#0a0a0a' }}>
            ON
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {hasFilters && (
          <button onClick={onClear} className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1">
            <FiX size={11} /> Reset
          </button>
        )}
        {onClose && (
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center lg:hidden"
            style={{ background: '#1a1a1a', color: '#6b7280' }}
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
          className="flex items-center gap-2 rounded-xl px-3 py-2.5"
          style={{
            background: '#0e0e0e',
            border: `1px solid ${searchQuery ? 'rgba(212,175,55,0.4)' : '#1a1a1a'}`,
          }}
        >
          <FiSearch size={13} style={{ color: '#3d3d3d', flexShrink: 0 }} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search gold jewellery..."
            className="bg-transparent outline-none text-sm text-white placeholder-[#2d2d2d] w-full"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-[#3d3d3d] hover:text-white transition-colors">
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
                color: activeSort === opt.value ? '#d4af37' : '#4a4a4a',
              }}
            >
              <span
                className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{
                  background: activeSort === opt.value ? 'rgba(212,175,55,0.14)' : '#0e0e0e',
                  color: activeSort === opt.value ? '#d4af37' : '#2d2d2d',
                }}
              >
                {opt.icon}
              </span>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Karat */}
      <div>
        <p className="sidebar-label">Gold Karat</p>
        <div className="space-y-0.5">
          <button
            onClick={() => setKaratFilter('')}
            className="sidebar-btn w-full flex items-center gap-2.5"
            style={{
              background: !karatFilter ? 'rgba(212,175,55,0.07)' : 'transparent',
              color: !karatFilter ? '#d4af37' : '#4a4a4a',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: !karatFilter ? '#d4af37' : '#2d2d2d' }} />
            All Karats
          </button>
          {KARAT_OPTIONS.map(k => (
            <button
              key={k}
              onClick={() => setKaratFilter(karatFilter === k ? '' : k)}
              className="sidebar-btn w-full flex items-center gap-2.5"
              style={{
                background: karatFilter === k ? 'rgba(212,175,55,0.07)' : 'transparent',
                color: karatFilter === k ? '#d4af37' : '#4a4a4a',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: karatFilter === k ? '#d4af37' : '#2d2d2d' }} />
              {k} Gold
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <p className="sidebar-label">Price Range</p>
        <div className="space-y-0.5">
          <button
            onClick={() => setActivePriceRange(null)}
            className="sidebar-btn w-full flex items-center gap-2.5"
            style={{
              background: !activePriceRange ? 'rgba(212,175,55,0.07)' : 'transparent',
              color: !activePriceRange ? '#d4af37' : '#4a4a4a',
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
                  color: isActive ? '#d4af37' : '#4a4a4a',
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

    {onClose && (
      <div className="pt-4 mt-4" style={{ borderTop: '1px solid #1a1a1a' }}>
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl font-semibold text-sm"
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

// ── Main Page ─────────────────────────────────────────────────
const GoldJewelleryPage = () => {
  const [products,        setProducts]        = useState([])
  const [filtered,        setFiltered]        = useState([])
  const [goldPrice,       setGoldPrice]       = useState(null)
  const [loading,         setLoading]         = useState(true)
  const [refreshing,      setRefreshing]      = useState(false)
  const [karatFilter,     setKaratFilter]     = useState('')
  const [activePriceRange,setActivePriceRange]= useState(null)
  const [searchQuery,     setSearchQuery]     = useState('')
  const [activeSort,      setActiveSort]      = useState('')
  const [visibleCount,    setVisibleCount]    = useState(12)
  const [mobileOpen,      setMobileOpen]      = useState(false)
  const loaderRef = useRef(null)

  useEffect(() => { loadData() }, [])

  useEffect(() => { applyFilters() }, [products, karatFilter, activePriceRange, searchQuery, activeSort])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  useEffect(() => {
    if (!loaderRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisibleCount(p => p + 12) },
      { threshold: 0.1 }
    )
    observer.observe(loaderRef.current)
    return () => observer.disconnect()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [prodRes, priceRes] = await Promise.all([
        productApi.getPageProducts('gold'),
        goldPriceApi.getLatest(),
      ])
      if (prodRes.data.success)  setProducts(prodRes.data.products || [])
      if (priceRes.data.success) setGoldPrice(priceRes.data.goldPrice)
    } catch (err) {
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleRefreshPrice = async () => {
    setRefreshing(true)
    try {
      const res = await goldPriceApi.getLatest()
      if (res.data.success) {
        setGoldPrice(res.data.goldPrice)
        toast.success('Gold rate refreshed!')
      }
    } catch {
      toast.error('Failed to refresh rate')
    } finally {
      setRefreshing(false)
    }
  }

  const applyFilters = useCallback(() => {
    let result = [...products]

    if (karatFilter)     result = result.filter(p => p.goldKarat === karatFilter)
    if (activePriceRange) result = result.filter(p => p.price >= activePriceRange.min && p.price <= activePriceRange.max)

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.goldKarat?.toLowerCase().includes(q)
      )
    }

    switch (activeSort) {
      case 'price-low':  result.sort((a, b) => a.price - b.price); break
      case 'price-high': result.sort((a, b) => b.price - a.price); break
      case 'newest':     result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)); break
      default:           result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    }

    setFiltered(result)
    setVisibleCount(12)
  }, [products, karatFilter, activePriceRange, searchQuery, activeSort])

  const handleClear = () => {
    setKaratFilter('')
    setActivePriceRange(null)
    setSearchQuery('')
    setActiveSort('')
  }

  const hasFilters = !!(karatFilter || activePriceRange || searchQuery || activeSort)
  const activeFilterCount = [karatFilter, activePriceRange, searchQuery].filter(Boolean).length

  const filterProps = {
    karatFilter, setKaratFilter,
    activePriceRange, setActivePriceRange,
    activeSort, setActiveSort,
    searchQuery, setSearchQuery,
    hasFilters, onClear: handleClear,
    resultCount: filtered.length,
  }

  return (
    <>
      <SEO
        title="Gold Jewellery | MeerabLuxe Jewellers"
        description="Authentic hallmark certified gold jewellery from 16k to 24k. Prices updated daily."
        keywords="gold jewellery Pakistan, 22k gold jewellery, 24k gold, gold necklace Pakistan"
        canonical="/collections/gold-jewellery"
      />

      {/* Hero */}
      <CollectionHero
        title="Gold Jewellery Collection"
        subtitle="Pure & Authentic"
        badge="🏅 Hallmark Certified"
        description="Hallmark certified gold jewellery available in 16k to 24k. Prices are calculated daily based on the latest Sarafa market rates from Mingora, Swat."
        productCount={products.length}
        loading={loading}
        accentColor="#d4af37"
        emoji="🏅"
        imageSet="gold"
      />

      {/* Live Gold Price — below hero */}
      <div
        className="py-6 flex justify-center"
        style={{ background: '#0a0a0a', borderBottom: '1px solid #141414' }}
      >
        {goldPrice ? (
          <GoldPriceBanner
            goldPrice={goldPrice}
            refreshing={refreshing}
            onRefresh={handleRefreshPrice}
          />
        ) : !loading ? (
          <div
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm"
            style={{
              background: 'rgba(212,175,55,0.04)',
              border: '1px solid rgba(212,175,55,0.12)',
              color: '#4b5563',
            }}
          >
            <HiSparkles size={14} style={{ color: '#d4af37' }} />
            Gold rate not set. Contact us for pricing.
          </div>
        ) : null}
      </div>

      {/* Main Content */}
      <section className="py-8 md:py-12" style={{ background: '#0d0d0d', minHeight: '60vh' }}>

        <style>{`
          .sidebar-label {
            font-size: 10px; font-weight: 700; letter-spacing: 0.16em;
            text-transform: uppercase; color: #3a3a3a;
            margin-bottom: 8px; padding-left: 4px;
          }
          .sidebar-btn {
            font-size: 13px; text-align: left;
            padding: 7px 10px; border-radius: 8px;
            transition: all 0.2s; width: 100%;
          }
          .sidebar-btn:hover { background: rgba(255,255,255,0.02) !important; }
          .sidebar-scroll::-webkit-scrollbar { width: 3px; }
          .sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
          .sidebar-scroll::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 4px; }
        `}</style>

        <div className="container-custom">
          <div className="mb-6">
            <Breadcrumb items={[
              { name: 'Home', url: '/' },
              { name: 'Collections', url: '/shop' },
              { name: 'Gold Jewellery' },
            ]} />
          </div>

          {/* Toolbar */}
          <div
            className="flex flex-wrap items-center gap-3 mb-6 px-4 py-3 rounded-2xl"
            style={{ background: 'linear-gradient(135deg, #111, #161616)', border: '1px solid #1a1a1a' }}
          >
            <div className="flex-1 min-w-fit">
              {loading ? (
                <div className="h-5 w-28 rounded animate-pulse" style={{ background: '#1a1a1a' }} />
              ) : (
                <p className="text-sm text-[#4b5563]">
                  <span className="font-semibold text-white">{filtered.length}</span>
                  {' '}gold piece{filtered.length !== 1 ? 's' : ''}
                  {hasFilters && <span className="text-[#d4af37]"> (filtered)</span>}
                </p>
              )}
            </div>

            {/* Mobile filter btn */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={{
                background: activeFilterCount > 0 ? 'rgba(212,175,55,0.08)' : '#161616',
                border: `1px solid ${activeFilterCount > 0 ? 'rgba(212,175,55,0.28)' : '#1a1a1a'}`,
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
                    border: `1px solid ${activeSort === opt.value ? 'rgba(212,175,55,0.28)' : '#1a1a1a'}`,
                    color: activeSort === opt.value ? '#d4af37' : '#4b5563',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>

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
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap gap-2 mb-5"
              >
                {karatFilter && (
                  <button
                    onClick={() => setKaratFilter('')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.22)', color: '#d4af37' }}
                  >
                    {karatFilter} Gold <FiX size={11} />
                  </button>
                )}
                {activePriceRange && (
                  <button
                    onClick={() => setActivePriceRange(null)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.22)', color: '#d4af37' }}
                  >
                    {activePriceRange.label} <FiX size={11} />
                  </button>
                )}
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.22)', color: '#d4af37' }}
                  >
                    "{searchQuery}" <FiX size={11} />
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Layout */}
          <div className="flex gap-6 lg:gap-8">

            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col flex-shrink-0" style={{ width: '230px' }}>
              <div
                className="rounded-2xl p-5 sticky top-24"
                style={{
                  background: 'linear-gradient(180deg, #111, #0e0e0e)',
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
                emptyMessage="No gold jewellery found"
                emptyDesc={
                  karatFilter
                    ? `No products found for ${karatFilter}. Try a different karat.`
                    : 'Gold jewellery products will appear here once added.'
                }
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
                    className="px-8 py-3 rounded-xl font-semibold text-sm transition-all"
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

              {!loading && filtered.length > 0 && visibleCount >= filtered.length && (
                <p className="text-center text-xs text-[#2a2a2a] py-10">
                  ✦ All {filtered.length} gold products shown ✦
                </p>
              )}
            </div>
          </div>

          {/* Feature cards */}
          {!loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              {[
                { icon: '🏅', title: 'Hallmark Certified', desc: 'All our gold jewellery is hallmark certified, guaranteeing purity and quality.' },
                { icon: '📈', title: 'Daily Rate Updates', desc: 'Prices updated daily based on Pakistan Sarafa market rates from Mingora, Swat.' },
                { icon: '🎨', title: 'Custom Gold Orders', desc: 'Want a custom gold piece? Contact us via WhatsApp for personalized orders.' },
              ].map(item => (
                <div
                  key={item.title}
                  className="rounded-2xl p-6 text-center"
                  style={{
                    background: 'linear-gradient(135deg, #0e0e0e, #111)',
                    border: '1px solid rgba(212,175,55,0.1)',
                  }}
                >
                  <div className="text-3xl mb-3" style={{ filter: 'drop-shadow(0 0 12px rgba(212,175,55,0.3))' }}>
                    {item.icon}
                  </div>
                  <h3 className="font-semibold text-white mb-2 text-sm">{item.title}</h3>
                  <p className="text-xs text-[#3a3a3a] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 lg:hidden"
              style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(8px)' }}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 z-50 lg:hidden flex flex-col"
              style={{
                width: 'min(310px, 88vw)',
                background: 'linear-gradient(180deg, #111, #0e0e0e)',
                borderRight: '1px solid #181818',
                padding: '24px 20px 20px',
              }}
            >
              <FilterSidebar {...filterProps} onClose={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default GoldJewelleryPage