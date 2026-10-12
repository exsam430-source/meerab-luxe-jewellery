import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  FiSave, FiRefreshCw, FiSettings,
  FiDollarSign, FiTruck, FiPhone,
} from 'react-icons/fi'
import { settingsApi } from '../../../api/settingsApi.js'
import { useSettings } from '../../../context/SettingsContext.jsx'
import toast from 'react-hot-toast'

const SETTING_GROUPS = [
  {
    id: 'store',
    title: 'Store Information',
    icon: FiSettings,
    color: '#d4af37',
    fields: [
      { key: 'storeName',    label: 'Store Name',    type: 'text',     placeholder: 'MeerabLuxe Jewellers' },
      { key: 'storeEmail',   label: 'Store Email',   type: 'email',    placeholder: 'meerabluxejewellers@gmail.com' },
      { key: 'storePhone',   label: 'Store Phone',   type: 'tel',      placeholder: '+923454777588' },
      { key: 'storeAddress', label: 'Store Address', type: 'textarea', placeholder: 'Sarafa Bazaar, Haji Baba Chowk, Mingora, Swat, Pakistan' },
    ],
  },
  {
    id: 'payment',
    title: 'Payment Settings',
    icon: FiDollarSign,
    color: '#10b981',
    fields: [
      { key: 'easypaisaNumber',    label: 'Easypaisa Number',       type: 'text', placeholder: '03184887631' },
      { key: 'easypaisaName',      label: 'Easypaisa Account Name', type: 'text', placeholder: 'MEERAB TARIQ' },
      { key: 'bankName',           label: 'Bank Name',              type: 'text', placeholder: 'UBL Bank Limited' },
      { key: 'bankAccountNumber',  label: 'Bank Account Number',    type: 'text', placeholder: '08040107780713' },
      { key: 'bankAccountTitle',   label: 'Bank Account Title',     type: 'text', placeholder: 'Meerab Tariq' },
      { key: 'bankIBAN',           label: 'Bank IBAN',              type: 'text', placeholder: 'PK61UNIL0109000336862358' },
    ],
  },
  {
    id: 'delivery',
    title: 'Delivery Settings',
    icon: FiTruck,
    color: '#3b82f6',
    fields: [
      { key: 'deliveryCharges',   label: 'Delivery Charges (Rs.)',    type: 'number', placeholder: '250' },
      { key: 'freeDeliveryAbove', label: 'Free Delivery Above (Rs.)', type: 'number', placeholder: '3000' },
      { key: 'currency',          label: 'Currency Symbol',           type: 'text',   placeholder: 'Rs.' },
    ],
  },
  {
    id: 'whatsapp',
    title: 'WhatsApp Settings',
    icon: FiPhone,
    color: '#25d366',
    fields: [
      { key: 'whatsappNumber', label: 'WhatsApp Number (with country code)', type: 'text', placeholder: '+923184887631' },
    ],
  },
]

