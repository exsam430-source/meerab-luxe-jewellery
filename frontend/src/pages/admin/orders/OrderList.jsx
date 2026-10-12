import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiRefreshCw, FiEye, FiSearch,
  FiFilter, FiDownload,
} from 'react-icons/fi'
import { orderApi } from '../../../api/orderApi.js'
import OrderStatusBadge from '../../../components/admin/OrderStatusBadge.jsx'
import { formatPrice, formatDate } from '../../../utils/helpers.js'
import Loader from '../../../components/common/Loader.jsx'
import toast from 'react-hot-toast'

const STATUS_FILTERS = [
  'All',
  'Order Placed',
  'Payment Pending',
  'Payment Verified',
  'Processing',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
]

const OrderList = () => {
  const [orders, setOrders] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [paymentFilter, setPaymentFilter] = useState('All')
  const [page, setPage] = useState(1)
  const pageSize = 15

  useEffect(() => {
    loadOrders()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [orders, search, statusFilter, paymentFilter])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const res = await orderApi.getAll()
      if (res.data.success) {
        setOrders(res.data.orders || [])
      }
    } catch (error) {
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let result = [...orders]

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(o => {
        const id = String(o._id || o.id)
        const address = o.address || {}
        return (
          id.toLowerCase().includes(q) ||
          (address.firstName || '').toLowerCase().includes(q) ||
          (address.lastName || '').toLowerCase().includes(q) ||
          (address.phone || '').includes(q)
        )
      })
    }

    if (statusFilter !== 'All') {
      result = result.filter(o => o.status === statusFilter)
    }

    if (paymentFilter === 'Paid') {
      result = result.filter(o => o.payment === true)
    } else if (paymentFilter === 'Unpaid') {
      result = result.filter(o => o.payment !== true)
    }

    setFiltered(result)
    setPage(1)
  }

  const handleStatusUpdate = async (orderId, status) => {
    try {
      const res = await orderApi.updateStatus({ orderId, status })
      if (res.data.success) {
        setOrders(prev =>
          prev.map(o =>
            String(o._id || o.id) === String(orderId)
              ? { ...o, status }
              : o
          )
        )
        toast.success(`Status updated to: ${status}`)
      }
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const handlePaymentToggle = async (orderId, current) => {
    try {
      const res = await orderApi.updatePayment({
        orderId,
        payment: !current,
      })
      if (res.data.success) {
        setOrders(prev =>
          prev.map(o =>
            String(o._id || o.id) === String(orderId)
              ? { ...o, payment: !current }
              : o
          )
        )
        toast.success(`Payment marked as ${!current ? 'Paid' : 'Unpaid'}`)
      }
    } catch (error) {
      toast.error('Failed to update payment')
    }
  }

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)
  const totalPages = Math.ceil(filtered.length / pageSize)

  // Summary stats
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'Payment Pending').length,
    delivered: orders.filter(o => o.status === 'Delivered').length,
    revenue: orders
      .filter(o => o.payment)
      .reduce((sum, o) => sum + Number(o.amount || 0), 0),
  }

  return (
    <div className="space-y-5">
      {/* ✅ Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1
            className="font-playfair font-bold text-white"
            style={{ fontSize: 'clamp(20px, 3vw, 26px)' }}
          >
            Orders
          </h1>
          <p className="text-[#6b7280] text-sm mt-0.5">
            {filtered.length} orders
          </p>
        </div>
        <button
          onClick={loadOrders}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all"
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

      {/* ✅ Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Orders', value: stats.total, color: '#d4af37' },
          { label: 'Pending Payment', value: stats.pending, color: '#f59e0b' },
          { label: 'Delivered', value: stats.delivered, color: '#10b981' },
          { label: 'Revenue Collected', value: formatPrice(stats.revenue), color: '#3b82f6' },
        ].map(stat => (
          <div
            key={stat.label}
            className="card-dark rounded-xl p-4"
          >
            <p className="text-xs text-[#6b7280] mb-1">{stat.label}</p>
            <p
              className="font-bold text-lg"
              style={{ color: stat.color }}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* ✅ Filters */}
      <div className="card-dark rounded-xl p-4 space-y-3">
        {/* Search */}
        <div className="relative">
          <FiSearch
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280]"
          />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by order ID, customer name or phone..."
            className="input-dark pl-9 text-sm"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: statusFilter === status
                  ? 'rgba(212,175,55,0.15)'
                  : '#2d2d2d',
                color: statusFilter === status ? '#d4af37' : '#6b7280',
                border: `1px solid ${statusFilter === status
                  ? 'rgba(212,175,55,0.3)'
                  : '#3d3d3d'}`,
              }}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Payment filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#6b7280]">Payment:</span>
          {['All', 'Paid', 'Unpaid'].map(f => (
            <button
              key={f}
              onClick={() => setPaymentFilter(f)}
              className="px-3 py-1 rounded-lg text-xs transition-all"
              style={{
                background: paymentFilter === f
                  ? 'rgba(212,175,55,0.15)'
                  : '#2d2d2d',
                color: paymentFilter === f ? '#d4af37' : '#6b7280',
                border: `1px solid ${paymentFilter === f
                  ? 'rgba(212,175,55,0.3)'
                  : '#3d3d3d'}`,
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ✅ Orders Table */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card-dark rounded-2xl p-12 text-center">
          <p className="text-[#6b7280] text-sm">No orders found</p>
        </div>
      ) : (
        <>
          <div className="card-dark rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Amount</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map(order => {
                    const id = String(order._id || order.id)
                    const address = order.address || {}
                    const customerName = [
                      address.firstName,
                      address.lastName,
                    ].filter(Boolean).join(' ') || 'Guest'

                    return (
                      <motion.tr
                        key={id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <td>
                          <Link
                            to={`/admin/orders/${id}`}
                            className="text-[#d4af37] hover:text-[#f4e5c2] font-mono text-xs font-medium transition-colors"
                          >
                            #{id.slice(-6).toUpperCase()}
                          </Link>
                        </td>
                        <td>
                          <div>
                            <p className="text-white text-sm font-medium">
                              {customerName}
                            </p>
                            <p className="text-[#6b7280] text-xs">
                              {address.phone || '—'}
                            </p>
                          </div>
                        </td>
                        <td className="text-[#a0a0a0] text-xs">
                          {order.items?.length || 0} item(s)
                        </td>
                        <td>
                          <span
                            className="font-semibold"
                            style={{ color: '#d4af37' }}
                          >
                            {formatPrice(order.amount)}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() =>
                              handlePaymentToggle(id, order.payment)
                            }
                            className="text-xs px-2.5 py-1 rounded-full font-medium transition-all"
                            style={{
                              background: order.payment
                                ? 'rgba(16,185,129,0.1)'
                                : 'rgba(245,158,11,0.1)',
                              color: order.payment ? '#10b981' : '#f59e0b',
                              border: `1px solid ${order.payment
                                ? 'rgba(16,185,129,0.3)'
                                : 'rgba(245,158,11,0.3)'}`,
                            }}
                          >
                            {order.payment ? '✓ Paid' : 'Pending'}
                          </button>
                        </td>
                        <td>
                          <select
                            value={order.status}
                            onChange={e =>
                              handleStatusUpdate(id, e.target.value)
                            }
                            className="text-xs rounded-lg px-2 py-1.5 transition-all outline-none"
                            style={{
                              background: '#2d2d2d',
                              color: '#e5e5e5',
                              border: '1px solid #3d3d3d',
                            }}
                          >
                            {STATUS_FILTERS.filter(s => s !== 'All').map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                        <td className="text-[#6b7280] text-xs whitespace-nowrap">
                          {formatDate(order.date)}
                        </td>
                        <td>
                          <Link
                            to={`/admin/orders/${id}`}
                            className="p-2 rounded-lg text-[#a0a0a0] hover:text-[#d4af37] hover:bg-[#2d2d2d] transition-colors inline-flex"
                          >
                            <FiEye size={15} />
                          </Link>
                        </td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#6b7280]">
                Showing {(page - 1) * pageSize + 1}–
                {Math.min(page * pageSize, filtered.length)} of{' '}
                {filtered.length}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg text-sm disabled:opacity-30 transition-colors"
                  style={{
                    background: '#2d2d2d',
                    color: '#a0a0a0',
                    border: '1px solid #3d3d3d',
                  }}
                >
                  ‹
                </button>
                <span className="text-sm text-[#6b7280]">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() =>
                    setPage(p => Math.min(totalPages, p + 1))
                  }
                  disabled={page === totalPages}
                  className="px-3 py-1.5 rounded-lg text-sm disabled:opacity-30 transition-colors"
                  style={{
                    background: '#2d2d2d',
                    color: '#a0a0a0',
                    border: '1px solid #3d3d3d',
                  }}
                >
                  ›
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default OrderList