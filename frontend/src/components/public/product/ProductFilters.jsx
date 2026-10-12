import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiFilter, FiX, FiChevronDown } from 'react-icons/fi'

const CATEGORIES = ['Ladies', 'Gents', 'Customize']
const SUBCATEGORIES = [
  'Necklaces', 'Earrings', 'Bangles', 'Bracelets',
  'Rings', 'Anklets', 'Bridal Sets', 'Kundan',
  'Maang Tikka', 'Nose Pins',
]
const SORT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'featured', label: 'Featured' },
]

const ProductFilters = ({
  filters,
  onFilterChange,
  onClearFilters,
  totalProducts = 0,
  filteredCount = 0,
}) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [expandedSection, setExpandedSection] = useState('category')

  const hasActiveFilters = filters.category || filters.subCategory ||
    filters.minPrice || filters.maxPrice || filters.search

  const FilterContent = () => (
    <div className="space-y-5">

      {/* ✅ Search */}
      <div>
        <label className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider block mb-2">
          Search
        </label>
        <input
          type="text"
          value={filters.search || ''}
          onChange={e => onFilterChange({ search: e.target.value })}
          placeholder="Search products..."
          className="input-dark w-full text-sm"
        />
      </div>

      {/* ✅ Category */}
      <div>
        <button
          onClick={() => setExpandedSection(expandedSection === 'category' ? '' : 'category')}
          className="w-full flex items-center justify-between text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2"
        >
          Category
          <FiChevronDown
            size={14}
            className="transition-transform duration-200"
            style={{ transform: expandedSection === 'category' ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </button>
        <AnimatePresence>
          {expandedSection === 'category' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  onClick={() => onFilterChange({ category: '', subCategory: '' })}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: !filters.category ? 'rgba(212,175,55,0.15)' : '#2d2d2d',
                    color: !filters.category ? '#d4af37' : '#a0a0a0',
                    border: `1px solid ${!filters.category ? 'rgba(212,175,55,0.3)' : '#3d3d3d'}`,
                  }}
                >
                  All
                </button>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => onFilterChange({ category: cat, subCategory: '' })}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background: filters.category === cat ? 'rgba(212,175,55,0.15)' : '#2d2d2d',
                      color: filters.category === cat ? '#d4af37' : '#a0a0a0',
                      border: `1px solid ${filters.category === cat ? 'rgba(212,175,55,0.3)' : '#3d3d3d'}`,
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ✅ SubCategory */}
      <div>
        <button
          onClick={() => setExpandedSection(expandedSection === 'sub' ? '' : 'sub')}
          className="w-full flex items-center justify-between text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2"
        >
          Type
          <FiChevronDown
            size={14}
            className="transition-transform duration-200"
            style={{ transform: expandedSection === 'sub' ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </button>
        <AnimatePresence>
          {expandedSection === 'sub' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 pt-1">
                {SUBCATEGORIES.map(sub => (
                  <button
                    key={sub}
                    onClick={() => onFilterChange({
                      subCategory: filters.subCategory === sub ? '' : sub
                    })}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background: filters.subCategory === sub ? 'rgba(212,175,55,0.15)' : '#2d2d2d',
                      color: filters.subCategory === sub ? '#d4af37' : '#a0a0a0',
                      border: `1px solid ${filters.subCategory === sub ? 'rgba(212,175,55,0.3)' : '#3d3d3d'}`,
                    }}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ✅ Price Range */}
      <div>
        <button
          onClick={() => setExpandedSection(expandedSection === 'price' ? '' : 'price')}
          className="w-full flex items-center justify-between text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2"
        >
          Price Range
          <FiChevronDown
            size={14}
            className="transition-transform duration-200"
            style={{ transform: expandedSection === 'price' ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </button>
        <AnimatePresence>
          {expandedSection === 'price' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex gap-2 pt-1">
                <input
                  type="number"
                  value={filters.minPrice || ''}
                  onChange={e => onFilterChange({ minPrice: e.target.value })}
                  placeholder="Min Rs."
                  className="input-dark flex-1 text-sm"
                  min="0"
                />
                <input
                  type="number"
                  value={filters.maxPrice || ''}
                  onChange={e => onFilterChange({ maxPrice: e.target.value })}
                  placeholder="Max Rs."
                  className="input-dark flex-1 text-sm"
                  min="0"
                />
              </div>
              {/* Quick price filters */}
              <div className="flex flex-wrap gap-2 mt-2">
                {[
                  { label: 'Under 1K', min: '', max: '1000' },
                  { label: '1K-3K', min: '1000', max: '3000' },
                  { label: '3K-5K', min: '3000', max: '5000' },
                  { label: '5K+', min: '5000', max: '' },
                ].map(range => (
                  <button
                    key={range.label}
                    onClick={() => onFilterChange({ minPrice: range.min, maxPrice: range.max })}
                    className="px-2.5 py-1 rounded-lg text-xs transition-all"
                    style={{
                      background: '#2d2d2d',
                      color: '#a0a0a0',
                      border: '1px solid #3d3d3d',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)'
                      e.currentTarget.style.color = '#d4af37'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#3d3d3d'
                      e.currentTarget.style.color = '#a0a0a0'
                    }}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ✅ Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm text-red-400 transition-colors hover:bg-red-400/10"
          style={{ border: '1px solid rgba(239,68,68,0.2)' }}
        >
          <FiX size={14} />
          Clear All Filters
        </button>
      )}
    </div>
  )

  return (
    <>
      {/* ✅ Desktop Sidebar Filters */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <div
          className="card-dark rounded-2xl p-5 sticky top-24"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <FiFilter size={16} style={{ color: '#d4af37' }} />
              Filters
            </h3>
            <span className="text-xs text-[#6b7280]">
              {filteredCount} of {totalProducts}
            </span>
          </div>
          <FilterContent />
        </div>
      </div>

      {/* ✅ Mobile Filter Button */}
      <div className="lg:hidden">
        <button
          onClick={() => setShowMobileFilters(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
          style={{
            background: hasActiveFilters ? 'rgba(212,175,55,0.15)' : '#2d2d2d',
            color: hasActiveFilters ? '#d4af37' : '#a0a0a0',
            border: `1px solid ${hasActiveFilters ? 'rgba(212,175,55,0.3)' : '#3d3d3d'}`,
          }}
        >
          <FiFilter size={15} />
          Filters
          {hasActiveFilters && (
            <span
              className="w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold"
              style={{ background: '#d4af37', color: '#1a1a1a' }}
            >
              !
            </span>
          )}
        </button>
      </div>

      {/* ✅ Mobile Filter Drawer */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-50 lg:hidden"
              onClick={() => setShowMobileFilters(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed top-0 left-0 bottom-0 w-80 max-w-[90vw] z-50 overflow-y-auto lg:hidden"
              style={{ background: '#1a1a1a', borderRight: '1px solid #3d3d3d' }}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b sticky top-0 bg-[#1a1a1a]"
                style={{ borderColor: '#3d3d3d' }}
              >
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <FiFilter size={16} style={{ color: '#d4af37' }} />
                  Filters
                </h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 rounded-lg text-[#a0a0a0] hover:text-white"
                >
                  <FiX size={18} />
                </button>
              </div>
              <div className="p-5">
                <FilterContent />
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="btn-gold w-full mt-5"
                >
                  Apply Filters ({filteredCount} results)
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default ProductFilters