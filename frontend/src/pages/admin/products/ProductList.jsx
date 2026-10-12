import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiPlus, FiEdit2, FiTrash2,
  FiSearch, FiRefreshCw, FiPackage,
} from 'react-icons/fi'
import { productApi } from '../../../api/productApi.js'
import { formatPrice, formatDate, getOptimizedImageUrl } from '../../../utils/helpers.js'
import Loader from '../../../components/common/Loader.jsx'
import toast from 'react-hot-toast'

const ProductList = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 12

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [products, search, categoryFilter])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const res = await productApi.getAll()
      if (res.data.success) {
        setProducts(res.data.products || [])
      }
    } catch (error) {
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let result = [...products]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.subCategory?.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q)
      )
    }
    if (categoryFilter) {
      result = result.filter(p => p.category === categoryFilter)
    }
    setFiltered(result)
    setPage(1)
  }

  const handleDelete = async (product) => {
    const id = String(product._id || product.id)
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return

    try {
      setDeleting(id)
      const res = await productApi.remove(id)
      if (res.data.success) {
        setProducts(prev => prev.filter(p => String(p._id || p.id) !== id))
        toast.success('Product deleted')
      } else {
        toast.error(res.data.message || 'Failed to delete')
      }
    } catch (error) {
      toast.error('Delete failed')
    } finally {
      setDeleting(null)
    }
  }

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)
  const totalPages = Math.ceil(filtered.length / pageSize)

  return (
    <div className="space-y-5">
      {/* ✅ Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1
            className="font-playfair font-bold text-white"
            style={{ fontSize: 'clamp(20px, 3vw, 26px)' }}
          >
            Products
          </h1>
          <p className="text-[#6b7280] text-sm mt-0.5">
            {filtered.length} products total
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadProducts}
            className="p-2 rounded-lg text-[#a0a0a0] hover:text-white hover:bg-[#2d2d2d] transition-colors"
          >
            <FiRefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <Link
            to="/admin/products/add"
            className="btn-gold flex items-center gap-2 text-sm"
          >
            <FiPlus size={16} />
            Add Product
          </Link>
        </div>
      </div>

      {/* ✅ Filters */}
      <div
        className="card-dark rounded-xl p-4 flex flex-wrap gap-3 items-center"
      >
        <div className="relative flex-1 min-w-48">
          <FiSearch
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280]"
          />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="input-dark pl-9 text-sm py-2"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="input-dark text-sm py-2"
          style={{ minWidth: '140px' }}
        >
          <option value="">All Categories</option>
          <option value="Ladies">Ladies</option>
          <option value="Gents">Gents</option>
          <option value="Customize">Customize</option>
        </select>
        {(search || categoryFilter) && (
          <button
            onClick={() => { setSearch(''); setCategoryFilter('') }}
            className="text-xs text-red-400 hover:text-red-300 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* ✅ Products Grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="card-dark rounded-2xl p-16 text-center"
        >
          <FiPackage size={40} className="mx-auto mb-3" style={{ color: '#d4af37' }} />
          <p className="text-white font-medium mb-1">No products found</p>
          <p className="text-[#6b7280] text-sm mb-4">
            {search ? 'Try a different search term' : 'Add your first product to get started'}
          </p>
          <Link to="/admin/products/add" className="btn-gold text-sm">
            + Add Product
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginated.map((product, i) => {
              const id = String(product._id || product.id)
              const img = product.images?.[0]
              const isDeleting = deleting === id

              return (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="card-dark rounded-xl overflow-hidden group"
                >
                  {/* Image */}
                  <div
                    className="relative overflow-hidden"
                    style={{ aspectRatio: '1', background: '#2d2d2d' }}
                  >
                    {img ? (
                      <img
                        src={getOptimizedImageUrl(img, 300, 70)}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">
                        💍
                      </div>
                    )}

                    {/* Overlay */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
                      style={{ background: 'rgba(26,26,26,0.7)' }}
                    >
                      <Link
                        to={`/admin/products/edit/${id}`}
                        className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                        style={{ background: 'rgba(212,175,55,0.9)', color: '#1a1a1a' }}
                      >
                        <FiEdit2 size={15} />
                      </Link>
                      <button
                        onClick={() => handleDelete(product)}
                        disabled={isDeleting}
                        className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                        style={{ background: 'rgba(239,68,68,0.9)', color: 'white' }}
                      >
                        {isDeleting ? (
                          <div
                            className="w-4 h-4 rounded-full border-2 animate-spin"
                            style={{ borderColor: 'white', borderTopColor: 'transparent' }}
                          />
                        ) : (
                          <FiTrash2 size={15} />
                        )}
                      </button>
                    </div>

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {!product.inStock && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(239,68,68,0.8)', color: 'white' }}
                        >
                          Out of Stock
                        </span>
                      )}
                      {product.bestseller && (
                        <span className="badge-gold">Hot</span>
                      )}
                      {product.featured && (
                        <span className="badge-gold">Featured</span>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <p className="text-xs text-[#6b7280] mb-0.5">
                      {product.subCategory || product.category}
                    </p>
                    <h3
                      className="font-medium text-white text-sm mb-2 leading-tight"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span
                        className="font-bold"
                        style={{ color: '#d4af37', fontSize: '14px' }}
                      >
                        {formatPrice(product.price)}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <Link
                          to={`/admin/products/edit/${id}`}
                          className="p-1.5 rounded-lg text-[#a0a0a0] hover:text-[#d4af37] hover:bg-[#2d2d2d] transition-colors"
                        >
                          <FiEdit2 size={13} />
                        </Link>
                        <button
                          onClick={() => handleDelete(product)}
                          disabled={isDeleting}
                          className="p-1.5 rounded-lg text-[#a0a0a0] hover:text-red-400 hover:bg-red-400/10 transition-colors"
                        >
                          <FiTrash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg text-sm text-[#a0a0a0] hover:text-white disabled:opacity-30 transition-colors"
                style={{ background: '#2d2d2d', border: '1px solid #3d3d3d' }}
              >
                ‹ Prev
              </button>
              <span className="text-sm text-[#6b7280]">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg text-sm text-[#a0a0a0] hover:text-white disabled:opacity-30 transition-colors"
                style={{ background: '#2d2d2d', border: '1px solid #3d3d3d' }}
              >
                Next ›
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ProductList