const StoreSettings = () => {
  const { refreshSettings } = useSettings()
  const [values,  setValues]  = useState({})
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const res = await settingsApi.getAll()
      if (res.data.success) {
        const settingsObj = {}
        const allSettings = res.data.settings || []

        if (Array.isArray(allSettings)) {
          allSettings.forEach(s => {
            settingsObj[s.key] = s.value
          })
        } else if (typeof allSettings === 'object') {
          Object.assign(settingsObj, allSettings)
        }

        setValues(settingsObj)
      }
    } catch (error) {
      toast.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (key, value) => {
    setValues(prev => ({ ...prev, [key]: value }))
  }

  const handleSaveGroup = async (groupId) => {
    const group = SETTING_GROUPS.find(g => g.id === groupId)
    if (!group) return

    setSaving(true)
    try {
      const settings = {}
      group.fields.forEach(f => {
        if (values[f.key] !== undefined) {
          settings[f.key] = f.type === 'number'
            ? Number(values[f.key])
            : values[f.key]
        }
      })

      const res = await settingsApi.updateMultiple(settings)
      if (res.data.success) {
        toast.success(`${group.title} saved! ✅`)
        refreshSettings()
      } else {
        toast.error(res.data.message || 'Save failed')
      }
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveAll = async () => {
    setSaving(true)
    try {
      const allSettings = {}
      SETTING_GROUPS.forEach(group => {
        group.fields.forEach(f => {
          if (values[f.key] !== undefined && values[f.key] !== '') {
            allSettings[f.key] = f.type === 'number'
              ? Number(values[f.key])
              : values[f.key]
          }
        })
      })

      const res = await settingsApi.updateMultiple(allSettings)
      if (res.data.success) {
        toast.success('All settings saved successfully! ✅')
        refreshSettings()
      } else {
        toast.error(res.data.message || 'Save failed')
      }
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="font-playfair font-bold text-white"
            style={{ fontSize: 'clamp(20px, 3vw, 26px)' }}
          >
            Store Settings
          </h1>
          <p className="text-[#6b7280] text-sm mt-0.5">
            Manage your store configuration
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadSettings}
            disabled={loading}
            className="p-2 rounded-lg text-[#a0a0a0] hover:text-white hover:bg-[#2d2d2d] transition-colors"
          >
            <FiRefreshCw
              size={16}
              className={loading ? 'animate-spin' : ''}
            />
          </button>
          <button
            onClick={handleSaveAll}
            disabled={saving || loading}
            className="btn-gold flex items-center gap-2 text-sm"
          >
            {saving ? (
              <div
                className="w-4 h-4 rounded-full border-2 animate-spin"
                style={{ borderColor: '#1a1a1a', borderTopColor: 'transparent' }}
              />
            ) : (
              <FiSave size={15} />
            )}
            Save All
          </button>
        </div>
      </div>

      {/* Settings Groups */}
      {SETTING_GROUPS.map((group, gi) => {
        const Icon = group.icon
        return (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: gi * 0.08 }}
            className="card-dark rounded-2xl overflow-hidden"
          >
            {/* Group Header */}
            <div
              className="flex items-center justify-between px-5 py-4 border-b"
              style={{ borderColor: '#3d3d3d' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: `${group.color}15` }}
                >
                  <Icon size={16} style={{ color: group.color }} />
                </div>
                <h2 className="font-semibold text-white">{group.title}</h2>
              </div>
              <button
                onClick={() => handleSaveGroup(group.id)}
                disabled={saving}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: `${group.color}15`,
                  color: group.color,
                  border: `1px solid ${group.color}30`,
                }}
              >
                <FiSave size={13} />
                Save
              </button>
            </div>

            {/* Fields */}
            <div className="p-5 space-y-4">
              {loading ? (
                <div className="space-y-3">
                  {group.fields.map((_, i) => (
                    <div key={i} className="skeleton h-10 rounded-xl" />
                  ))}
                </div>
              ) : (
                group.fields.map(field => (
                  <div key={field.key}>
                    <label className="block text-sm text-[#a0a0a0] mb-1">
                      {field.label}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        value={values[field.key] || ''}
                        onChange={e => handleChange(field.key, e.target.value)}
                        className="input-dark resize-none"
                        rows={3}
                        placeholder={field.placeholder}
                      />
                    ) : (
                      <input
                        type={field.type}
                        value={values[field.key] || ''}
                        onChange={e => handleChange(field.key, e.target.value)}
                        className="input-dark"
                        placeholder={field.placeholder}
                      />
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )
      })}

      {/* Save All Button (bottom) */}
      <div className="flex justify-end pb-6">
        <button
          onClick={handleSaveAll}
          disabled={saving || loading}
          className="btn-gold flex items-center gap-2 px-8 py-3"
        >
          {saving ? (
            <div
              className="w-5 h-5 rounded-full border-2 animate-spin"
              style={{ borderColor: '#1a1a1a', borderTopColor: 'transparent' }}
            />
          ) : (
            <FiSave size={18} />
          )}
          Save All Settings
        </button>
      </div>
    </div>
  )
}

export default StoreSettings