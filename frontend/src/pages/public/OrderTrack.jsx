import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiPackage, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import SEO from '../../components/common/SEO.jsx'
import { orderApi } from '../../api/orderApi.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { formatPrice, formatDate, getStatusColor } from '../../utils/helpers.js'
import { createTrackOrderWhatsAppLink } from '../../utils/whatsappLink.js'
import useSettings from '../../hooks/useSettings.js'
import Loader from '../../components/common/Loader.jsx'
import { Link } from 'react-router-dom'

const STATUS_STEPS = [
  'Order Placed',
  'Payment Verified',
  'Processing',
  'Shipped',
  'Out for Delivery',
  'Delivered',
]

const OrderCard = ({ order, isExpanded, onToggle, whatsappNumber }) => {
  const orderId = String(order._id || order.id)
  const orderIdShort = orderId.slice(-8).toUpperCase()
  const statusIndex = STATUS_STEPS.indexOf(order.status)
  const waLink = createTrackOrderWhatsAppLink(orderIdShort, whatsappNumber)
  const colorClass = getStatusColor(order.status)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-dark rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-[#2d2d2d] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(212,175,55,0.1)' }}
          >
            <FiPackage size={18} style={{ color: '#d4af37' }} />
          </div>
          <div>
            <p className="font-medium text-white text-sm">
              Order #{orderIdShort}
            </p>
            <p className="text-xs text-[#6b7280] mt-0.5">
              {formatDate(order.date)} · {order.items?.length || 0} items
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p
              className={`text-xs px-2.5 py-1 rounded-full border font-medium ${colorClass}`}
            >
              {order.status}
            </p>
            <p
              className="font-bold mt-1"
              style={{ color: '#d4af37', fontSize: '15px' }}
            >
              {formatPrice(order.amount)}
            </p>
          </div>
          {isExpanded
            ? <FiChevronUp size={18} className="text-[#6b7280]" />
            : <FiChevronDown size={18} className="text-[#6b7280]" />
          }
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="border-t px-5 pb-5"
          style={{ borderColor: '#3d3d3d' }}
        >
          {/* Status Progress */}
          {statusIndex >= 0 && order.status !== 'Cancelled' && (
            <div className="py-5">
              <div className="flex items-center justify-between relative">
                <div
                  className="absolute top-3 left-0 right-0 h-0.5"
                  style={{ background: '#3d3d3d' }}
                />
                <div
                  className="absolute top-3 left-0 h-0.5 transition-all duration-500"
                  style={{
                    background: 'linear-gradient(90deg, #d4af37, #f4e5c2)',
                    width: `${(statusIndex / (STATUS_STEPS.length - 1)) * 100}%`,
                  }}
                />
                {STATUS_STEPS.map((step, i) => (
                  <div
                    key={step}
                    className="relative flex flex-col items-center gap-2 z-10"
                    style={{ flex: 1 }}
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                      style={{
                        background: i <= statusIndex ? '#d4af37' : '#3d3d3d',
                        color: i <= statusIndex ? '#1a1a1a' : '#6b7280',
                      }}
                    >
                      {i < statusIndex ? '✓' : i + 1}
                    </div>
                    <p
                      className="text-center hidden sm:block"
                      style={{
                        fontSize: '9px',
                        color: i <= statusIndex ? '#d4af37' : '#6b7280',
                        maxWidth: '60px',
                      }}
                    >
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Items */}
          <div className="space-y-2 mb-4">
            <p className="text-xs text-[#6b7280] uppercase tracking-wider mb-2">
              Items
            </p>
            {order.items?.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-[#a0a0a0]">
                  {item.name} × {item.quantity}
                  {item.size ? ` (${item.size})` : ''}
                </span>
                <span className="text-white font-medium">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Payment Info */}
          <div
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t"
            style={{ borderColor: '#3d3d3d' }}
          >
            <div>
              <p className="text-xs text-[#6b7280]">
                Payment: {order.paymentMethod} ·{' '}
                <span style={{ color: order.payment ? '#10b981' : '#f59e0b' }}>
                  {order.payment ? 'Paid ✓' : 'Pending'}
                </span>
              </p>
              {order.address && (
                <p className="text-xs text-[#6b7280] mt-1">
                  Delivery: {order.address.street}, {order.address.city}
                </p>
              )}
            </div>

            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-btn flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
            >
              <FaWhatsapp size={16} />
              Track on WhatsApp
            </a>
          </div>

          {/* Admin Note */}
          {order.adminNote && (
            <div
              className="mt-3 p-3 rounded-xl text-sm"
              style={{
                background: 'rgba(212,175,55,0.06)',
                border: '1px solid rgba(212,175,55,0.15)',
              }}
            >
              <p className="text-xs text-[#6b7280] mb-1">Note from store:</p>
              <p className="text-[#e5e5e5]">{order.adminNote}</p>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}

const OrderTrack = () => {
  const { isAuthenticated, user } = useAuth()
  const { settings } = useSettings()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    if (isAuthenticated) loadOrders()
    else setLoading(false)
  }, [isAuthenticated])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const res = await orderApi.getUserOrders()
      if (res.data.success) {
        setOrders(res.data.orders || [])
        if (res.data.orders?.length > 0) {
          setExpandedId(String(res.data.orders[0]._id || res.data.orders[0].id))
        }
      }
    } catch (error) {
      console.error('Load orders error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEO
        title="My Orders | MeerabLuxe Jewellers"
        description="Track your jewellery orders."
        noIndex
      />

      <div className="container-custom py-6 md:py-10">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="mb-6">
            <h1
              className="font-playfair font-bold text-white"
              style={{ fontSize: 'clamp(22px, 4vw, 32px)' }}
            >
              My Orders
            </h1>
            {isAuthenticated && (
              <p className="text-[#a0a0a0] text-sm mt-1">
                Welcome back, {user?.name}
              </p>
            )}
          </div>

          {/* Not logged in */}
          {!isAuthenticated ? (
            <div className="text-center py-16 card-dark rounded-2xl">
              <FiPackage size={40} className="mx-auto mb-4" style={{ color: '#d4af37' }} />
              <h2 className="font-playfair text-xl text-white mb-2">
                Login to view your orders
              </h2>
              <p className="text-[#6b7280] text-sm mb-5">
                Sign in to track your orders and manage returns.
              </p>
              <Link to="/login" className="btn-gold">
                Login / Register
              </Link>
            </div>
          ) : loading ? (
            <Loader center />
          ) : orders.length === 0 ? (
            <div className="text-center py-16 card-dark rounded-2xl">
              <FiPackage size={40} className="mx-auto mb-4" style={{ color: '#d4af37' }} />
              <h2 className="font-playfair text-xl text-white mb-2">
                No orders yet
              </h2>
              <p className="text-[#6b7280] text-sm mb-5">
                You haven't placed any orders yet.
              </p>
              <Link to="/shop" className="btn-gold">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => {
                const id = String(order._id || order.id)
                return (
                  <OrderCard
                    key={id}
                    order={order}
                    isExpanded={expandedId === id}
                    onToggle={() => setExpandedId(expandedId === id ? null : id)}
                    whatsappNumber={settings?.whatsappNumber}
                  />
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default OrderTrack