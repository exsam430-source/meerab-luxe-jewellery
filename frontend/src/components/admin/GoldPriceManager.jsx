import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiRefreshCw, FiTrendingUp, FiClock,
  FiCheck, FiChevronDown, FiChevronUp,
} from 'react-icons/fi'
import { goldPriceApi } from '../../api/goldPriceApi.js'
import toast from 'react-hot-toast'

const TOLA_TO_GRAM = 11.6638

const GoldPriceManager = () => {
  const [currentPrice, setCurrentPrice] = useState(null)
  const [history,      setHistory]      = useState([])
  const [loading,      setLoading]      = useState(true)
  const [saving,       setSaving]       = useState(false)
  const [showHistory,  setShowHistory]  = useState(false)

  const [form, setForm] = useState({
    goldPricePerTola:   '',
    goldPricePerGram:   '',
    silverPricePerTola: '',
    silverPricePerGram: '',
    note: '',
  })

  useEffect(() => {
    loadPrices()
  }, [])

  const loadPrices = async () => {
    setLoading(true)
    try {
      const [latestRes, historyRes] = await Promise.all([
        goldPriceApi.getLatest(),
        goldPriceApi.getHistory(15),
      ])
      if (latestRes.data.success && latestRes.data.goldPrice) {
        const p = latestRes.data.goldPrice
        setCurrentPrice(p)
        setForm({
          goldPricePerTola:   String(p.goldPricePerTola   || ''),
          goldPricePerGram:   String(p.goldPricePerGram   || ''),
          silverPricePerTola: String(p.silverPricePerTola || ''),
          silverPricePerGram: String(p.silverPricePerGram || ''),
          note: '',
        })
      }
      if (historyRes.data.success) {
        setHistory(historyRes.data.history || [])
      }
    } catch (err) {
      console.error('Load gold prices error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Auto-calculate gram <-> tola
  const handleGoldTolaChange = (val) => {
    const tola = parseFloat(val) || 0
    setForm(function (prev) {
      return {
        ...prev,
        goldPricePerTola: val,
        goldPricePerGram: tola ? (tola / TOLA_TO_GRAM).toFixed(2) : '',
      }
    })
  }

  const handleGoldGramChange = (val) => {
    const gram = parseFloat(val) || 0
    setForm(function (prev) {
      return {
        ...prev,
        goldPricePerGram: val,
        goldPricePerTola: gram ? (gram * TOLA_TO_GRAM).toFixed(2) : '',
      }
    })
  }

  const handleSilverTolaChange = (val) => {
    const tola = parseFloat(val) || 0
    setForm(function (prev) {
      return {
        ...prev,
        silverPricePerTola: val,
        silverPricePerGram: tola ? (tola / TOLA_TO_GRAM).toFixed(2) : '',
      }
    })
  }

  const handleSilverGramChange = (val) => {
    const gram = parseFloat(val) || 0
    setForm(function (prev) {
      return {
        ...prev,
        silverPricePerGram: val,
        silverPricePerTola: gram ? (gram * TOLA_TO_GRAM).toFixed(2) : '',
      }
    })
  }

  const handleSave = async () => {
    if (!form.goldPricePerGram && !form.goldPricePerTola) {
      toast.error('Please enter gold price per gram or per tola')
      return
    }
    setSaving(true)
    try {
      const res = await goldPriceApi.update({
        goldPricePerGram:   parseFloat(form.goldPricePerGram)   || 0,
        goldPricePerTola:   parseFloat(form.goldPricePerTola)   || 0,
        silverPricePerGram: parseFloat(form.silverPricePerGram) || 0,
        silverPricePerTola: parseFloat(form.silverPricePerTola) || 0,
        note: form.note,
      })
      if (res.data.success) {
        toast.success('Gold price updated! All gold product prices recalculated.')
        setForm(function (prev) { return { ...prev, note: '' } })
        loadPrices()
      } else {
        toast.error(res.data.message || 'Failed to update price')
      }
    } catch (err) {
      console.error('Save gold price error:', err)
      toast.error('Failed to update gold price')
    } finally {
      setSaving(false)
    }
  }

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleString('en-PK', {
      day:    '2-digit',
      month:  'short',
      year:   'numeric',
      hour:   '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: '#1e1e1e', border: '1px solid #3d3d3d' }}
    >
      {/* ── Header ── */}
      <div
        className="px-5 py-4 flex items-center justify-between"
        style={{
          borderBottom: '1px solid #3d3d3d',
          background:   'rgba(212,175,55,0.04)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(212,175,55,0.12)' }}
          >
            <FiTrendingUp size={16} style={{ color: '#d4af37' }} />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">
              Gold & Silver Price Manager
            </h3>
            <p className="text-xs text-[#6b7280]">
              Update daily rates — auto-recalculates all gold product prices
            </p>
          </div>
          {currentPrice && (
            <span
              className="text-xs px-2 py-0.5 rounded-full ml-1"
              style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}
            >
              ● Live
            </span>
          )}
        </div>
        <button
          onClick={loadPrices}
          disabled={loading}
          className="p-2 rounded-lg text-[#6b7280] hover:text-white transition-colors"
          style={{ background: '#2d2d2d' }}
        >
          <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="p-5 space-y-5">

        {/* ── Current Price Cards ── */}
        {currentPrice ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                label: 'Gold / Gram',
                value: currentPrice.goldPricePerGram,
                color: '#d4af37',
                icon:  '🥇',
              },
              {
                label: 'Gold / Tola',
                value: currentPrice.goldPricePerTola,
                color: '#d4af37',
                icon:  '🥇',
              },
              {
                label: 'Silver / Gram',
                value: currentPrice.silverPricePerGram,
                color: '#9ca3af',
                icon:  '🥈',
              },
              {
                label: 'Silver / Tola',
                value: currentPrice.silverPricePerTola,
                color: '#9ca3af',
                icon:  '🥈',
              },
            ].map(function (item) {
              return (
                <div
                  key={item.label}
                  className="rounded-xl p-3 text-center"
                  style={{ background: '#242424', border: '1px solid #3d3d3d' }}
                >
                  <p className="text-lg mb-1">{item.icon}</p>
                  <p className="text-xs text-[#6b7280] mb-1">{item.label}</p>
                  <p
                    className="font-bold"
                    style={{ color: item.color, fontSize: '15px' }}
                  >
                    Rs.&nbsp;{Number(item.value || 0).toLocaleString()}
                  </p>
                </div>
              )
            })}
          </div>
        ) : (
          !loading && (
            <div
              className="rounded-xl p-4 text-center text-sm text-[#6b7280]"
              style={{ background: '#242424', border: '1px dashed #3d3d3d' }}
            >
              No gold price set yet. Set the first price below.
            </div>
          )
        )}

        {/* Last updated info */}
        {currentPrice && (
          <div className="flex items-center gap-1.5 text-xs text-[#6b7280]">
            <FiClock size={11} />
            Last updated: {formatDateTime(currentPrice.created_at)}
            {currentPrice.note && (
              <span className="ml-1 text-[#a0a0a0]">— {currentPrice.note}</span>
            )}
          </div>
        )}

        {/* ── Update Form ── */}
        <div
          className="rounded-xl p-5 space-y-4"
          style={{ background: '#242424', border: '1px solid #3d3d3d' }}
        >
          <p className="text-sm font-semibold text-[#d4af37]">
            Update Gold & Silver Prices
          </p>

          {/* Gold Section */}
          <div>
            <p className="text-xs text-[#6b7280] mb-2 uppercase tracking-wider font-medium">
              🥇 Gold (24k Base Rate)
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[#a0a0a0] mb-1.5">
                  Per Tola (Rs.)
                </label>
                <input
                  type="number"
                  value={form.goldPricePerTola}
                  onChange={function (e) { handleGoldTolaChange(e.target.value) }}
                  className="input-dark text-sm"
                  placeholder="e.g. 280000"
                  min="0"
                  step="100"
                />
                <p className="text-xs text-[#6b7280] mt-1">
                  1 Tola = 11.6638 grams
                </p>
              </div>
              <div>
                <label className="block text-xs text-[#a0a0a0] mb-1.5">
                  Per Gram (Rs.) — Auto-calculated
                </label>
                <input
                  type="number"
                  value={form.goldPricePerGram}
                  onChange={function (e) { handleGoldGramChange(e.target.value) }}
                  className="input-dark text-sm"
                  placeholder="Auto from tola"
                  min="0"
                  step="10"
                />
                <p className="text-xs text-[#6b7280] mt-1">
                  Or enter gram rate directly
                </p>
              </div>
            </div>
          </div>

          {/* Silver Section */}
          <div>
            <p className="text-xs text-[#6b7280] mb-2 uppercase tracking-wider font-medium">
              🥈 Silver (Optional)
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[#a0a0a0] mb-1.5">
                  Per Tola (Rs.)
                </label>
                <input
                  type="number"
                  value={form.silverPricePerTola}
                  onChange={function (e) { handleSilverTolaChange(e.target.value) }}
                  className="input-dark text-sm"
                  placeholder="e.g. 3500"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-xs text-[#a0a0a0] mb-1.5">
                  Per Gram (Rs.) — Auto-calculated
                </label>
                <input
                  type="number"
                  value={form.silverPricePerGram}
                  onChange={function (e) { handleSilverGramChange(e.target.value) }}
                  className="input-dark text-sm"
                  placeholder="Auto from tola"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs text-[#a0a0a0] mb-1.5">
              Note (optional)
            </label>
            <input
              type="text"
              value={form.note}
              onChange={function (e) {
                setForm(function (prev) { return { ...prev, note: e.target.value } })
              }}
              className="input-dark text-sm"
              placeholder="e.g. Sarafa Bazaar rate — 25 Jan 2025"
              maxLength={200}
            />
          </div>

          {/* Price preview */}
          {(form.goldPricePerGram || form.goldPricePerTola) && (
            <div
              className="rounded-lg p-3 text-xs"
              style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)' }}
            >
              <p className="text-[#d4af37] font-semibold mb-1.5">📊 Karat Rates Preview</p>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {['24k', '22k', '21k', '18k', '16k'].map(function (k) {
                  var karatNum = parseInt(k)
                  var purity   = karatNum / 24
                  var rate     = (parseFloat(form.goldPricePerGram) || 0) * purity
                  return (
                    <div key={k} className="text-center">
                      <p className="text-[#6b7280]">{k}</p>
                      <p className="text-white font-medium">
                        Rs.&nbsp;{Math.round(rate).toLocaleString()}/g
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-gold w-full py-3.5 flex items-center justify-center gap-2 font-semibold"
          >
            {saving ? (
              <>
                <div
                  className="w-4 h-4 rounded-full border-2 animate-spin"
                  style={{ borderColor: '#1a1a1a', borderTopColor: 'transparent' }}
                />
                Updating & Recalculating All Gold Products...
              </>
            ) : (
              <>
                <FiCheck size={16} />
                Update Gold Price & Recalculate Products
              </>
            )}
          </button>

          <p className="text-xs text-center text-[#6b7280]">
            Saving will automatically recalculate prices for all gold products
            based on their karat, weight, and making charges.
          </p>
        </div>

        {/* ── Price History ── */}
        <div>
          <button
            onClick={function () { setShowHistory(function (s) { return !s }) }}
            className="flex items-center gap-2 text-sm text-[#a0a0a0] hover:text-white transition-colors w-full"
          >
            <FiClock size={13} style={{ color: '#d4af37' }} />
            Price History ({history.length} entries)
            {showHistory
              ? <FiChevronUp size={14} className="ml-auto" />
              : <FiChevronDown size={14} className="ml-auto" />}
          </button>

          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-3 space-y-2 max-h-80 overflow-y-auto pr-1">
                  {history.length === 0 ? (
                    <p className="text-xs text-[#6b7280] text-center py-4">
                      No price history yet
                    </p>
                  ) : (
                    history.map(function (h, i) {
                      return (
                        <div
                          key={h.id || i}
                          className="flex items-start justify-between p-3 rounded-xl gap-3"
                          style={{ background: '#2d2d2d', border: '1px solid #3d3d3d' }}
                        >
                          <div className="min-w-0">
                            <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                              <span className="text-sm text-white font-medium">
                                🥇 Rs.&nbsp;{Number(h.goldPricePerGram || 0).toLocaleString()}/g
                              </span>
                              <span className="text-sm text-[#a0a0a0]">
                                Rs.&nbsp;{Number(h.goldPricePerTola || 0).toLocaleString()}/tola
                              </span>
                              {h.silverPricePerGram > 0 && (
                                <span className="text-sm text-[#6b7280]">
                                  🥈 Rs.&nbsp;{Number(h.silverPricePerGram || 0).toLocaleString()}/g
                                </span>
                              )}
                            </div>
                            {h.note && (
                              <p className="text-xs text-[#6b7280] mt-0.5 truncate">
                                {h.note}
                              </p>
                            )}
                          </div>
                          <p className="text-xs text-[#6b7280] flex-shrink-0 text-right">
                            {formatDateTime(h.created_at)}
                          </p>
                        </div>
                      )
                    })
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default GoldPriceManager