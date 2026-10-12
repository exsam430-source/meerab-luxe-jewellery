// src/pages/public/OrderSuccess.jsx
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCheck, FiPackage, FiShoppingBag } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import SEO from '../../components/common/SEO.jsx'
import { orderApi } from '../../api/orderApi.js'
import { formatPrice } from '../../utils/helpers.js'
import { createTrackOrderWhatsAppLink } from '../../utils/whatsappLink.js'
import useSettings from '../../hooks/useSettings.js'
import { useCart as useCartContext } from '../../context/CartContext.jsx'

const OrderSuccess = () => {
  const { orderId } = useParams()
  const { settings } = useSettings()
  const { clearCart } = useCartContext()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    clearCart()
  }, [])

  useEffect(() => {
    if (orderId) loadOrder()
  }, [orderId])

  const loadOrder = async () => {
    try {
      const res = await orderApi.getById(orderId)
      if (res.data.success) {
        setOrder(res.data.order)
      }
    } catch (error) {
      console.error('Load order error:', error)
    } finally {
      setLoading(false)
    }
  }

  const whatsappLink = createTrackOrderWhatsAppLink(
    orderId,
    settings?.whatsappNumber
  )

  const orderIdShort = orderId
    ? String(orderId).slice(-8).toUpperCase()
    : 'N/A'

  return (
    <>
      <SEO
        title="Order Confirmed! | MeerabLuxe Jewellers"
        description="Your jewellery order has been placed successfully."
        noIndex
      />

      <div className="container-custom py-10 md:py-16">
        <div className="max-w-2xl mx-auto">

          {/* Success Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="flex flex-col items-center text-center mb-8"
          >
            {/* Check Icon */}
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mb-5"
              style={{
                background: 'rgba(16,185,129,0.15)',
                border: '2px solid rgba(16,185,129,0.3)',
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
              >
                <FiCheck size={44} style={{ color: '#10b981' }} />
              </motion.div>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-playfair font-bold text-white mb-2"
              style={{ fontSize: 'clamp(24px, 4vw, 36px)' }}
            >
              Order Confirmed! 🎉
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-[#a0a0a0] text-sm md:text-base max-w-md"
            >
              Thank you for your order! We'll process it shortly and
              keep you updated via WhatsApp.
            </motion.p>

            {/* Order ID Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-4 px-5 py-2.5 rounded-xl"
              style={{
                background: 'rgba(212,175,55,0.08)',
                border: '1px solid rgba(212,175,55,0.2)',
              }}
            >
              <p className="text-xs text-[#6b7280]">Order ID</p>
              <p className="font-bold text-[#d4af37] text-lg tracking-wider">
                #{orderIdShort}
              </p>
            </motion.div>
          </motion.div>

          {/* Order Details Card */}
          {!loading && order && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="card-dark rounded-2xl p-5 mb-5"
            >
              <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                <FiPackage size={18} style={{ color: '#d4af37' }} />
                Order Details
              </h2>

              {/* Items */}
              <div className="space-y-2 mb-4">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-[#a0a0a0]">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="text-white">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div
                className="border-t pt-3 space-y-2"
                style={{ borderColor: '#3d3d3d' }}
              >
                <div className="flex justify-between text-sm">
                  <span className="text-[#a0a0a0]">Payment Method</span>
                  <span className="text-white">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#a0a0a0]">Status</span>
                  <span
                    className="font-medium"
                    style={{ color: '#10b981' }}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="flex justify-between font-bold pt-1">
                  <span className="text-white">Total</span>
                  <span style={{ color: '#d4af37', fontSize: '18px' }}>
                    {formatPrice(order.amount)}
                  </span>
                </div>
              </div>

              {/* Delivery Address */}
              {order.address && (
                <div
                  className="mt-4 pt-3 border-t"
                  style={{ borderColor: '#3d3d3d' }}
                >
                  <p className="text-xs text-[#6b7280] mb-1">
                    Delivery Address
                  </p>
                  <p className="text-sm text-[#e5e5e5]">
                    {order.address.firstName} {order.address.lastName}
                    {order.address.phone && ` · ${order.address.phone}`}
                  </p>
                  <p className="text-sm text-[#a0a0a0]">
                    {order.address.street}, {order.address.city}
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Loading skeleton */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card-dark rounded-2xl p-5 mb-5 space-y-3"
            >
              <div className="skeleton h-4 w-32 rounded" />
              <div className="skeleton h-4 w-full rounded" />
              <div className="skeleton h-4 w-3/4 rounded" />
              <div className="skeleton h-4 w-1/2 rounded" />
            </motion.div>
          )}

          {/* What's Next */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="card-dark rounded-2xl p-5 mb-6"
          >
            <h3 className="font-semibold text-white mb-4">
              What happens next?
            </h3>
            <div className="space-y-3">
              {[
                {
                  step: '1',
                  title: 'Order Processing',
                  desc: "We'll review your order and prepare it for dispatch.",
                  color: '#d4af37',
                },
                {
                  step: '2',
                  title: 'WhatsApp Confirmation',
                  desc: "You'll receive order confirmation and tracking on WhatsApp.",
                  color: '#25d366',
                },
                {
                  step: '3',
                  title: 'Delivery',
                  desc: 'Your jewellery will be delivered within 2-4 business days.',
                  color: '#3b82f6',
                },
              ].map(item => (
                <div key={item.step} className="flex items-start gap-3">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                    style={{
                      background: `${item.color}15`,
                      color: item.color,
                      border: `1px solid ${item.color}30`,
                    }}
                  >
                    {item.step}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {item.title}
                    </p>
                    <p className="text-xs text-[#6b7280] mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-btn flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold"
            >
              <FaWhatsapp size={20} />
              Track on WhatsApp
            </a>

            <Link
              to="/track-order"
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all"
              style={{
                background: '#2d2d2d',
                color: '#e5e5e5',
                border: '1px solid #3d3d3d',
              }}
            >
              <FiPackage size={18} />
              My Orders
            </Link>

            <Link
              to="/shop"
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all"
              style={{
                background: '#2d2d2d',
                color: '#e5e5e5',
                border: '1px solid #3d3d3d',
              }}
            >
              <FiShoppingBag size={18} />
              Continue Shopping
            </Link>
          </motion.div>

        </div>
      </div>
    </>
  )
}

export default OrderSuccess