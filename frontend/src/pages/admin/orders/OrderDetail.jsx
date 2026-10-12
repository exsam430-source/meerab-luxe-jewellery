import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiArrowLeft, FiPackage, FiUser,
  FiMapPin, FiDollarSign, FiEdit2,
  FiCheck, FiX,
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { orderApi } from '../../../api/orderApi.js'
import OrderStatusBadge from '../../../components/admin/OrderStatusBadge.jsx'
import { formatPrice, formatDate, formatDateTime, getOptimizedImageUrl } from '../../../utils/helpers.js'
import { createTrackOrderWhatsAppLink } from '../../../utils/whatsappLink.js'
import Loader from '../../../components/common/Loader.jsx'
import toast from 'react-hot-toast'

const STATUS_OPTIONS = [
  'Order Placed', 'Payment Pending', 'Payment Verified',
  'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled',
]

const OrderDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [adminNote, setAdminNote] = useState('')
  const [editingNote, setEditingNote] = useState(false)

  useEffect(() => {
    if (id) loadOrder()
  }, [id])

  const loadOrder = async () => {
    try {
      setLoading(true)
      const res = await orderApi.getById(id)
      if (res.data.success) {
        setOrder(res.data.order)
        setSelectedStatus(res.data.order.status)
        setAdminNote(res.data.order.adminNote || '')
      } else {
        toast.error('Order not found')
        navigate('/admin/orders')
      }
    } catch (error) {
      toast.error('Failed to load order')
      navigate('/admin/orders')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async () => {
    try {
      setUpdating(true)
      const res = await orderApi.updateStatus({
        orderId: id,
        status: selectedStatus,
        adminNote,
      })
      if (res.data.success) {
        setOrder(res.data.order)
        toast.success('Order updated successfully')
        setEditingNote(false)
      } else {
        toast.error(res.data.message || 'Update failed')
      }
    } catch (error) {
      toast.error('Failed to update order')
    } finally {
      setUpdating(false)
    }
  }

  const handlePaymentToggle = async () => {
    try {
      setUpdating(true)
      const res = await orderApi.updatePayment({
        orderId: id,
        payment: !order.payment,
      })
      if (res.data.success) {
        setOrder(res.data.order)
        toast.success(
          `Payment marked as ${!order.payment ? 'Paid' : 'Unpaid'}`
        )
      }
    } catch (error) {
      toast.error('Failed to update payment')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader size="lg" />
      </div>
    )
  }

  if (!order) return null

  const orderId = String(order._id || order.id)
  const orderIdShort = orderId.slice(-8).toUpperCase()
  const address = order.address || {}
  const customerName = [address.firstName, address.lastName]
    .filter(Boolean).join(' ') || 'Guest'
  const waLink = createTrackOrderWhatsAppLink(orderIdShort)

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* ✅ Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/orders"
            className="p-2 rounded-lg text-[#a0a0a0] hover:text-white hover:bg-[#2d2d2d] transition-colors"
          >
            <FiArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="font-playfair font-bold text-white text-xl">
              Order #{orderIdShort}
            </h1>
            <p className="text-[#6b7280] text-sm">
              {formatDateTime(order.date)}
            </p>
          </div>
        </div>
        <OrderStatusBadge status={order.status} size="md" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ✅ Left Column */}
        <div className="lg:col-span-2 space-y-5">

          {/* Order Items */}
          <div className="card-dark rounded-2xl overflow-hidden">
            <div
              className="flex items-center gap-2 px-5 py-4 border-b"
              style={{ borderColor: '#3d3d3d' }}
            >
              <FiPackage size={18} style={{ color: '#d4af37' }} />
              <h2 className="font-semibold text-white">
                Order Items ({order.items?.length || 0})
              </h2>
            </div>
            <div className="p-5 space-y-4">
              {order.items?.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4"
                >
                  <div
                    className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0"
                    style={{ background: '#2d2d2d' }}
                  >
                    {item.image ? (
                      <img
                        src={getOptimizedImageUrl(item.image, 100, 70)}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">
                        💍
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">
                      {item.name}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-0.5">
                      {item.size && (
                        <span className="text-xs text-[#6b7280]">
                          Size: {item.size}
                        </span>
                      )}
                      {item.color && (
                        <span className="text-xs text-[#6b7280]">
                          Color: {item.color}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#6b7280] mt-0.5">
                      Qty: {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                  <span
                    className="font-bold flex-shrink-0"
                    style={{ color: '#d4af37' }}
                  >
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}

              {/* Total */}
              <div
                className="border-t pt-4 space-y-2"
                style={{ borderColor: '#3d3d3d' }}
              >
                <div className="flex justify-between text-sm">
                  <span className="text-[#a0a0a0]">Payment Method</span>
                  <span className="text-white font-medium">
                    {order.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-white">Order Total</span>
                  <span
                    style={{ color: '#d4af37', fontSize: '20px' }}
                  >
                    {formatPrice(order.amount)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Proof */}
          {order.paymentProof && (
            <div className="card-dark rounded-2xl p-5">
              <h2 className="font-semibold text-white mb-3">
                Payment Proof
              </h2>
              <a
                href={order.paymentProof}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={getOptimizedImageUrl(order.paymentProof, 600, 85)}
                  alt="Payment proof"
                  className="w-full max-w-sm rounded-xl border"
                  style={{ borderColor: '#3d3d3d' }}
                />
              </a>
              {order.paymentDetails && (
                <div className="mt-3 space-y-1 text-sm">
                  {order.paymentDetails.transactionId && (
                    <p className="text-[#a0a0a0]">
                      TXN ID:{' '}
                      <span className="text-white">
                        {order.paymentDetails.transactionId}
                      </span>
                    </p>
                  )}
                  {order.paymentDetails.senderName && (
                    <p className="text-[#a0a0a0]">
                      Sender:{' '}
                      <span className="text-white">
                        {order.paymentDetails.senderName}
                      </span>
                    </p>
                  )}
                  {order.paymentDetails.senderNumber && (
                    <p className="text-[#a0a0a0]">
                      Number:{' '}
                      <span className="text-white">
                        {order.paymentDetails.senderNumber}
                      </span>
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Admin Actions */}
          <div className="card-dark rounded-2xl p-5">
            <h2 className="font-semibold text-white mb-4">
              Update Order
            </h2>
            <div className="space-y-4">
              {/* Status */}
              <div>
                <label className="block text-sm text-[#a0a0a0] mb-1">
                  Order Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={e => setSelectedStatus(e.target.value)}
                  className="input-dark"
                >
                  {STATUS_OPTIONS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Admin Note */}
              <div>
                <label className="block text-sm text-[#a0a0a0] mb-1">
                  Admin Note
                </label>
                <textarea
                  value={adminNote}
                  onChange={e => setAdminNote(e.target.value)}
                  className="input-dark resize-none"
                  rows={3}
                  placeholder="Add a note for this order..."
                />
              </div>

              {/* Update Button */}
              <button
                onClick={handleStatusUpdate}
                disabled={updating}
                className="btn-gold flex items-center gap-2"
              >
                {updating ? (
                  <div
                    className="w-4 h-4 rounded-full border-2 animate-spin"
                    style={{
                      borderColor: '#1a1a1a',
                      borderTopColor: 'transparent',
                    }}
                  />
                ) : (
                  <FiCheck size={16} />
                )}
                Update Order
              </button>
            </div>
          </div>
        </div>

        {/* ✅ Right Column */}
        <div className="space-y-5">

          {/* Customer Info */}
          <div className="card-dark rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <FiUser size={16} style={{ color: '#d4af37' }} />
              <h2 className="font-semibold text-white">Customer</h2>
            </div>
            <div className="space-y-2 text-sm">
              <p className="font-medium text-white">{customerName}</p>
              {address.phone && (
                <p className="text-[#a0a0a0]">{address.phone}</p>
              )}
              {address.email && (
                <p className="text-[#a0a0a0]">{address.email}</p>
              )}
            </div>
          </div>

          {/* Delivery Address */}
          <div className="card-dark rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <FiMapPin size={16} style={{ color: '#d4af37' }} />
              <h2 className="font-semibold text-white">Delivery Address</h2>
            </div>
            <div className="text-sm text-[#a0a0a0] space-y-1">
              <p className="text-white font-medium">{customerName}</p>
              <p>{address.street}</p>
              <p>{address.city}{address.province ? `, ${address.province}` : ''}</p>
              {address.notes && (
                <p className="text-[#6b7280] text-xs mt-2">
                  Note: {address.notes}
                </p>
              )}
            </div>
          </div>

          {/* Payment Status */}
          <div className="card-dark rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <FiDollarSign size={16} style={{ color: '#d4af37' }} />
              <h2 className="font-semibold text-white">Payment</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#a0a0a0]">Method</span>
                <span className="text-white">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#a0a0a0]">Status</span>
                <span
                  className="font-medium"
                  style={{ color: order.payment ? '#10b981' : '#f59e0b' }}
                >
                  {order.payment ? '✓ Paid' : 'Pending'}
                </span>
              </div>
              {order.paymentVerifiedAt && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#a0a0a0]">Verified At</span>
                  <span className="text-white text-xs">
                    {formatDate(order.paymentVerifiedAt)}
                  </span>
                </div>
              )}
              <button
                onClick={handlePaymentToggle}
                disabled={updating}
                className="w-full py-2 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: order.payment
                    ? 'rgba(239,68,68,0.1)'
                    : 'rgba(16,185,129,0.1)',
                  color: order.payment ? '#ef4444' : '#10b981',
                  border: `1px solid ${order.payment
                    ? 'rgba(239,68,68,0.2)'
                    : 'rgba(16,185,129,0.2)'}`,
                }}
              >
                {order.payment ? '✗ Mark Unpaid' : '✓ Mark as Paid'}
              </button>
            </div>
          </div>

          {/* WhatsApp */}
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-btn w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm"
          >
            <FaWhatsapp size={18} />
            Contact Customer
          </a>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail