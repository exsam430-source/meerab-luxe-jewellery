// src/components/public/product/ReviewSection.jsx
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiStar, FiCamera, FiSend, FiX } from 'react-icons/fi'
import { reviewApi } from '../../../api/reviewApi.js'
import { useAuth } from '../../../context/AuthContext.jsx'
import { formatDate, calculateAverageRating } from '../../../utils/helpers.js'
import Loader from '../../common/Loader.jsx'
import toast from 'react-hot-toast'

// ─── Star Input ───────────────────────────────────────────────
const StarInput = ({ value, onChange }) => (
  <div className="flex items-center gap-1">
    {Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => onChange(i + 1)}
        className="transition-transform hover:scale-110 focus:outline-none"
        aria-label={`Rate ${i + 1} star${i > 0 ? 's' : ''}`}
      >
        <FiStar
          size={24}
          style={{
            color: i < value ? '#d4af37' : '#3d3d3d',
            fill: i < value ? '#d4af37' : 'none',
            cursor: 'pointer',
          }}
        />
      </button>
    ))}
    <span className="ml-2 text-sm text-[#a0a0a0]">
      {value} star{value !== 1 ? 's' : ''}
    </span>
  </div>
)

// ─── Star Display ─────────────────────────────────────────────
const StarDisplay = ({ rating, size = 12 }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }, (_, i) => (
      <FiStar
        key={i}
        size={size}
        style={{
          color: i < Math.round(rating) ? '#d4af37' : '#3d3d3d',
          fill: i < Math.round(rating) ? '#d4af37' : 'none',
        }}
      />
    ))}
  </div>
)

