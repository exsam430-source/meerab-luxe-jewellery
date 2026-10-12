// src/pages/public/Shop.jsx
import { useEffect, useState, useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiFilter, FiX, FiChevronDown, FiSearch,
  FiSliders, FiTag, FiPackage,
} from 'react-icons/fi'
import { HiSparkles } from 'react-icons/hi'
import SEO from '../../components/common/SEO.jsx'
import Breadcrumb from '../../components/common/Breadcrumb.jsx'
import ProductGrid from '../../components/public/product/ProductGrid.jsx'
import { seoData } from '../../utils/seoData.js'
import { productApi } from '../../api/productApi.js'
import { useCart } from '../../context/CartContext.jsx'
import { getBreadcrumbSchema } from '../../utils/structuredData.js'

const SORT_OPTIONS = [
  { value: '',           label: 'Featured'          },
  { value: 'newest',     label: 'Newest First'       },
  { value: 'price-low',  label: 'Price: Low → High'  },
  { value: 'price-high', label: 'Price: High → Low'  },
  { value: 'name-az',    label: 'Name: A → Z'        },
]

const PRICE_RANGES = [
  { label: 'Under Rs.1,000',       min: '',      max: '1000'  },
  { label: 'Rs.1,000 – Rs.3,000',  min: '1000',  max: '3000'  },
  { label: 'Rs.3,000 – Rs.5,000',  min: '3000',  max: '5000'  },
  { label: 'Rs.5,000 – Rs.10,000', min: '5000',  max: '10000' },
  { label: 'Above Rs.10,000',      min: '10000', max: ''      },
]

const ITEMS_PER_PAGE = 12
const ACCENT     = '#d4af37'
const ACCENT_RGB = '212,175,55'

