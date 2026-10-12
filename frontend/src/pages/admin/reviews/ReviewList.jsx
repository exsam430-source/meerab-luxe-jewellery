import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiRefreshCw, FiTrash2, FiSearch, FiStar } from 'react-icons/fi'
import { productApi } from '../../../api/productApi.js'
import { reviewApi } from '../../../api/reviewApi.js'
import { formatDate } from '../../../utils/helpers.js'
import Loader from '../../../components/common/Loader.jsx'
import toast from 'react-hot-toast'

const ReviewList = () => {
  const [reviews, setReviews] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [ratingFilter, setRatingFilter] = useState(0)
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    loadReviews()
  }, [])

  useEffect(() => {
    let result = [...reviews]
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(r =>
        (r.name || '').toLowerCase().includes(q) ||
        (r.comment || '').toLowerCase().includes(q) ||
        (r.productName || '').toLowerCase().includes(q)
      )
    }
    if (ratingFilter > 0) {
      result = result.filter(r => r.rating === ratingFilter)
    }
    setFiltered(result)
  }, [reviews, search, ratingFilter])

  const loadReviews = async () => {
    try {
      setLoading(true)
      const productsRes = await productApi.getAll()
      if (!productsRes.data.success) return

      const products = productsRes.data.products || []
      const allReviews = []

      // Load reviews for all products (in batches)
      const batchSize = 5
      for (let i = 0; i < Math.min(products.length, 50); i += batchSize) {
        const batch = products.slice(i, i + batchSize)
        const promises = batch.map(p =>
          reviewApi.getReviews(String(p._id || p.id), { limit: 50 })
            .then(res => {
              if (res.data.success) {
                return (res.data.reviews || []).map(r => ({
                  ...r,
                  productId: String(p._id || p.id),
                  productName: p.name,
                }))
              }
              return []
            })
            .catch(() => [])
        )
        const batchResults = await Promise.all(promises)
        batchResults.forEach(r => allReviews.push(...r))
      }

      // Sort by date
      allReviews.sort((a, b) =>
        new Date(b.date || b.created_at) - new Date(a.date || a.created_at)
      )
      setReviews(allReviews)
    } catch (error) {
      toast.error('Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (review) => {
    const productId = review.productId
    const reviewId = String(review._id || review.id)
    if (!window.confirm('Delete this review?')) return

    try {
      setDeleting(reviewId)
      const res = await reviewApi.deleteReview(productId, reviewId)
      if (res.data.success) {
        setReviews(prev =>
          prev.filter(r => String(r._id || r.id) !== reviewId)
        )
        toast.success('Review deleted')
      }
    } catch (error) {
      toast.error('Delete failed')
    } finally {
      setDeleting(null)
    }
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : 0

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="font-playfair font-bold text-white"
            style={{ fontSize: 'clamp(20px, 3vw, 26px)' }}
          >
            Reviews
          </h1>
          <p className="text-[#6b7280] text-sm mt-0.5">
            {reviews.length} reviews · Avg rating: ⭐ {avgRating}
          </p>
        </div>
        <button
          onClick={loadReviews}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
          style={{
            background: '#2d2d2d',
            color: '#a0a0a0',
            border: '1px solid #3d3d3d',
          }}
        >
          <FiRefreshCw
            size={15}
            className={loading ? 'animate-spin' : ''}
          />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="card-dark rounded-xl p-4 space-y-3">
        <div className="relative">
          <FiSearch
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280]"
          />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search reviews..."
            className="input-dark pl-9 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#6b7280]">Rating:</span>
          {[0, 5, 4, 3, 2, 1].map(r => (
            <button
              key={r}
              onClick={() => setRatingFilter(r)}
              className="px-3 py-1 rounded-lg text-xs transition-all"
              style={{
                background: ratingFilter === r
                  ? 'rgba(212,175,55,0.15)'
                  : '#2d2d2d',
                color: ratingFilter === r ? '#d4af37' : '#6b7280',
                border: `1px solid ${ratingFilter === r
                  ? 'rgba(212,175,55,0.3)'
                  : '#3d3d3d'}`,
              }}
            >
              {r === 0 ? 'All' : `${r}★`}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card-dark rounded-2xl p-12 text-center">
          <p className="text-[#6b7280] text-sm">No reviews found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(review => {
            const id = String(review._id || review.id)
            const isDeleting = deleting === id

            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-dark rounded-2xl p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* Avatar */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                      style={{
                        background: 'linear-gradient(135deg, #d4af37, #b8960c)',
                        color: '#1a1a1a',
                      }}
                    >
                      {(review.name || 'A')[0].toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-white text-sm">
                          {review.name || 'Anonymous'}
                        </p>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }, (_, i) => (
                            <FiStar
                              key={i}
                              size={12}
                              style={{
                                color: i < review.rating ? '#d4af37' : '#3d3d3d',
                                fill: i < review.rating ? '#d4af37' : 'none',
                              }}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-[#6b7280]">
                          {formatDate(review.date || review.created_at)}
                        </span>
                      </div>

                      {review.productName && (
                        <p className="text-xs text-[#d4af37] mt-0.5">
                          Product: {review.productName}
                        </p>
                      )}

                      <p className="text-sm text-[#a0a0a0] mt-2 leading-relaxed">
                        {review.comment}
                      </p>

                      {review.images?.length > 0 && (
                        <div className="flex gap-2 mt-2">
                          {review.images.map((img, i) => (
                            <img
                              key={i}
                              src={img}
                              alt={`Review image ${i + 1}`}
                              className="w-14 h-14 rounded-lg object-cover"
                              style={{ border: '1px solid #3d3d3d' }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(review)}
                    disabled={isDeleting}
                    className="p-2 rounded-lg text-[#a0a0a0] hover:text-red-400 hover:bg-red-400/10 transition-colors flex-shrink-0"
                  >
                    {isDeleting ? (
                      <div
                        className="w-4 h-4 rounded-full border-2 animate-spin"
                        style={{
                          borderColor: '#ef4444',
                          borderTopColor: 'transparent',
                        }}
                      />
                    ) : (
                      <FiTrash2 size={15} />
                    )}
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ReviewList