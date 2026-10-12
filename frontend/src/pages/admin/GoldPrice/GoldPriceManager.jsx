// src/pages/admin/GoldPrice/GoldPriceManager.jsx

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  FiTrendingUp, FiSave, FiRefreshCw,
  FiClock, FiDollarSign, FiInfo
} from 'react-icons/fi'
import { goldPriceApi } from '../../../api/goldPriceApi.js'
import toast from 'react-hot-toast'

const GoldPriceManager = () => {
  const [latest,   setLatest]   = useState(null)
  const [history,  setHistory]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [form,     setForm]     = useState({
    goldPricePerGram:   '',
    goldPricePerTola:   '',
    silverPricePerGram: '',
    silverPricePerTola: '',
    note:               '',
  })
  const [calculator, setCalculator] = useState({
    karat:         '22k',
    weightGrams:   '',
    makingCharges: '',
    stoneCost:     '',
    result:        null,
  })

  useEffect(() => {
    loadData()
  }, [])

  // ── Auto-calculate tola when gram changes ──────────────────────────
  const handleGoldGramChange = (value) => {
    setForm(prev => ({
      ...prev,
      goldPricePerGram: value,
      goldPricePerTola: value
        ? String(Math.round(parseFloat(value) * 11.6638))
        : '',
    }))
  }

  const handleGoldTolaChange = (value) => {
    setForm(prev => ({
      ...prev,
      goldPricePerTola: value,
      goldPricePerGram: value
        ? String((parseFloat(value) / 11.6638).toFixed(2))
        : '',
    }))
  }

  const handleSilverGramChange = (value) => {
    setForm(prev => ({
      ...prev,
      silverPricePerGram: value,
      silverPricePerTola: value
        ? String(Math.round(parseFloat(value) * 11.6638))
        : '',
    }))
  }

  // ── Load latest price + history ────────────────────────────────────
  const loadData = async () => {
    setLoading(true)
    try {
      const [latestRes, historyRes] = await Promise.all([
        goldPriceApi.getLatest(),
        goldPriceApi.getHistory(10),
      ])

      if (latestRes.data.success && latestRes.data.goldPrice) {
        const gp = latestRes.data.goldPrice
        setLatest(gp)
        // Pre-fill form with current values
        setForm({
          goldPricePerGram:   String(gp.goldPricePerGram   || ''),
          goldPricePerTola:   String(gp.goldPricePerTola   || ''),
          silverPricePerGram: String(gp.silverPricePerGram || ''),
          silverPricePerTola: String(gp.silverPricePerTola || ''),
          note: '',
        })
      }

      if (historyRes.data.success) {
        setHistory(historyRes.data.history || [])
      }
    } catch (err) {
      toast.error('Failed to load gold price data')
    } finally {
      setLoading(false)
    }
  }

  // ── Save new gold price ────────────────────────────────────────────
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
        toast.success('Gold price updated! All product prices recalculated ✅')
        setForm(prev => ({ ...prev, note: '' }))
        loadData()
      } else {
        toast.error(res.data.message || 'Failed to update')
      }
    } catch (err) {
      toast.error('Failed to update gold price')
    } finally {
      setSaving(false)
    }
  }

  // ── Live calculator ────────────────────────────────────────────────
  const handleCalculate = async () => {
    if (!calculator.weightGrams) {
      toast.error('Please enter weight in grams')
      return
    }
    try {
      const res = await goldPriceApi.calculate({
        karat:         calculator.karat,
        weightGrams:   calculator.weightGrams,
        makingCharges: calculator.makingCharges || 0,
        stoneCost:     calculator.stoneCost     || 0,
      })
      if (res.data.success) {
        setCalculator(prev => ({
          ...prev,
          result: res.data.calculatedPrice,
        }))
      }
    } catch (err) {
      toast.error('Calculation failed')
    }
  }

  const KARAT_OPTIONS = [
    '24k','23k','22k','21k','20k',
    '19k','18k','17k','16k',
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="font-playfair font-bold text-white"
            style={{ fontSize: 'clamp(20px, 3vw, 26px)' }}
          >
            Gold Price Manager
          </h1>
          <p className="text-[#6b7280] text-sm mt-0.5">
            Update daily gold rates — all product prices auto-recalculate
          </p>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="p-2 rounded-lg text-[#a0a0a0] hover:text-white hover:bg-[#2d2d2d] transition-colors"
        >
          <FiRefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* ── Current Rate Banner ── */}
      {latest && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y:  0 }}
          className="rounded-2xl p-5 flex flex-wrap gap-6 items-center"
          style={{
            background: 'rgba(212,175,55,0.06)',
            border:     '1px solid rgba(212,175,55,0.2)',
          }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-[#a0a0a0] font-medium uppercase tracking-wider">
              Current Rate
            </span>
          </div>

          <div className="flex flex-wrap gap-6">
            <div>
              <p className="text-xs text-[#6b7280]">Gold / Gram (24k)</p>
              <p className="font-bold text-[#d4af37] text-xl">
                Rs. {Number(latest.goldPricePerGram).toLocaleString()}
              </p>
            </div>
            <div className="w-px bg-[#3d3d3d]" />
            <div>
              <p className="text-xs text-[#6b7280]">Gold / Tola (24k)</p>
              <p className="font-bold text-[#d4af37] text-xl">
                Rs. {Number(latest.goldPricePerTola).toLocaleString()}
              </p>
            </div>
            {latest.silverPricePerGram > 0 && (
              <>
                <div className="w-px bg-[#3d3d3d]" />
                <div>
                  <p className="text-xs text-[#6b7280]">Silver / Gram</p>
                  <p className="font-bold text-[#9ca3af] text-xl">
                    Rs. {Number(latest.silverPricePerGram).toLocaleString()}
                  </p>
                </div>
              </>
            )}
          </div>

          {latest.created_at && (
            <div className="ml-auto flex items-center gap-1.5 text-xs text-[#6b7280]">
              <FiClock size={12} />
              Last updated:{' '}
              {new Date(latest.created_at).toLocaleString('en-PK', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </div>
          )}
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Update Gold Price Form ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y:  0 }}
          className="card-dark rounded-2xl overflow-hidden"
        >
          {/* Card Header */}
          <div
            className="flex items-center gap-3 px-5 py-4 border-b"
            style={{ borderColor: '#3d3d3d' }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(212,175,55,0.15)' }}
            >
              <FiTrendingUp size={16} style={{ color: '#d4af37' }} />
            </div>
            <h2 className="font-semibold text-white">Update Gold Rate</h2>
          </div>

          <div className="p-5 space-y-4">

            {/* Info Box */}
            <div
              className="flex items-start gap-2 p-3 rounded-xl text-xs"
              style={{
                background: 'rgba(59,130,246,0.08)',
                border:     '1px solid rgba(59,130,246,0.2)',
                color:      '#93c5fd',
              }}
            >
              <FiInfo size={14} className="flex-shrink-0 mt-0.5" />
              <span>
                Enter either gram or tola price — the other will auto-calculate.
                Saving will recalculate <strong>all gold product prices</strong> automatically.
              </span>
            </div>

            {/* Gold Prices */}
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-3"
                style={{ color: '#d4af37' }}
              >
                Gold Prices (24k base)
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-[#a0a0a0] mb-1">
                    Per Gram (Rs.)
                  </label>
                  <input
                    type="number"
                    value={form.goldPricePerGram}
                    onChange={e => handleGoldGramChange(e.target.value)}
                    className="input-dark"
                    placeholder="e.g. 22000"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#a0a0a0] mb-1">
                    Per Tola (Rs.)
                  </label>
                  <input
                    type="number"
                    value={form.goldPricePerTola}
                    onChange={e => handleGoldTolaChange(e.target.value)}
                    className="input-dark"
                    placeholder="e.g. 256500"
                  />
                </div>
              </div>
            </div>

            {/* Silver Prices */}
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-3"
                style={{ color: '#9ca3af' }}
              >
                Silver Prices (optional)
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-[#a0a0a0] mb-1">
                    Per Gram (Rs.)
                  </label>
                  <input
                    type="number"
                    value={form.silverPricePerGram}
                    onChange={e => handleSilverGramChange(e.target.value)}
                    className="input-dark"
                    placeholder="e.g. 280"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#a0a0a0] mb-1">
                    Per Tola (Rs.)
                  </label>
                  <input
                    type="number"
                    value={form.silverPricePerTola}
                    onChange={e =>
                      setForm(prev => ({ ...prev, silverPricePerTola: e.target.value }))
                    }
                    className="input-dark"
                    placeholder="e.g. 3265"
                  />
                </div>
              </div>
            </div>

            {/* Note */}
            <div>
              <label className="block text-sm text-[#a0a0a0] mb-1">
                Note (optional)
              </label>
              <input
                type="text"
                value={form.note}
                onChange={e => setForm(prev => ({ ...prev, note: e.target.value }))}
                className="input-dark"
                placeholder="e.g. Sarafa market rate 25 Jan"
              />
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-gold w-full flex items-center justify-center gap-2 py-3"
            >
              {saving ? (
                <div
                  className="w-5 h-5 rounded-full border-2 animate-spin"
                  style={{ borderColor: '#1a1a1a', borderTopColor: 'transparent' }}
                />
              ) : (
                <FiSave size={16} />
              )}
              {saving ? 'Updating & Recalculating...' : 'Update Gold Price'}
            </button>
          </div>
        </motion.div>

        {/* ── Price Calculator ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y:  0 }}
          transition={{ delay: 0.1 }}
          className="card-dark rounded-2xl overflow-hidden"
        >
          <div
            className="flex items-center gap-3 px-5 py-4 border-b"
            style={{ borderColor: '#3d3d3d' }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(16,185,129,0.15)' }}
            >
              <FiDollarSign size={16} style={{ color: '#10b981' }} />
            </div>
            <h2 className="font-semibold text-white">Price Calculator</h2>
          </div>

          <div className="p-5 space-y-4">
            <p className="text-xs text-[#6b7280]">
              Calculate how much a gold product would cost based on current rates.
            </p>

            {/* Karat */}
            <div>
              <label className="block text-sm text-[#a0a0a0] mb-2">Karat</label>
              <div className="flex flex-wrap gap-2">
                {KARAT_OPTIONS.map(k => (
                  <button
                    key={k}
                    onClick={() =>
                      setCalculator(prev => ({ ...prev, karat: k, result: null }))
                    }
                    className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                    style={{
                      background: calculator.karat === k ? '#d4af37' : '#2d2d2d',
                      color:      calculator.karat === k ? '#1a1a1a' : '#a0a0a0',
                      border:     `1px solid ${calculator.karat === k ? '#d4af37' : '#3d3d3d'}`,
                    }}
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>

            {/* Weight */}
            <div>
              <label className="block text-sm text-[#a0a0a0] mb-1">
                Weight (grams)
              </label>
              <input
                type="number"
                value={calculator.weightGrams}
                onChange={e =>
                  setCalculator(prev => ({
                    ...prev,
                    weightGrams: e.target.value,
                    result: null,
                  }))
                }
                className="input-dark"
                placeholder="e.g. 5.5"
                step="0.01"
              />
            </div>

            {/* Making Charges + Stone Cost */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-[#a0a0a0] mb-1">
                  Making Charges (Rs.)
                </label>
                <input
                  type="number"
                  value={calculator.makingCharges}
                  onChange={e =>
                    setCalculator(prev => ({
                      ...prev,
                      makingCharges: e.target.value,
                      result: null,
                    }))
                  }
                  className="input-dark"
                  placeholder="e.g. 2000"
                />
              </div>
              <div>
                <label className="block text-sm text-[#a0a0a0] mb-1">
                  Stone Cost (Rs.)
                </label>
                <input
                  type="number"
                  value={calculator.stoneCost}
                  onChange={e =>
                    setCalculator(prev => ({
                      ...prev,
                      stoneCost: e.target.value,
                      result: null,
                    }))
                  }
                  className="input-dark"
                  placeholder="e.g. 500"
                />
              </div>
            </div>

            {/* Calculate Button */}
            <button
              onClick={handleCalculate}
              className="w-full py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{
                background: 'rgba(16,185,129,0.1)',
                color:      '#10b981',
                border:     '1px solid rgba(16,185,129,0.25)',
              }}
            >
              Calculate Price
            </button>

            {/* Result */}
            {calculator.result !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-xl p-4 text-center"
                style={{
                  background: 'rgba(212,175,55,0.08)',
                  border:     '1px solid rgba(212,175,55,0.25)',
                }}
              >
                <p className="text-xs text-[#6b7280] mb-1">
                  Estimated Price ({calculator.karat} · {calculator.weightGrams}g)
                </p>
                <p className="text-2xl font-bold text-[#d4af37]">
                  Rs. {Number(calculator.result).toLocaleString()}
                </p>
                <p className="text-xs text-[#6b7280] mt-1">
                  Based on current gold rate
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* ── Price History ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y:  0 }}
        transition={{ delay: 0.2 }}
        className="card-dark rounded-2xl overflow-hidden"
      >
        <div
          className="flex items-center gap-3 px-5 py-4 border-b"
          style={{ borderColor: '#3d3d3d' }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(212,175,55,0.15)' }}
          >
            <FiClock size={16} style={{ color: '#d4af37' }} />
          </div>
          <h2 className="font-semibold text-white">Price History</h2>
          <span
            className="ml-auto text-xs px-2 py-0.5 rounded-full"
            style={{
              background: 'rgba(212,175,55,0.1)',
              color:      '#d4af37',
            }}
          >
            Last 10 entries
          </span>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-5 space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton h-10 rounded-xl" />
              ))}
            </div>
          ) : history.length === 0 ? (
            <div className="p-8 text-center text-[#6b7280] text-sm">
              No price history yet
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid #3d3d3d' }}>
                  {['Date & Time', 'Gold/Gram', 'Gold/Tola', 'Silver/Gram', 'Note'].map(h => (
                    <th
                      key={h}
                      className="text-left px-5 py-3 text-xs font-medium text-[#6b7280] uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {history.map((row, i) => (
                  <tr
                    key={row.id || i}
                    style={{
                      borderBottom: '1px solid #2d2d2d',
                      background:   i === 0 ? 'rgba(212,175,55,0.04)' : 'transparent',
                    }}
                  >
                    <td className="px-5 py-3 text-[#a0a0a0] whitespace-nowrap">
                      {i === 0 && (
                        <span
                          className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full mr-2"
                          style={{
                            background: 'rgba(16,185,129,0.1)',
                            color:      '#10b981',
                          }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                          Current
                        </span>
                      )}
                      {new Date(row.created_at).toLocaleString('en-PK', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </td>
                    <td className="px-5 py-3 font-medium text-[#d4af37]">
                      Rs. {Number(row.goldPricePerGram).toLocaleString()}
                    </td>
                    <td className="px-5 py-3 font-medium text-[#d4af37]">
                      Rs. {Number(row.goldPricePerTola).toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-[#9ca3af]">
                      {row.silverPricePerGram > 0
                        ? `Rs. ${Number(row.silverPricePerGram).toLocaleString()}`
                        : '—'}
                    </td>
                    <td className="px-5 py-3 text-[#6b7280] italic">
                      {row.note || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default GoldPriceManager