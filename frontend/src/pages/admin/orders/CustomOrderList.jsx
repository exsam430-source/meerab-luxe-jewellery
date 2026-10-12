import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiRefreshCw, FiEye, FiTrash2, FiSearch } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { customOrderApi } from '../../../api/customOrderApi.js'
import { formatDate } from '../../../utils/helpers.js'
import Modal from '../../../components/common/Modal.jsx'
import Loader from '../../../components/common/Loader.jsx'
import toast from 'react-hot-toast'

const STATUS_COLORS = {
  pending: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  quoted: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  confirmed: 'text-green-400 bg-green-400/10 border-green-400/30',
  in_progress: 'text-purple-400 bg-purple-400/10 border-purple-400/30',
  completed: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  cancelled: 'text-red-400 bg-red-400/10 border-red-400/30',
}

const CustomOrderList = () => {
  const [orders, setOrders] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [updating, setUpdating] = useState(false)
  const [quoteForm, setQuoteForm] = useState({
    price: '',
    estimatedDays: '',
    notes: '',
  })
  const [newStatus, setNewStatus] = useState('')
  const [adminNote, setAdminNote] = useState('')

  useEffect(() => {
    loadOrders()
  }, [])

  useEffect(() => {
    let result = [...orders]
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(o =>
        o.customerName?.toLowerCase().includes(q) ||
        o.customerPhone?.includes(q) ||
        o.jewelleryType?.toLowerCase().includes(q)
      )
    }
    if (statusFilter !== 'all') {
      result = result.filter(o => o.status === statusFilter)
    }
    setFiltered(result)
  }, [orders, search, statusFilter])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const res = await customOrderApi.getAll()
      if (res.data.success) {
        setOrders(res.data.customOrders || [])
      }
    } catch (error) {
      toast.error('Failed to load custom orders')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async () => {
    if (!selectedOrder || !newStatus) return
    setUpdating(true)
    try {
      const updateData = {
        customOrderId: String(selectedOrder._id || selectedOrder.id),
        status: newStatus,
        adminNote,
      }
      if (newStatus === 'quoted' && quoteForm.price) {
        updateData.adminQuote = {
          price: Number(quoteForm.price),
          estimatedDays: Number(quoteForm.estimatedDays) || 0,
          notes: quoteForm.notes,
        }
      }
      const res = await customOrderApi.updateStatus(updateData)
      if (res.data.success) {
        toast.success('Custom order updated!')
        setOrders(prev =>
          prev.map(o =>
            String(o._id || o.id) ===
            String(selectedOrder._id || selectedOrder.id)
              ? res.data.customOrder
              : o
          )
        )
        setSelectedOrder(null)
      } else {
        toast.error(res.data.message || 'Update failed')
      }
    } catch (error) {
      toast.error('Failed to update order')
    } finally {
      setUpdating(false)
    }
  }

  const handleDelete = async (order) => {
    const id = String(order._id || order.id)
    if (!window.confirm('Delete this custom order?')) return
    try {
      const res = await customOrderApi.delete(id)
      if (res.data.success) {
        setOrders(prev =>
          prev.filter(o => String(o._id || o.id) !== id)
        )
        toast.success('Deleted successfully')
      }
    } catch (error) {
      toast.error('Delete failed')
    }
  }

  const openOrder = (order) => {
    setSelectedOrder(order)
    setNewStatus(order.status)
    setAdminNote(order.adminNote || '')
    setQuoteForm({
      price: order.adminQuote?.price || '',
      estimatedDays: order.adminQuote?.estimatedDays || '',
      notes: order.adminQuote?.notes || '',
    })
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="font-playfair font-bold text-white"
            style={{ fontSize: 'clamp(20px, 3vw, 26px)' }}
          >
            Custom Orders
          </h1>
          <p className="text-[#6b7280] text-sm mt-0.5">
            {filtered.length} requests
          </p>
        </div>
        <button
          onClick={loadOrders}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
          style={{
            background: '#2d2d2d',
            color: '#a0a0a0',
            border: '1px solid #3d3d3d',
          }}
        >
          <FiRefreshCw size={15} className={loading ? 'animate-spin' : ''} />
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
            placeholder="Search by name, phone or jewellery type..."
            className="input-dark pl-9 text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'quoted', 'confirmed', 'in_progress', 'completed', 'cancelled'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all"
              style={{
                background: statusFilter === s
                  ? 'rgba(212,175,55,0.15)'
                  : '#2d2d2d',
                color: statusFilter === s ? '#d4af37' : '#6b7280',
                border: `1px solid ${statusFilter === s
                  ? 'rgba(212,175,55,0.3)'
                  : '#3d3d3d'}`,
              }}
            >
              {s === 'all' ? 'All' : s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card-dark rounded-2xl p-12 text-center">
          <p className="text-[#6b7280] text-sm">No custom orders found</p>
        </div>
      ) : (
        <div className="card-dark rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Type</th>
                  <th>Budget</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => {
                  const id = String(order._id || order.id)
                  const colorClass = STATUS_COLORS[order.status] || ''
                  const waLink = `https://wa.me/${(order.customerWhatsApp || order.customerPhone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Assalamu Alaikum ${order.customerName}! Regarding your custom jewellery order request.`)}`

                  return (
                    <motion.tr
                      key={id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <td>
                        <div>
                          <p className="text-white text-sm font-medium">
                            {order.customerName}
                          </p>
                          <p className="text-[#6b7280] text-xs">
                            {order.customerPhone}
                          </p>
                        </div>
                      </td>
                      <td className="text-[#a0a0a0] text-sm">
                        {order.jewelleryType}
                      </td>
                      <td className="text-xs text-[#a0a0a0]">
                        {order.budgetMin > 0 || order.budgetMax > 0
                          ? `Rs.${order.budgetMin}–${order.budgetMax}`
                          : '—'}
                      </td>
                      <td>
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full border font-medium capitalize ${colorClass}`}
                        >
                          {order.status?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="text-[#6b7280] text-xs">
                        {formatDate(order.created_at)}
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openOrder(order)}
                            className="p-1.5 rounded-lg text-[#a0a0a0] hover:text-[#d4af37] hover:bg-[#2d2d2d] transition-colors"
                          >
                            <FiEye size={14} />
                          </button>
                          <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-[#25d366] hover:bg-[#25d366]/10 transition-colors"
                          >
                            <FaWhatsapp size={14} />
                          </a>
                          <button
                            onClick={() => handleDelete(order)}
                            className="p-1.5 rounded-lg text-[#a0a0a0] hover:text-red-400 hover:bg-red-400/10 transition-colors"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Custom Order — ${selectedOrder?.customerName || ''}`}
        size="lg"
      >
        {selectedOrder && (
          <div className="p-5 space-y-4">
            {/* Customer Details */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: 'Name', value: selectedOrder.customerName },
                { label: 'Phone', value: selectedOrder.customerPhone },
                { label: 'Email', value: selectedOrder.customerEmail },
                { label: 'WhatsApp', value: selectedOrder.customerWhatsApp },
                { label: 'Type', value: selectedOrder.jewelleryType },
                { label: 'Material', value: selectedOrder.materialPreference },
                { label: 'Budget', value: `Rs.${selectedOrder.budgetMin}–${selectedOrder.budgetMax}` },
                { label: 'Required By', value: selectedOrder.requiredBy ? formatDate(selectedOrder.requiredBy) : 'Not specified' },
              ].map(item => (
                <div key={item.label}>
                  <p className="text-xs text-[#6b7280]">{item.label}</p>
                  <p className="text-white text-sm font-medium">{item.value || '—'}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div
              className="rounded-xl p-4"
              style={{ background: '#2d2d2d' }}
            >
              <p className="text-xs text-[#6b7280] mb-1">Description</p>
              <p className="text-[#e5e5e5] text-sm leading-relaxed">
                {selectedOrder.description}
              </p>
            </div>

            {/* Reference Images */}
            {selectedOrder.referenceImages?.length > 0 && (
              <div>
                <p className="text-xs text-[#6b7280] mb-2">Reference Images</p>
                <div className="flex flex-wrap gap-2">
                  {selectedOrder.referenceImages.map((img, i) => (
                    <a
                      key={i}
                      href={img}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={img}
                        alt={`Reference ${i + 1}`}
                        className="w-20 h-20 rounded-lg object-cover"
                        style={{ border: '1px solid #3d3d3d' }}
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Update Form */}
            <div className="space-y-3 pt-2 border-t" style={{ borderColor: '#3d3d3d' }}>
              <div>
                <label className="block text-sm text-[#a0a0a0] mb-1">Update Status</label>
                <select
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value)}
                  className="input-dark"
                >
                  {['pending', 'quoted', 'confirmed', 'in_progress', 'completed', 'cancelled'].map(s => (
                    <option key={s} value={s}>{s.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>

              {newStatus === 'quoted' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-[#a0a0a0] mb-1">Quote Price (Rs.)</label>
                    <input
                      type="number"
                      value={quoteForm.price}
                      onChange={e => setQuoteForm(p => ({ ...p, price: e.target.value }))}
                      className="input-dark"
                      placeholder="5000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#a0a0a0] mb-1">Estimated Days</label>
                    <input
                      type="number"
                      value={quoteForm.estimatedDays}
                      onChange={e => setQuoteForm(p => ({ ...p, estimatedDays: e.target.value }))}
                      className="input-dark"
                      placeholder="7"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm text-[#a0a0a0] mb-1">Quote Notes</label>
                    <textarea
                      value={quoteForm.notes}
                      onChange={e => setQuoteForm(p => ({ ...p, notes: e.target.value }))}
                      className="input-dark resize-none"
                      rows={2}
                      placeholder="Additional notes for the customer..."
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm text-[#a0a0a0] mb-1">Admin Note</label>
                <textarea
                  value={adminNote}
                  onChange={e => setAdminNote(e.target.value)}
                  className="input-dark resize-none"
                  rows={2}
                  placeholder="Internal note..."
                />
              </div>

              <button
                onClick={handleUpdate}
                disabled={updating}
                className="btn-gold w-full flex items-center justify-center gap-2"
              >
                {updating ? (
                  <div
                    className="w-4 h-4 rounded-full border-2 animate-spin"
                    style={{ borderColor: '#1a1a1a', borderTopColor: 'transparent' }}
                  />
                ) : 'Update Order'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default CustomOrderList