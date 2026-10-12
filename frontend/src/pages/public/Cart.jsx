import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiShoppingCart, FiTrash2, FiPlus,
  FiMinus, FiArrowRight, FiTag,
} from 'react-icons/fi'
import SEO from '../../components/common/SEO.jsx'
import { getOptimizedImageUrl, formatPrice } from '../../utils/helpers.js'
import useCart from '../../hooks/useCart.js'
import useSettings from '../../hooks/useSettings.js'
import { productApi } from '../../api/productApi.js'
import { useCart as useCartContext } from '../../context/CartContext.jsx'

const Cart = () => {
  const navigate = useNavigate()
  const {
    cartItems,
    products,
    getCartItemsArray,
    getSubtotal,
    getDeliveryCharges,
    getTotal,
    isFreeDelivery,
    amountForFreeDelivery,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    clearCart,
    isEmpty,
    totalItems,
  } = useCart()
  const { settings } = useSettings()
  const { setProducts } = useCartContext()

  useEffect(() => {
    if (products.length === 0) {
      loadProducts()
    }
  }, [])

  const loadProducts = async () => {
    try {
      const res = await productApi.getAll()
      if (res.data.success) {
        setProducts(res.data.products || [])
      }
    } catch (error) {
      console.error('Cart products load error:', error)
    }
  }

  const cartItemsArray = getCartItemsArray()
  const subtotal = getSubtotal()
  const delivery = getDeliveryCharges()
  const total = getTotal()
  const freeDelivery = isFreeDelivery()
  const amountNeeded = amountForFreeDelivery()
  const freeAbove = Number(settings?.freeDeliveryAbove) || 3000

  return (
    <>
      <SEO
        title="Shopping Cart | MeerabLuxe Jewellers"
        description="Review your selected jewellery items before checkout."
        noIndex
      />

      <div className="container-custom py-6 md:py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1
              className="font-playfair font-bold text-white"
              style={{ fontSize: 'clamp(22px, 4vw, 32px)' }}
            >
              Shopping Cart
            </h1>
            <p className="text-[#a0a0a0] text-sm mt-0.5">
              {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          {!isEmpty && (
            <button
              onClick={clearCart}
              className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              <FiTrash2 size={15} />
              Clear All
            </button>
          )}
        </div>

        {/* Empty State */}
        {isEmpty ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div
              className="w-24 h-24 rounded-2xl flex items-center justify-center mb-5"
              style={{
                background: 'rgba(212,175,55,0.08)',
                border: '1px solid rgba(212,175,55,0.15)',
              }}
            >
              <FiShoppingCart size={40} style={{ color: '#d4af37' }} />
            </div>
            <h2 className="font-playfair text-2xl text-white mb-2">
              Your cart is empty
            </h2>
            <p className="text-[#6b7280] text-sm mb-6 max-w-xs">
              Looks like you haven't added any jewellery to your cart yet.
            </p>
            <Link to="/shop" className="btn-gold flex items-center gap-2">
              <FiShoppingCart size={16} />
              Start Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3">

              {/* Free Delivery Progress */}
              {!freeDelivery && amountNeeded > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl p-4"
                  style={{
                    background: 'rgba(212,175,55,0.06)',
                    border: '1px solid rgba(212,175,55,0.2)',
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <FiTag size={15} style={{ color: '#d4af37' }} />
                    <p className="text-sm text-[#e5e5e5]">
                      Add{' '}
                      <span className="text-[#d4af37] font-bold">
                        {formatPrice(amountNeeded)}
                      </span>{' '}
                      more for FREE delivery!
                    </p>
                  </div>
                  <div
                    className="h-1.5 rounded-full overflow-hidden"
                    style={{ background: '#3d3d3d' }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (subtotal / freeAbove) * 100)}%`,
                        background: 'linear-gradient(90deg, #d4af37, #f4e5c2)',
                      }}
                    />
                  </div>
                </motion.div>
              )}

              {freeDelivery && (
                <div
                  className="rounded-xl p-3 flex items-center gap-2"
                  style={{
                    background: 'rgba(16,185,129,0.08)',
                    border: '1px solid rgba(16,185,129,0.2)',
                  }}
                >
                  <span className="text-[#10b981] text-sm font-medium">
                    🎉 You qualify for FREE delivery!
                  </span>
                </div>
              )}

              {/* Items List */}
              <AnimatePresence>
                {cartItemsArray.map((item, index) => {
                  if (!item.product) return null
                  const p = item.product
                  const img = p.images?.[0] || ''

                  return (
                    <motion.div
                      key={`${item.productId}-${item.size}-${item.color}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="card-dark rounded-2xl p-4"
                    >
                      <div className="flex gap-4">
                        {/* Image */}
                        <Link
                          to={`/product/${item.productId}`}
                          className="flex-shrink-0"
                        >
                          <div
                            className="rounded-xl overflow-hidden img-zoom"
                            style={{
                              width: 'clamp(80px, 15vw, 110px)',
                              aspectRatio: '1',
                              background: '#2d2d2d',
                            }}
                          >
                            {img ? (
                              <img
                                src={getOptimizedImageUrl(img, 200, 80)}
                                alt={p.name}
                                loading="lazy"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-2xl">💍</span>
                              </div>
                            )}
                          </div>
                        </Link>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <Link to={`/product/${item.productId}`}>
                                <h3
                                  className="font-medium text-white hover:text-[#d4af37] transition-colors leading-tight"
                                  style={{
                                    fontSize: 'clamp(13px, 2.5vw, 15px)',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                  }}
                                >
                                  {p.name}
                                </h3>
                              </Link>

                              {/* Size/Color */}
                              <div className="flex flex-wrap gap-2 mt-1">
                                {item.size && (
                                  <span
                                    className="text-xs px-2 py-0.5 rounded"
                                    style={{
                                      background: '#2d2d2d',
                                      color: '#a0a0a0',
                                    }}
                                  >
                                    Size: {item.size}
                                  </span>
                                )}
                                {item.color && (
                                  <span
                                    className="text-xs px-2 py-0.5 rounded"
                                    style={{
                                      background: '#2d2d2d',
                                      color: '#a0a0a0',
                                    }}
                                  >
                                    Color: {item.color}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Remove */}
                            <button
                              onClick={() =>
                                removeFromCart(
                                  item.productId,
                                  item.size || 'defaultSize',
                                  item.color || 'defaultColor'
                                )
                              }
                              className="p-1.5 rounded-lg text-[#6b7280] hover:text-red-400 hover:bg-red-400/10 transition-colors flex-shrink-0"
                              aria-label="Remove item"
                            >
                              <FiTrash2 size={15} />
                            </button>
                          </div>

                          {/* Price + Quantity */}
                          <div className="flex items-center justify-between mt-3">
                            {/* Price */}
                            <span
                              className="font-bold"
                              style={{
                                color: '#d4af37',
                                fontSize: 'clamp(14px, 2.5vw, 16px)',
                              }}
                            >
                              {formatPrice(item.total)}
                            </span>

                            {/* Quantity Controls */}
                            <div
                              className="flex items-center gap-1 rounded-xl overflow-hidden"
                              style={{ border: '1px solid #3d3d3d' }}
                            >
                              <button
                                onClick={() =>
                                  decrementQuantity(
                                    item.productId,
                                    item.size || 'defaultSize',
                                    item.color || 'defaultColor'
                                  )
                                }
                                className="w-8 h-8 flex items-center justify-center text-[#a0a0a0] hover:text-white hover:bg-[#3d3d3d] transition-colors"
                              >
                                <FiMinus size={13} />
                              </button>
                              <span className="w-8 text-center text-sm font-medium text-white">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  incrementQuantity(
                                    item.productId,
                                    item.size || 'defaultSize',
                                    item.color || 'defaultColor'
                                  )
                                }
                                className="w-8 h-8 flex items-center justify-center text-[#a0a0a0] hover:text-white hover:bg-[#3d3d3d] transition-colors"
                              >
                                <FiPlus size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>

              {/* Continue Shopping */}
              <Link
                to="/shop"
                className="flex items-center gap-2 text-sm text-[#d4af37] hover:text-[#f4e5c2] transition-colors mt-2"
              >
                ← Continue Shopping
              </Link>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card-dark rounded-2xl p-5 sticky top-24">
                <h2 className="font-playfair font-bold text-white text-lg mb-5">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#a0a0a0]">
                      Subtotal ({totalItems} items)
                    </span>
                    <span className="text-white font-medium">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-[#a0a0a0]">Delivery</span>
                    <span
                      className="font-medium"
                      style={{ color: freeDelivery ? '#10b981' : '#e5e5e5' }}
                    >
                      {freeDelivery ? 'FREE' : formatPrice(delivery)}
                    </span>
                  </div>

                  {!freeDelivery && (
                    <p className="text-xs text-[#6b7280]">
                      Free delivery on orders above {formatPrice(freeAbove)}
                    </p>
                  )}

                  <div
                    className="border-t pt-3"
                    style={{ borderColor: '#3d3d3d' }}
                  >
                    <div className="flex justify-between">
                      <span className="font-semibold text-white">Total</span>
                      <span
                        className="font-bold text-xl"
                        style={{ color: '#d4af37' }}
                      >
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="btn-gold w-full flex items-center justify-center gap-2 py-3.5 text-base"
                >
                  Proceed to Checkout
                  <FiArrowRight size={18} />
                </button>

                {/* Payment Methods */}
                <div className="mt-4 pt-4 border-t" style={{ borderColor: '#3d3d3d' }}>
                  <p className="text-xs text-[#6b7280] text-center mb-2">
                    We Accept
                  </p>
                  <div className="flex justify-center gap-2 flex-wrap">
                    {['COD', 'Easypaisa', 'Bank Transfer'].map(m => (
                      <span
                        key={m}
                        className="text-xs px-2.5 py-1 rounded-lg"
                        style={{
                          background: '#2d2d2d',
                          color: '#a0a0a0',
                          border: '1px solid #3d3d3d',
                        }}
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Cart