import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiShoppingCart,
  FiHeart,
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import {
  getOptimizedImageUrl,
  getDiscountPercent,
  formatPrice,
} from '../../../utils/helpers.js'
import { createProductWhatsAppLink } from '../../../utils/whatsappLink.js'
import useCart from '../../../hooks/useCart.js'
import useSettings from '../../../hooks/useSettings.js'
import toast from 'react-hot-toast'

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

const ProductCard = ({ product, compact = false }) => {
  const { addToCart, isInCart } = useCart()
  const { settings } = useSettings()
  const navigate = useNavigate()

  const [wishlist, setWishlist] = useState(false)
  const [imgError, setImgError] = useState(false)
  const [adding, setAdding] = useState(false)

  if (!product) return null

  const productId = String(product._id || product.id)
  const image = product.images?.[0] || ''
  const optimizedImg = getOptimizedImageUrl(image, compact ? 300 : 400, 80)
  const discount = getDiscountPercent(product.price, product.comparePrice)
  const inCart = isInCart(productId)
  const whatsappLink = createProductWhatsAppLink(
    product,
    settings?.whatsappNumber
  )

  // ✅ Add to cart — stops propagation so card link doesn't fire
  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (adding) return
    setAdding(true)
    await addToCart(productId)
    setAdding(false)
  }

  // ✅ Wishlist — stops propagation
  const handleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setWishlist(prev => !prev)
    toast.success(wishlist ? 'Removed from wishlist' : 'Added to wishlist! ❤️')
  }

  // ✅ WhatsApp — navigate in new tab via JS, NOT <a> inside <Link>
  const handleWhatsApp = (e) => {
    e.preventDefault()
    e.stopPropagation()
    window.open(whatsappLink, '_blank', 'noopener,noreferrer')
  }

  return (
    <motion.div variants={itemVariants} className="group relative">

      {/* ✅ Outer Link — entire card */}
      <Link
        to={`/product/${productId}`}
        className="block card-dark rounded-xl overflow-hidden transition-all duration-300"
        style={{ textDecoration: 'none' }}
      >
        {/* ✅ Image Container */}
        <div
          className="relative overflow-hidden"
          style={{ aspectRatio: '1' }}
        >
          {/* Image */}
          {image && !imgError ? (
            <img
              src={optimizedImg}
              alt={product.name}
              loading="lazy"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: '#2d2d2d' }}
            >
              <span style={{ fontSize: '40px' }}>💍</span>
            </div>
          )}

          {/* ✅ Dark overlay on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: 'rgba(26,26,26,0.4)' }}
          />

          {/* ✅ Badges — top left */}
          <div
            className="absolute top-2 left-2 flex flex-col gap-1"
          >
            {discount > 0 && (
              <span className="badge-sale">-{discount}%</span>
            )}
            {product.newArrival && (
              <span className="badge-new">New</span>
            )}
            {product.bestseller && (
              <span className="badge-gold">Hot</span>
            )}
            {!product.inStock && (
              <span
                style={{
                  fontSize: '11px',
                  padding: '2px 8px',
                  borderRadius: '20px',
                  fontWeight: 600,
                  background: 'rgba(107,114,128,0.8)',
                  color: '#e5e5e5',
                }}
              >
                Sold Out
              </span>
            )}
          </div>

          {/* ✅ Wishlist — top right */}
          <button
            onClick={handleWishlist}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: wishlist
                ? 'rgba(239,68,68,0.9)'
                : 'rgba(26,26,26,0.75)',
              color: wishlist ? 'white' : '#a0a0a0',
              border: 'none',
              cursor: 'pointer',
              backdropFilter: 'blur(4px)',
            }}
            aria-label="Add to wishlist"
          >
            <FiHeart
              size={14}
              style={{ fill: wishlist ? 'white' : 'none' }}
            />
          </button>

          {/* ✅ Bottom action buttons — NO <a> tags here */}
          {!compact && (
            <div
              className="absolute bottom-0 left-0 right-0 p-2 flex gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
            >
              {/* Add to Cart button */}
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock || adding}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '8px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: product.inStock ? 'pointer' : 'not-allowed',
                  backdropFilter: 'blur(4px)',
                  background: inCart
                    ? 'rgba(16,185,129,0.9)'
                    : product.inStock
                      ? 'rgba(212,175,55,0.9)'
                      : 'rgba(107,114,128,0.7)',
                  color: inCart ? 'white' : '#1a1a1a',
                  transition: 'all 0.2s',
                }}
              >
                {adding ? (
                  <div
                    style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      border: '2px solid #1a1a1a',
                      borderTopColor: 'transparent',
                      animation: 'spin 0.8s linear infinite',
                    }}
                  />
                ) : (
                  <>
                    <FiShoppingCart size={13} />
                    {inCart
                      ? 'Added'
                      : product.inStock
                        ? 'Add to Cart'
                        : 'Sold Out'}
                  </>
                )}
              </button>

              {/* ✅ WhatsApp — button NOT <a> to avoid nested <a> */}
              <button
                onClick={handleWhatsApp}
                style={{
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  background: 'rgba(37,211,102,0.9)',
                  backdropFilter: 'blur(4px)',
                  flexShrink: 0,
                }}
                aria-label="Order on WhatsApp"
              >
                <FaWhatsapp size={16} color="white" />
              </button>
            </div>
          )}
        </div>

        {/* ✅ Product Info */}
        <div style={{ padding: compact ? '10px' : '14px' }}>

          {/* Sub category */}
          {!compact && (
            <p
              style={{
                fontSize: '10px',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '4px',
              }}
            >
              {product.subCategory || product.category}
            </p>
          )}

          {/* Product name */}
          <h3
            style={{
              fontSize: compact ? '12px' : '13px',
              fontWeight: 500,
              color: '#ffffff',
              marginBottom: '8px',
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {product.name}
          </h3>

          {/* Price Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexWrap: 'wrap',
              }}
            >
              <span
                style={{
                  fontWeight: 700,
                  color: '#d4af37',
                  fontSize: compact ? '13px' : '15px',
                }}
              >
                {formatPrice(product.price)}
              </span>
              {discount > 0 && (
                <span
                  style={{
                    fontSize: '11px',
                    textDecoration: 'line-through',
                    color: '#6b7280',
                  }}
                >
                  {formatPrice(product.comparePrice)}
                </span>
              )}
            </div>

            {/* Compact mode cart button */}
            {compact && product.inStock && (
              <button
                onClick={handleAddToCart}
                disabled={adding}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  cursor: 'pointer',
                  flexShrink: 0,
                  background: inCart
                    ? 'rgba(16,185,129,0.15)'
                    : 'rgba(212,175,55,0.15)',
                  color: inCart ? '#10b981' : '#d4af37',
                  transition: 'all 0.2s',
                }}
              >
                <FiShoppingCart size={13} />
              </button>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default ProductCard