// ── Shop Hero ─────────────────────────────────────────────────
const ShopHero = ({ productCount, loading, allProducts }) => {
  const [currentImg, setCurrentImg] = useState(0)
  const [loadedImages, setLoadedImages] = useState({})

  const heroImages = useMemo(() => {
    if (!allProducts?.length) return []
    const featured = allProducts.filter(p => p.featured)
    const withImages = allProducts.filter(p => p.image || p.images?.[0])
    return [...featured, ...withImages]
      .filter(p => p.image || p.images?.[0])
      .reduce((acc, p) => {
        const img = p.image || p.images?.[0]
        if (img && !acc.includes(img)) acc.push(img)
        return acc
      }, [])
      .slice(0, 5)
  }, [allProducts])

  useEffect(() => {
    if (heroImages.length <= 1) return
    const timer = setInterval(() => {
      setCurrentImg(prev => (prev + 1) % heroImages.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [heroImages.length])

  return (
    <section
      className="relative overflow-hidden"
      style={{
        minHeight: 'clamp(340px, 48vh, 540px)',
        background: 'linear-gradient(135deg, #060608 0%, #0e0e18 40%, #121220 70%, #060608 100%)',
      }}
    >
      {/* BG images */}
      {heroImages.length > 0 && (
        <div className="absolute inset-0">
          {heroImages.map((src, i) => (
            <motion.img
              key={src}
              src={src}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              loading={i === 0 ? 'eager' : 'lazy'}
              onLoad={() => setLoadedImages(prev => ({ ...prev, [i]: true }))}
              initial={{ opacity: 0 }}
              animate={{
                opacity: i === currentImg && loadedImages[i] ? 1 : 0,
                scale: i === currentImg ? 1.06 : 1,
              }}
              transition={{
                opacity: { duration: 1.3, ease: 'easeInOut' },
                scale: { duration: 8, ease: 'linear' },
              }}
            />
          ))}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(
                to right,
                rgba(0,0,0,0.94) 0%,
                rgba(0,0,0,0.84) 35%,
                rgba(0,0,0,0.70) 60%,
                rgba(0,0,0,0.55) 100%
              )`,
            }}
          />
          <div
            className="absolute top-0 left-0 right-0 h-28"
            style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.65), transparent)' }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 65% 40%, rgba(${ACCENT_RGB},0.07) 0%, transparent 60%)`,
              mixBlendMode: 'screen',
            }}
          />
        </div>
      )}

      {/* SVG pattern */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="shopPattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M40 8 L72 40 L40 72 L8 40 Z" fill="none" stroke={ACCENT} strokeWidth="0.4" opacity="0.08" />
              <path d="M40 22 L58 40 L40 58 L22 40 Z" fill="none" stroke={ACCENT} strokeWidth="0.3" opacity="0.05" />
              <circle cx="40" cy="40" r="1.5" fill={ACCENT} opacity="0.06" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#shopPattern)" />
        </svg>

        {/* Floating orbs */}
        {[
          { x: '10%', y: '20%', r: 180, delay: 0, dur: 5 },
          { x: '80%', y: '60%', r: 240, delay: 1.5, dur: 6.5 },
          { x: '55%', y: '10%', r: 110, delay: 0.8, dur: 4.5 },
        ].map((o, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: o.x, top: o.y,
              width: o.r * 2, height: o.r * 2,
              transform: 'translate(-50%,-50%)',
              background: `radial-gradient(circle, rgba(${ACCENT_RGB},0.07) 0%, transparent 70%)`,
            }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0.6, 0.25] }}
            transition={{ duration: o.dur, repeat: Infinity, delay: o.delay, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px z-20"
        style={{
          background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)`,
          boxShadow: `0 0 20px ${ACCENT}55`,
        }}
      />

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to top, #0d0d0d, transparent)' }}
      />

      {/* Content */}
      <div
        className="relative z-10 container-custom flex flex-col justify-center"
        style={{
          minHeight: 'clamp(340px, 48vh, 540px)',
          padding: 'clamp(52px, 8vw, 100px) clamp(20px, 5vw, 48px)',
        }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="mb-4"
        >
          <span
            className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.22em] uppercase px-4 py-2 rounded-full"
            style={{
              background: 'rgba(0,0,0,0.5)',
              border: `1px solid rgba(${ACCENT_RGB},0.28)`,
              color: ACCENT,
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
          >
            <motion.span
              animate={{ scale: [1, 1.45, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: ACCENT, boxShadow: `0 0 6px ${ACCENT}` }}
            />
            Complete Collection
          </span>
        </motion.div>

        {/* Emoji */}
        <motion.div
          initial={{ opacity: 0, scale: 0.4, rotate: -15 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 160, delay: 0.15 }}
          className="mb-3 text-4xl md:text-5xl select-none leading-none"
          style={{ filter: `drop-shadow(0 0 24px rgba(${ACCENT_RGB},0.5))` }}
        >
          🛍️
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.22 }}
          className="font-playfair font-bold text-white leading-[1.06] mb-4"
          style={{
            fontSize: 'clamp(28px, 5vw, 58px)',
            textShadow: '0 2px 40px rgba(0,0,0,0.6)',
            letterSpacing: '-0.01em',
          }}
        >
          Shop All{' '}
          <span style={{ color: ACCENT }}>Jewellery</span>
        </motion.h1>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex items-center gap-3 mb-4"
          style={{ transformOrigin: 'left' }}
        >
          <div style={{ height: 1, width: 50, background: `linear-gradient(90deg, ${ACCENT}, transparent)` }} />
          <div className="rotate-45 flex-shrink-0" style={{ width: 6, height: 6, background: ACCENT, boxShadow: `0 0 10px ${ACCENT}` }} />
          <div style={{ height: 1, width: 28, background: `linear-gradient(90deg, rgba(${ACCENT_RGB},0.5), transparent)` }} />
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.5 }}
          className="leading-relaxed max-w-lg mb-6"
          style={{
            fontSize: 'clamp(13px, 1.6vw, 15px)',
            color: 'rgba(195,195,195,0.85)',
            textShadow: '0 1px 8px rgba(0,0,0,0.4)',
          }}
        >
          Explore our complete collection of premium gold jewellery — necklaces, bangles,
          bridal sets, rings, earrings and more. Crafted with love from Sarafa Bazaar, Mingora Swat.
        </motion.p>

        {/* Count + badges */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          className="flex flex-wrap items-center gap-3"
        >
          {loading ? (
            <div className="h-9 w-36 rounded-full animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
          ) : (
            <div
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium"
              style={{
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.07)',
                color: '#9a9a9a',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
              }}
            >
              <FiPackage size={14} style={{ color: ACCENT }} />
              <span>
                <strong style={{ color: ACCENT }}>{productCount}</strong>
                {' '}piece{productCount !== 1 ? 's' : ''} available
              </span>
            </div>
          )}
          <div
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium"
            style={{
              background: 'rgba(0,0,0,0.35)',
              border: '1px solid rgba(255,255,255,0.05)',
              color: 'rgba(255,255,255,0.4)',
            }}
          >
            🚚 Free delivery above Rs.3,000
          </div>
          <div
            className="hidden md:inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium"
            style={{
              background: 'rgba(0,0,0,0.35)',
              border: '1px solid rgba(255,255,255,0.05)',
              color: 'rgba(255,255,255,0.4)',
            }}
          >
            💵 Cash on Delivery
          </div>
        </motion.div>
      </div>

      {/* Dot indicators */}
      {heroImages.length > 1 && (
        <div className="absolute bottom-6 right-6 z-20 flex items-center gap-1.5">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentImg(i)}
              className="transition-all duration-300 rounded-full"
              style={{
                width: i === currentImg ? 18 : 5,
                height: 5,
                background: i === currentImg ? ACCENT : 'rgba(255,255,255,0.18)',
              }}
            />
          ))}
        </div>
      )}
    </section>
  )
}

// ── Filter Panel ──────────────────────────────────────────────
const FilterPanel = ({ filters, onFilterChange, onClearFilters, allProducts, onClose }) => {
  const hasActiveFilters = filters.category || filters.subCategory || filters.minPrice || filters.maxPrice

  const categories = useMemo(
    () => [...new Set(allProducts.map(p => p.category).filter(Boolean))],
    [allProducts]
  )

  const subCategories = useMemo(() => {
    if (!filters.category) return []
    return [...new Set(
      allProducts.filter(p => p.category === filters.category).map(p => p.subCategory).filter(Boolean)
    )]
  }, [allProducts, filters.category])

  const btnStyle = active => ({
    background: active ? 'rgba(212,175,55,0.07)' : 'transparent',
    color: active ? '#d4af37' : '#4a4a4a',
  })

  return (
    <div className="space-y-5">

      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white flex items-center gap-2 text-sm">
          <FiSliders size={15} style={{ color: ACCENT }} />
          Filters
          {hasActiveFilters && (
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-bold"
              style={{ background: ACCENT, color: '#0a0a0a' }}
            >
              ON
            </span>
          )}
        </h3>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button onClick={onClearFilters} className="text-xs text-red-400/70 hover:text-red-300 transition-colors">
              Clear All
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg transition-colors lg:hidden"
              style={{ background: '#1a1a1a', color: '#4b5563' }}
            >
              <FiX size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Category */}
      <div>
        <p className="sidebar-label">Category</p>
        <div className="space-y-0.5">
          <button
            onClick={() => onFilterChange({ category: '', subCategory: '' })}
            className="w-full text-left text-sm px-3 py-2 rounded-lg transition-all"
            style={btnStyle(!filters.category)}
          >
            All Categories
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => onFilterChange({ category: filters.category === cat ? '' : cat, subCategory: '' })}
              className="w-full text-left text-sm px-3 py-2 rounded-lg transition-all"
              style={btnStyle(filters.category === cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Sub Category */}
      <AnimatePresence>
        {subCategories.length > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <p className="sidebar-label">Type</p>
            <div className="space-y-0.5">
              <button
                onClick={() => onFilterChange({ subCategory: '' })}
                className="w-full text-left text-sm px-3 py-2 rounded-lg transition-all"
                style={btnStyle(!filters.subCategory)}
              >
                All Types
              </button>
              {subCategories.map(sub => (
                <button
                  key={sub}
                  onClick={() => onFilterChange({ subCategory: filters.subCategory === sub ? '' : sub })}
                  className="w-full text-left text-sm px-3 py-2 rounded-lg transition-all"
                  style={btnStyle(filters.subCategory === sub)}
                >
                  {sub}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Price Range */}
      <div>
        <p className="sidebar-label">Price Range</p>
        <div className="space-y-0.5">
          <button
            onClick={() => onFilterChange({ minPrice: '', maxPrice: '' })}
            className="w-full text-left text-sm px-3 py-2 rounded-lg transition-all flex items-center gap-2"
            style={btnStyle(!filters.minPrice && !filters.maxPrice)}
          >
            <FiTag size={11} className="flex-shrink-0" />
            Any Price
          </button>
          {PRICE_RANGES.map(range => {
            const isActive = filters.minPrice === range.min && filters.maxPrice === range.max
            return (
              <button
                key={range.label}
                onClick={() => onFilterChange({
                  minPrice: isActive ? '' : range.min,
                  maxPrice: isActive ? '' : range.max,
                })}
                className="w-full text-left text-sm px-3 py-2 rounded-lg transition-all flex items-center gap-2"
                style={btnStyle(isActive)}
              >
                <FiTag size={11} className="flex-shrink-0" />
                {range.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Custom Price */}
      <div>
        <p className="sidebar-label">Custom Price</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={filters.minPrice}
            onChange={e => onFilterChange({ minPrice: e.target.value })}
            className="input-dark text-sm py-2"
            placeholder="Min"
            min="0"
          />
          <span className="text-[#3d3d3d] text-sm flex-shrink-0">to</span>
          <input
            type="number"
            value={filters.maxPrice}
            onChange={e => onFilterChange({ maxPrice: e.target.value })}
            className="input-dark text-sm py-2"
            placeholder="Max"
            min="0"
          />
        </div>
      </div>

      {/* Sort */}
      <div>
        <p className="sidebar-label">Sort By</p>
        <div className="space-y-0.5">
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => onFilterChange({ sort: opt.value })}
              className="w-full text-left text-sm px-3 py-2 rounded-lg transition-all"
              style={btnStyle(filters.sort === opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Active Pills ──────────────────────────────────────────────
const ActivePills = ({ filters, onFilterChange, onClearFilters }) => {
  const pills = []
  if (filters.category)    pills.push({ label: filters.category,    clear: () => onFilterChange({ category: '', subCategory: '' }) })
  if (filters.subCategory) pills.push({ label: filters.subCategory, clear: () => onFilterChange({ subCategory: '' }) })
  if (filters.minPrice || filters.maxPrice) {
    const label = filters.minPrice && filters.maxPrice
      ? `Rs.${Number(filters.minPrice).toLocaleString()} – Rs.${Number(filters.maxPrice).toLocaleString()}`
      : filters.minPrice ? `Above Rs.${Number(filters.minPrice).toLocaleString()}`
      : `Under Rs.${Number(filters.maxPrice).toLocaleString()}`
    pills.push({ label, clear: () => onFilterChange({ minPrice: '', maxPrice: '' }) })
  }
  if (filters.search) pills.push({ label: `"${filters.search}"`, clear: () => onFilterChange({ search: '' }) })

  if (!pills.length) return null

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="flex flex-wrap items-center gap-2 mb-5"
    >
      <span className="text-[10px] text-[#3a3a3a] font-medium">Active:</span>
      {pills.map((p, i) => (
        <motion.button
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={p.clear}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all hover:opacity-75"
          style={{
            background: 'rgba(212,175,55,0.07)',
            border: '1px solid rgba(212,175,55,0.2)',
            color: '#d4af37',
          }}
        >
          {p.label} <FiX size={9} />
        </motion.button>
      ))}
      {pills.length > 1 && (
        <button onClick={onClearFilters} className="text-[11px] text-red-400/60 hover:text-red-300 transition-colors px-1">
          Clear all
        </button>
      )}
    </motion.div>
  )
}

// ── Main Shop ─────────────────────────────────────────────────
const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { setProducts: setCartProducts } = useCart()

  const [allProducts,       setAllProducts]       = useState([])
  const [filteredProducts,  setFilteredProducts]  = useState([])
  const [loading,           setLoading]           = useState(true)
  const [visibleCount,      setVisibleCount]      = useState(ITEMS_PER_PAGE)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const [filters, setFilters] = useState({
    category:    searchParams.get('category')    || '',
    subCategory: searchParams.get('subCategory') || '',
    search:      searchParams.get('search')      || '',
    minPrice:    searchParams.get('minPrice')    || '',
    maxPrice:    searchParams.get('maxPrice')    || '',
    sort:        searchParams.get('sort')        || '',
  })

  useEffect(() => { loadProducts() }, [])

  useEffect(() => {
    const params = {}
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v })
    setSearchParams(params, { replace: true })
  }, [filters])

  useEffect(() => { applyFilters() }, [allProducts, filters])

  useEffect(() => {
    document.body.style.overflow = mobileFiltersOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileFiltersOpen])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const res = await productApi.getAll()
      if (res.data.success) {
        const products = res.data.products || []
        setAllProducts(products)
        setCartProducts(products)
      }
    } catch (err) {
      console.error('Shop load error:', err)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = useCallback(() => {
    let result = [...allProducts]
    if (filters.category)    result = result.filter(p => p.category === filters.category)
    if (filters.subCategory) result = result.filter(p => p.subCategory === filters.subCategory)
    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.subCategory?.toLowerCase().includes(q)
      )
    }
    if (filters.minPrice) result = result.filter(p => p.price >= Number(filters.minPrice))
    if (filters.maxPrice) result = result.filter(p => p.price <= Number(filters.maxPrice))

    switch (filters.sort) {
      case 'newest':     result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)); break
      case 'price-low':  result.sort((a, b) => a.price - b.price); break
      case 'price-high': result.sort((a, b) => b.price - a.price); break
      case 'name-az':    result.sort((a, b) => (a.name || '').localeCompare(b.name || '')); break
      default:           result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    }

    setFilteredProducts(result)
    setVisibleCount(ITEMS_PER_PAGE)
  }, [allProducts, filters])

  const handleFilterChange = useCallback(f => setFilters(prev => ({ ...prev, ...f })), [])

  const handleClearFilters = useCallback(() => {
    setFilters({ category: '', subCategory: '', search: '', minPrice: '', maxPrice: '', sort: '' })
  }, [])

  const hasActiveFilters = !!(filters.category || filters.subCategory || filters.minPrice || filters.maxPrice || filters.search)

  const activeFilterCount = [
    filters.category,
    filters.subCategory,
    filters.minPrice || filters.maxPrice,
    filters.search,
  ].filter(Boolean).length

  const filterPanelProps = { filters, onFilterChange: handleFilterChange, onClearFilters: handleClearFilters, allProducts }

  return (
    <>
      <SEO
        title={seoData.shop?.title || 'Shop All Jewellery | MeerabLuxe Jewellers'}
        description={seoData.shop?.description}
        keywords={seoData.shop?.keywords}
        canonical="/shop"
        structuredData={getBreadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Shop', url: '/shop' }])}
      />

      {/* Hero with real product images */}
      <ShopHero productCount={filteredProducts.length} loading={loading} allProducts={allProducts} />

      {/* Main content */}
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
              { name: filters.category || 'All Jewellery' },
            ]} />
          </div>

          {/* Toolbar */}
          <div
            className="flex items-center gap-3 mb-5 px-4 py-3 rounded-2xl flex-wrap"
            style={{ background: 'linear-gradient(135deg, #111, #161616)', border: '1px solid #1a1a1a' }}
          >
            {/* Search */}
            <div
              className="flex items-center gap-2 flex-1 min-w-[160px]"
              style={{
                background: '#0e0e0e',
                border: `1px solid ${filters.search ? 'rgba(212,175,55,0.35)' : '#1a1a1a'}`,
                borderRadius: '10px',
                padding: '8px 12px',
              }}
            >
              <FiSearch size={14} style={{ color: '#3d3d3d', flexShrink: 0 }} />
              <input
                type="text"
                value={filters.search}
                onChange={e => handleFilterChange({ search: e.target.value })}
                placeholder="Search jewellery..."
                className="bg-transparent outline-none text-sm text-white placeholder-[#2d2d2d] w-full"
              />
              {filters.search && (
                <button
                  onClick={() => handleFilterChange({ search: '' })}
                  className="text-[#3d3d3d] hover:text-white transition-colors flex-shrink-0"
                >
                  <FiX size={13} />
                </button>
              )}
            </div>

            {/* Mobile filter button */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all flex-shrink-0"
              style={{
                background: activeFilterCount > 0 ? 'rgba(212,175,55,0.08)' : '#161616',
                color: activeFilterCount > 0 ? '#d4af37' : '#4b5563',
                border: `1px solid ${activeFilterCount > 0 ? 'rgba(212,175,55,0.25)' : '#1a1a1a'}`,
              }}
            >
              <FiSliders size={14} />
              Filter
              {activeFilterCount > 0 && (
                <span
                  className="rounded-full text-[10px] font-bold flex items-center justify-center"
                  style={{ background: ACCENT, color: '#0a0a0a', width: 18, height: 18 }}
                >
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort */}
            <div className="relative flex-shrink-0">
              <select
                value={filters.sort}
                onChange={e => handleFilterChange({ sort: e.target.value })}
                className="appearance-none text-sm py-2 pl-3 pr-8 rounded-xl outline-none cursor-pointer"
                style={{
                  background: '#0e0e0e',
                  color: filters.sort ? ACCENT : '#4b5563',
                  border: '1px solid #1a1a1a',
                  minWidth: '155px',
                }}
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <FiChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#3d3d3d' }} />
            </div>

            {/* Count */}
            <p className="hidden sm:block text-xs text-[#3a3a3a] flex-shrink-0 ml-auto">
              {loading ? '...' : (
                <>
                  <span className="font-semibold" style={{ color: ACCENT }}>
                    {Math.min(visibleCount, filteredProducts.length)}
                  </span>
                  {' of '}
                  <span className="font-semibold" style={{ color: ACCENT }}>
                    {filteredProducts.length}
                  </span>
                </>
              )}
            </p>

            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-1.5 text-xs text-red-400/60 hover:text-red-300 transition-colors flex-shrink-0 px-2"
              >
                <FiX size={12} /> Clear
              </button>
            )}
          </div>

          {/* Active pills */}
          <AnimatePresence>
            {hasActiveFilters && (
              <ActivePills
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
              />
            )}
          </AnimatePresence>

          {/* Sidebar + Grid */}
          <div className="flex gap-6 lg:gap-8">

            {/* Desktop sidebar */}
            <aside className="hidden lg:flex flex-col flex-shrink-0" style={{ width: '220px' }}>
              <div
                className="rounded-2xl p-4 sticky top-24"
                style={{
                  background: 'linear-gradient(180deg, #111, #0e0e0e)',
                  border: '1px solid #181818',
                  maxHeight: 'calc(100vh - 120px)',
                  overflowY: 'auto',
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#1a1a1a transparent',
                }}
              >
                <FilterPanel {...filterPanelProps} onClose={null} />
              </div>
            </aside>

            {/* Products */}
            <div className="flex-1 min-w-0">
              <ProductGrid
                products={filteredProducts.slice(0, visibleCount)}
                loading={loading}
                emptyMessage="No products found"
                emptyDesc="Try adjusting your filters or search terms."
              />

              {/* Load more */}
              {!loading && visibleCount < filteredProducts.length && (
                <div className="flex flex-col items-center gap-3 mt-10">
                  <div className="w-full max-w-xs h-0.5 rounded-full overflow-hidden" style={{ background: '#141414' }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${ACCENT}, #b8962e)` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(visibleCount / filteredProducts.length) * 100}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                  <p className="text-xs text-[#2d2d2d]">
                    Showing {Math.min(visibleCount, filteredProducts.length)} of {filteredProducts.length}
                  </p>
                  <button
                    onClick={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)}
                    className="px-8 py-3 rounded-xl font-semibold text-sm transition-all"
                    style={{ background: 'transparent', border: '1px solid rgba(212,175,55,0.35)', color: ACCENT }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(212,175,55,0.07)'
                      e.currentTarget.style.borderColor = ACCENT
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.borderColor = 'rgba(212,175,55,0.35)'
                    }}
                  >
                    Load More ({filteredProducts.length - visibleCount} remaining)
                  </button>
                </div>
              )}

              {!loading && filteredProducts.length > 0 && visibleCount >= filteredProducts.length && (
                <p className="text-center text-xs text-[#252525] py-10">
                  ✦ All {filteredProducts.length} products shown ✦
                </p>
              )}
            </div>
          </div>

          {/* SEO block */}
          <div
            className="mt-14 mb-4 rounded-2xl p-6"
            style={{ background: 'linear-gradient(135deg, #0e0e0e, #111)', border: '1px solid #181818' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <HiSparkles style={{ color: ACCENT }} size={14} />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#2d2d2d]">
                About Our Collection
              </span>
            </div>
            <p className="text-[#3a3a3a] text-sm leading-relaxed">
              Browse our complete collection of premium gold jewellery at MeerabLuxe Jewellers,
              Sarafa Bazaar Mingora Swat. From traditional kundan bridal sets and meena work necklaces
              to modern bangles, rings and earrings — we have something for every occasion and budget.
              Free delivery above Rs.3,000. Cash on Delivery available all over Pakistan.
            </p>
          </div>
        </div>
      </section>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 z-40 lg:hidden"
              style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(8px)' }}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 z-50 lg:hidden overflow-y-auto"
              style={{
                width: 'min(300px, 86vw)',
                background: 'linear-gradient(180deg, #111, #0e0e0e)',
                borderRight: '1px solid #181818',
                padding: '22px 18px',
              }}
            >
              <FilterPanel {...filterPanelProps} onClose={() => setMobileFiltersOpen(false)} />
              <div className="mt-6 pt-4" style={{ borderTop: '1px solid #1a1a1a' }}>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full py-3 rounded-xl font-semibold text-sm"
                  style={{
                    background: `linear-gradient(135deg, ${ACCENT}, #b8962e)`,
                    color: '#0a0a0a',
                    boxShadow: '0 4px 22px rgba(212,175,55,0.25)',
                  }}
                >
                  <HiSparkles className="inline mr-1.5" size={13} />
                  Show {filteredProducts.length} Product{filteredProducts.length !== 1 ? 's' : ''}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Shop