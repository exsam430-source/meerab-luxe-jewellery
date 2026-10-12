import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiRefreshCw, FiEye, FiSearch } from 'react-icons/fi'
import { returnApi } from '../../../api/returnApi.js'
import { formatDate, formatPrice, getReturnStatusColor } from '../../../utils/helpers.js'
import Modal from '../../../components/common/Modal.jsx'
import Loader from '../../../components/common/Loader.jsx'
import toast from 'react-hot-toast'

const ReturnList = () => {
  const [returns, setReturns] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedReturn, setSelectedReturn] = useState(null)
  const [updating, setUpdating] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [adminNote, setAdminNote] = useState('')
  const [refundAmount, setRefundAmount] = useState('')

  useEffect(() => {
    loadReturns()
  }, [])

  useEffect(() => {
    let result = [...returns]
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(r => {
        const user = r.userId || {}
        return (
          (user.name || '').toLowerCase().includes(q) ||
          (user.email || '').toLowerCase().includes(q) ||
          (r.reason || '').toLowerCase().includes(q)
        )
      })
    }
    if (statusFilter !== 'all') {
      result = result.filter(r => r.status === statusFilter)
    }
    setFiltered(result)
  }, [returns, search, statusFilter])

  const loadReturns = async () => {
    try {
      setLoading(true)
      const res = await returnApi.getAll()
      if (res.data.success) {
        setReturns(res.data.returns || [])
      }
    } catch (error) {
      toast.error('Failed to load returns')
    } finally {
      setLoading(false)
    }
  }

  const openReturn = (ret) => {
    setSelectedReturn(ret)
    setNewStatus(ret.status)
    setAdminNote(ret.adminNote || '')
    setRefundAmount(ret.refundAmount || '')
  }

  const handleUpdate = async () => {
    if (!selectedReturn) return
    setUpdating(true)
    try {
      let res
      if (newStatus === 'approved') {
        res = await returnApi.approve({
          returnId: String(selectedReturn._id || selectedReturn.id),
          adminNote,
        })
      } else if (newStatus === 'rejected') {
        res = await returnApi.reject({
          returnId: String(selectedReturn._id || selectedReturn.id),
          rejectionReason: adminNote,
        })
      } else if (newStatus === 'received') {
        res = await returnApi.markReceived({
          returnId: String(selectedReturn._id || selectedReturn.id),
          adminNote,
        })
      } else if (newStatus === 'completed') {
        res = await returnApi.completeRefund({
          returnId: String(selectedReturn._id || selectedReturn.id),
          refundAmount: Number(refundAmount) || 0,
          adminNote,
        })
      } else {
        res = await returnApi.updateStatus({
          returnId: String(selectedReturn._id || selectedReturn.id),
          status: newStatus,
          adminNote,
        })
      }

      if (res?.data?.success) {
        toast.success('Return updated!')
        setReturns(prev =>
          prev.map(r =>
            String(r._id || r.id) ===
            String(selectedReturn._id || selectedReturn.id)
              ? { ...r, status: newStatus, adminNote }
              : r
          )
        )
        setSelectedReturn(null)
      } else {
        toast.error(res?.data?.message || 'Update failed')
      }
    } catch (error) {
      toast.error('Failed to update return')
    } finally {
      setUpdating(false)
    }
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
            Returns
          </h1>
          <p className="text-[#6b7280] text-sm mt-0.5">
            {filtered.length} return requests
          </p>
        </div>
        <button
          onClick={loadReturns}
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
            placeholder="Search returns..."
            className="input-dark pl-9 text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'approved', 'rejected', 'received', 'completed'].map(s => (
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
              {s === 'all' ? 'All' : s}
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
          <p className="text-[#6b7280] text-sm">No return requests found</p>
        </div>
      ) : (
        <div className="card-dark rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Order</th>
                  <th>Reason</th>
                  <th>Refund Method</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(ret => {
                  const id = String(ret._id || ret.id)
                  const user = ret.userId || {}
                  const colorClass = getReturnStatusColor(ret.status)
                  const orderId = ret.orderId?._id || ret.orderId?.id || ret.orderId

                  return (
                    <motion.tr
                      key={id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <td>
                        <div>
                          <p className="text-white text-sm font-medium">
                            {user.name || 'Unknown'}
                          </p>
                          <p className="text-[#6b7280] text-xs">
                            {user.email || '—'}
                          </p>
                        </div>
                      </td>
                      <td className="text-[#a0a0a0] text-xs font-mono">
                        #{String(orderId || '').slice(-6).toUpperCase()}
                      </td>
                      <td className="text-[#a0a0a0] text-xs max-w-32 truncate">
                        {ret.reason}
                      </td>
                      <td className="text-[#a0a0a0] text-xs capitalize">
                        {ret.refundMethod}
                      </td>
                      <td>
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full border font-medium capitalize ${colorClass}`}
                        >
                          {ret.status}
                        </span>
                      </td>
                      <td className="text-[#6b7280] text-xs">
                        {formatDate(ret.created_at)}
                      </td>
                      <td>
                        <button
                          onClick={() => openReturn(ret)}
                          className="p-1.5 rounded-lg text-[#a0a0a0] hover:text-[#d4af37] hover:bg-[#2d2d2d] transition-colors"
                        >
                          <FiEye size={14} />
                        </button>
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
        isOpen={!!selectedReturn}
        onClose={() => setSelectedReturn(null)}
        title="Return Request Detail"
        size="lg"
      >
        {selectedReturn && (
          <div className="p-5 space-y-4">
            {/* Details */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: 'Customer', value: selectedReturn.userId?.name },
                { label: 'Phone', value: selectedReturn.userId?.phone },
                { label: 'Reason', value: selectedReturn.reason },
                { label: 'Refund Method', value: selectedReturn.refundMethod },
                { label: 'Current Status', value: selectedReturn.status },
                { label: 'Refund Amount', value: selectedReturn.refundAmount > 0 ? formatPrice(selectedReturn.refundAmount) : '—' },
              ].map(item => (
                <div key={item.label}>
                  <p className="text-xs text-[#6b7280]">{item.label}</p>
                  <p className="text-white text-sm font-medium capitalize">
                    {item.value || '—'}
                  </p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="rounded-xl p-4" style={{ background: '#2d2d2d' }}>
              <p className="text-xs text-[#6b7280] mb-1">Description</p>
              <p className="text-[#e5e5e5] text-sm leading-relaxed">
                {selectedReturn.description}
              </p>
            </div>

            {/* Proof Images */}
            {selectedReturn.proofImages?.length > 0 && (
              <div>
                <p className="text-xs text-[#6b7280] mb-2">Proof Images</p>
                <div className="flex flex-wrap gap-2">
                  {selectedReturn.proofImages.map((img, i) => (
                    <a
                      key={i}
                      href={img}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={img}
                        alt={`Proof ${i + 1}`}
                        className="w-20 h-20 rounded-lg object-cover"
                        style={{ border: '1px solid #3d3d3d' }}
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Update */}
            <div
              className="space-y-3 pt-3 border-t"
              style={{ borderColor: '#3d3d3d' }}
            >
              <div>
                <label className="block text-sm text-[#a0a0a0] mb-1">
                  Update Status
                </label>
                <select
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value)}
                  className="input-dark"
                >
                  {['pending', 'approved', 'rejected', 'received', 'refund_processing', 'completed', 'cancelled'].map(s => (
                    <option key={s} value={s}>
                      {s.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              {(newStatus === 'completed' || newStatus === 'refund_processing') && (
                <div>
                  <label className="block text-sm text-[#a0a0a0] mb-1">
                    Refund Amount (Rs.)
                  </label>
                  <input
                    type="number"
                    value={refundAmount}
                    onChange={e => setRefundAmount(e.target.value)}
                    className="input-dark"
                    placeholder="Enter refund amount"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm text-[#a0a0a0] mb-1">
                  {newStatus === 'rejected' ? 'Rejection Reason' : 'Admin Note'}
                </label>
                <textarea
                  value={adminNote}
                  onChange={e => setAdminNote(e.target.value)}
                  className="input-dark resize-none"
                  rows={2}
                  placeholder="Add a note..."
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
                    style={{
                      borderColor: '#1a1a1a',
                      borderTopColor: 'transparent',
                    }}
                  />
                ) : 'Update Return'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default ReturnList