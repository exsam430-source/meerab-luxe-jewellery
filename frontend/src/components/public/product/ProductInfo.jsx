import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  FiShoppingCart, FiCheck, FiShare2,
  FiTruck, FiShield, FiPackage, FiHeart,
} from 'react-icons/fi'
import { FaWhatsapp, FaFacebook } from 'react-icons/fa'
import WhatsAppOrderBtn from './WhatsAppOrderBtn.jsx'
import { formatPrice, getDiscountPercent } from '../../../utils/helpers.js'
import { createProductWhatsAppLink } from '../../../utils/whatsappLink.js'
import useCart from '../../../hooks/useCart.js'
import useSettings from '../../../hooks/useSettings.js'
import { SITE_URL } from '../../../utils/constants.js'
import toast from 'react-hot-toast'

const ProductInfo = ({ product }) => {
  const { addToCart, isInCart } = useCart()
  const { settings } = useSettings()

  const [selectedSize, setSelectedSize] = useState(
    product?.sizes?.length > 0 ? product.sizes[0] : ''
  )
  const [selectedColor, setSelectedColor] = useState(
    product?.colors?.length > 0 ? product.colors[0] : ''
  )
  const [adding, setAdding] = useState(false)
  const [wishlist, setWishlist] = useState(false)

  if (!product) return null

  const productId = String(product._id || product.id)
  const discount = getDiscountPercent(product.price, product.comparePrice)
  const inCart = isInCart(
    productId,
    selectedSize || 'defaultSize',
    selectedColor || 'defaultColor'
  )

  const whatsappLink = createProductWhatsAppLink(
    product,
    settings?.whatsappNumber
  )
  const shareUrl = `${SITE_URL}/product/${productId}`
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`

  const handleAddToCart = async () => {
    if (!product.inStock) return
    if (product.sizes?.length > 0 && !selectedSize) {
      toast.error('Please select a size')
      return
    }
    setAdding(true)
    await addToCart(
      productId,
      selectedSize || 'defaultSize',
      selectedColor || 'defaultColor'
    )
    setAdding(false)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: shareUrl,
        })
      } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(shareUrl)
      toast.success('Link copied!')
    }
  }

  const handleWishlist = () => {
    setWishlist(prev => !prev)
    toast.success(wishlist ? 'Removed from wishlist' : 'Added to wishlist! ❤️')
  }

  return (
    <div className="flex flex-col gap-5">

      {/* ✅ Badges */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="badge-gold text-xs">
          {product.subCategory || product.category}
        </span>
        {product.bestseller && (
          <span className="badge-gold">🔥 Bestseller</span>
        )}
        {product.newArrival && (
          <span className="badge-new">✨ New Arrival</span>
        )}
        {product.featured && (
          <span className="badge-gold">⭐ Featured</span>
        )}
        {!product.inStock && (
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{
              background: 'rgba(239,68,68,0.1)',
              color: '#ef4444',
              border: '1px solid rgba(239,68,68,0.2)',
            }}
          >
            Out of Stock
          </span>
        )}
      </div>

      {/* ✅ Product Name */}
      <h1
        className="font-playfair font-bold text-white leading-tight"
        style={{ fontSize: 'clamp(22px, 4vw, 34px)' }}
      >
        {product.name}
      </h1>

      {/* ✅ Price */}
      <div className="flex items-center gap-3 flex-wrap">
        <span
          className="font-bold"
          style={{
            fontSize: 'clamp(22px, 4vw, 30px)',
            color: '#d4af37',
          }}
        >
          {formatPrice(product.price)}
        </span>
        {discount > 0 && (
          <>
            <span
              className="text-lg line-through"
              style={{ color: '#6b7280' }}
            >
              {formatPrice(product.comparePrice)}
            </span>
            <span className="badge-sale text-sm">
              Save {discount}%
            </span>
          </>
        )}
      </div>

      {/* ✅ Short Description */}
      {product.description && (
        <p className="text-[#a0a0a0] text-sm leading-relaxed">
          {product.description}
        </p>
      )}

      {/* ✅ Sizes */}
      {product.sizes?.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-[#a0a0a0] mb-2">
            Size:{' '}
            <span className="text-white font-semibold">{selectedSize}</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map(size => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={{
                  background: selectedSize === size
                    ? 'rgba(212,175,55,0.15)'
                    : '#2d2d2d',
                  color: selectedSize === size ? '#d4af37' : '#a0a0a0',
                  border: `1px solid ${selectedSize === size
                    ? 'rgba(212,175,55,0.4)'
                    : '#3d3d3d'}`,
                }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ✅ Colors */}
      {product.colors?.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-[#a0a0a0] mb-2">
            Color:{' '}
            <span className="text-white font-semibold">{selectedColor}</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {product.colors.map(color => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={{
                  background: selectedColor === color
                    ? 'rgba(212,175,55,0.15)'
                    : '#2d2d2d',
                  color: selectedColor === color ? '#d4af37' : '#a0a0a0',
                  border: `1px solid ${selectedColor === color
                    ? 'rgba(212,175,55,0.4)'
                    : '#3d3d3d'}`,
                }}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ✅ Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock || adding}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-sm transition-all duration-200"
          style={{
            background: inCart
              ? 'rgba(16,185,129,0.15)'
              : product.inStock
                ? 'linear-gradient(135deg, #d4af37, #b8960c)'
                : '#2d2d2d',
            color: inCart
              ? '#10b981'
              : product.inStock
                ? '#1a1a1a'
                : '#6b7280',
            cursor: product.inStock ? 'pointer' : 'not-allowed',
            border: inCart
              ? '1px solid rgba(16,185,129,0.3)'
              : 'none',
            boxShadow: product.inStock && !inCart
              ? '0 4px 20px rgba(212,175,55,0.3)'
              : 'none',
          }}
        >
          {adding ? (
            <div
              className="w-5 h-5 rounded-full border-2 animate-spin"
              style={{
                borderColor: '#1a1a1a',
                borderTopColor: 'transparent',
              }}
            />
          ) : inCart ? (
            <>
              <FiCheck size={18} />
              Added to Cart
            </>
          ) : (
            <>
              <FiShoppingCart size={18} />
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </>
          )}
        </button>

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200"
          style={{
            background: wishlist
              ? 'rgba(239,68,68,0.15)'
              : '#2d2d2d',
            color: wishlist ? '#ef4444' : '#a0a0a0',
            border: `1px solid ${wishlist
              ? 'rgba(239,68,68,0.3)'
              : '#3d3d3d'}`,
          }}
          aria-label="Add to wishlist"
        >
          <FiHeart
            size={18}
            style={{ fill: wishlist ? '#ef4444' : 'none' }}
          />
        </button>
      </div>

      {/* ✅ WhatsApp Button */}
      <WhatsAppOrderBtn product={product} fullWidth size="md" />

      {/* ✅ Share */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-[#6b7280]">Share:</span>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
          style={{
            background: 'rgba(37,211,102,0.1)',
            color: '#25d366',
          }}
          onMouseEnter={e =>
            e.currentTarget.style.background = 'rgba(37,211,102,0.25)'
          }
          onMouseLeave={e =>
            e.currentTarget.style.background = 'rgba(37,211,102,0.1)'
          }
          aria-label="Share on WhatsApp"
        >
          <FaWhatsapp size={16} />
        </a>
        <a
          href={facebookShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
          style={{
            background: 'rgba(59,130,246,0.1)',
            color: '#3b82f6',
          }}
          onMouseEnter={e =>
            e.currentTarget.style.background = 'rgba(59,130,246,0.25)'
          }
          onMouseLeave={e =>
            e.currentTarget.style.background = 'rgba(59,130,246,0.1)'
          }
          aria-label="Share on Facebook"
        >
          <FaFacebook size={16} />
        </a>
        <button
          onClick={handleShare}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
          style={{ background: '#2d2d2d', color: '#a0a0a0' }}
          onMouseEnter={e => e.currentTarget.style.color = '#e5e5e5'}
          onMouseLeave={e => e.currentTarget.style.color = '#a0a0a0'}
          aria-label="Copy link"
        >
          <FiShare2 size={15} />
        </button>
      </div>

      {/* ✅ Product Meta */}
      <div
        className="rounded-xl p-4 space-y-2.5"
        style={{
          background: '#242424',
          border: '1px solid #3d3d3d',
        }}
      >
        {[
          { label: 'Category', value: product.category },
          { label: 'Type', value: product.subCategory },
          { label: 'Material', value: product.material },
          product.weight ? { label: 'Weight', value: product.weight } : null,
          product.stoneType ? { label: 'Stone Type', value: product.stoneType } : null,
          product.stoneColor ? { label: 'Stone Color', value: product.stoneColor } : null,
          product.sku ? { label: 'SKU', value: product.sku } : null,
          {
            label: 'Availability',
            value: product.inStock ? '✅ In Stock' : '❌ Out of Stock',
          },
        ]
          .filter(Boolean)
          .map(item => (
            <div
              key={item.label}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-[#6b7280]">{item.label}:</span>
              <span className="text-[#e5e5e5] font-medium text-right">
                {item.value}
              </span>
            </div>
          ))}
      </div>

      {/* ✅ Delivery Trust Badges */}
      <div className="grid grid-cols-3 gap-2">
        {[
          {
            icon: FiTruck,
            text: 'Free delivery above Rs.3000',
            color: '#d4af37',
            bg: 'rgba(212,175,55,0.08)',
          },
          {
            icon: FiPackage,
            text: 'Ships in 1-2 business days',
            color: '#3b82f6',
            bg: 'rgba(59,130,246,0.08)',
          },
          {
            icon: FiShield,
            text: '7-day return policy',
            color: '#10b981',
            bg: 'rgba(16,185,129,0.08)',
          },
        ].map((item, i) => {
          const Icon = item.icon
          return (
            <div
              key={i}
              className="flex flex-col items-center text-center gap-1.5 p-3 rounded-xl"
              style={{
                background: item.bg,
                border: `1px solid ${item.color}20`,
              }}
            >
              <Icon size={16} style={{ color: item.color }} />
              <p
                className="leading-tight"
                style={{ fontSize: '10px', color: '#6b7280' }}
              >
                {item.text}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ProductInfo