// ─── Review Card ──────────────────────────────────────────────
const ReviewCard = ({ review }) => {
  const name = review.name || review.userId?.name || 'Anonymous'
  const initial = name[0].toUpperCase()
  const date = review.date || review.created_at

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-dark rounded-2xl p-5"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        {/* Avatar + Name + Stars */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #d4af37, #b8960c)',
              color: '#1a1a1a',
            }}
          >
            {initial}
          </div>
          <div>
            <p className="font-medium text-white text-sm">{name}</p>
            <StarDisplay rating={review.rating} />
          </div>
        </div>

        {/* Date + Verified */}
        <div className="text-right flex-shrink-0">
          {date && (
            <span className="text-xs text-[#6b7280]">
              {formatDate(date)}
            </span>
          )}
          <span
            className="block text-xs mt-1 px-2 py-0.5 rounded-full"
            style={{
              background: 'rgba(16,185,129,0.1)',
              color: '#10b981',
            }}
          >
            ✓ Verified
          </span>
        </div>
      </div>

      {/* Comment */}
      <p className="text-sm text-[#a0a0a0] leading-relaxed">
        {review.comment}
      </p>

      {/* Images */}
      {review.images?.length > 0 && (
        <div className="flex gap-2 mt-3 flex-wrap">
          {review.images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Review image ${i + 1}`}
              className="w-16 h-16 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
              style={{ border: '1px solid #3d3d3d' }}
              onError={(e) => { e.target.style.display = 'none' }}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}

// ─── Main Component ───────────────────────────────────────────
const ReviewSection = ({ productId }) => {
  const { user } = useAuth()

  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [images, setImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])

  const [form, setForm] = useState({
    rating: 5,
    comment: '',
    name: user?.name || '',
    email: user?.email || '',
  })

  // Load reviews on mount
  useEffect(() => {
    if (productId) loadReviews()
  }, [productId])

  // Cleanup image previews on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url))
    }
  }, [imagePreviews])

  const loadReviews = async () => {
    try {
      setLoading(true)
      const res = await reviewApi.getReviews(productId, { limit: 20 })
      if (res.data.success) {
        setReviews(res.data.reviews || [])
      }
    } catch (error) {
      console.error('Load reviews error:', error)
      // Don't show error toast - just show empty state
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []).slice(0, 3)

    // Revoke old previews
    imagePreviews.forEach(url => URL.revokeObjectURL(url))

    setImages(files)
    setImagePreviews(files.map(f => URL.createObjectURL(f)))

    // Reset input so same file can be selected again
    e.target.value = ''
  }

  const removeImage = (index) => {
    URL.revokeObjectURL(imagePreviews[index])
    setImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate
    if (!form.name.trim()) {
      toast.error('Please enter your name')
      return
    }
    if (!form.comment.trim()) {
      toast.error('Please write a review comment')
      return
    }
    if (form.comment.trim().length < 10) {
      toast.error('Review must be at least 10 characters')
      return
    }

    try {
      setSubmitting(true)

      // ✅ Build FormData correctly
      const formData = new FormData()
      formData.append('rating', String(form.rating))
      formData.append('comment', form.comment.trim())
      formData.append('name', form.name.trim())
      formData.append('email', form.email.trim())

      // Only append userId if logged in
      if (user?.id || user?._id) {
        formData.append('userId', String(user.id || user._id))
      }

      // Append images only if selected
      if (images.length > 0) {
        images.forEach((img) => {
          formData.append('images', img)
        })
      }

      // ✅ Debug log in development
      if (import.meta.env.DEV) {
       
        for (const [key, value] of formData.entries()) {
         
        }
      }

      const res = await reviewApi.addReview(productId, formData)

      if (res.data.success) {
        toast.success('Review submitted successfully! 🎉')
        setReviews(res.data.reviews || [])

        // Reset form
        setShowForm(false)
        setForm({
          rating: 5,
          comment: '',
          name: user?.name || '',
          email: user?.email || '',
        })

        // Cleanup images
        imagePreviews.forEach(url => URL.revokeObjectURL(url))
        setImages([])
        setImagePreviews([])

      } else {
        toast.error(res.data.message || 'Failed to submit review')
      }

    } catch (error) {
      console.error('Submit review error:', error)

      // ✅ Show specific error from backend if available
      const msg = error.response?.data?.message || 'Failed to submit review. Please try again.'
      toast.error(msg)

    } finally {
      setSubmitting(false)
    }
  }

  const avgRating = calculateAverageRating(reviews)

  return (
    <div className="py-8">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2
            className="font-playfair font-bold text-white mb-1"
            style={{ fontSize: 'clamp(18px, 3vw, 24px)' }}
          >
            Customer Reviews
          </h2>

          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <StarDisplay rating={avgRating} size={14} />
              <span className="text-[#d4af37] font-bold text-sm">{avgRating}</span>
              <span className="text-[#6b7280] text-sm">
                ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => setShowForm(prev => !prev)}
          className="btn-gold text-sm"
        >
          {showForm ? '✕ Cancel' : '✍️ Write Review'}
        </button>
      </div>

      {/* ── Review Form ── */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="card-dark rounded-2xl p-5 mb-6"
          style={{ border: '1px solid rgba(212,175,55,0.2)' }}
        >
          <h3 className="font-semibold text-white mb-4">Write Your Review</h3>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Rating */}
            <div>
              <label className="block text-sm text-[#a0a0a0] mb-2">
                Rating *
              </label>
              <StarInput
                value={form.rating}
                onChange={(val) => setForm(prev => ({ ...prev, rating: val }))}
              />
            </div>

            {/* Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-[#a0a0a0] mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                  className="input-dark"
                  placeholder="Your name"
                  maxLength={100}
                />
              </div>
              <div>
                <label className="block text-sm text-[#a0a0a0] mb-1">
                  Email <span className="text-[#6b7280]">(optional)</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                  className="input-dark"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm text-[#a0a0a0] mb-1">
                Review * <span className="text-[#6b7280] text-xs">(min 10 characters)</span>
              </label>
              <textarea
                value={form.comment}
                onChange={e => setForm(prev => ({ ...prev, comment: e.target.value }))}
                className="input-dark resize-none"
                rows={4}
                placeholder="Share your experience with this product..."
                maxLength={1000}
              />
              <p className="text-xs text-[#6b7280] mt-1 text-right">
                {form.comment.length}/1000
              </p>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm text-[#a0a0a0] mb-2">
                Photos <span className="text-[#6b7280]">(optional, max 3)</span>
              </label>

              {/* Upload button */}
              {images.length < 3 && (
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm cursor-pointer transition-all hover:border-[#d4af37]"
                  style={{
                    background: '#2d2d2d',
                    color: '#a0a0a0',
                    border: '1px solid #3d3d3d',
                  }}
                >
                  <FiCamera size={15} />
                  Add Photos ({images.length}/3)
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    multiple
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}

              {/* Previews */}
              {imagePreviews.length > 0 && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {imagePreviews.map((preview, i) => (
                    <div key={i} className="relative w-16 h-16">
                      <img
                        src={preview}
                        alt={`Preview ${i + 1}`}
                        className="w-16 h-16 rounded-lg object-cover"
                        style={{ border: '1px solid #3d3d3d' }}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ background: '#ef4444', color: '#fff' }}
                        aria-label="Remove image"
                      >
                        <FiX size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="btn-gold flex items-center gap-2 px-6"
            >
              {submitting ? (
                <>
                  <div
                    className="w-4 h-4 rounded-full border-2 animate-spin"
                    style={{ borderColor: '#1a1a1a', borderTopColor: 'transparent' }}
                  />
                  Submitting...
                </>
              ) : (
                <>
                  <FiSend size={15} />
                  Submit Review
                </>
              )}
            </button>

          </form>
        </motion.div>
      )}

      {/* ── Reviews List ── */}
      {loading ? (
        <Loader center />
      ) : reviews.length === 0 ? (
        <div
          className="text-center py-12 rounded-2xl"
          style={{ background: '#242424', border: '1px solid #3d3d3d' }}
        >
          <p className="text-3xl mb-2">⭐</p>
          <p className="text-white font-medium mb-1">No reviews yet</p>
          <p className="text-[#6b7280] text-sm">
            Be the first to review this product!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review._id || review.id}
              review={review}
            />
          ))}
        </div>
      )}

    </div>
  )
}

export default ReviewSection