import { createContext, useContext, useState, useEffect } from 'react'
import { settingsApi } from '../api/settingsApi.js'

const SettingsContext = createContext(null)

const defaultSettings = {
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '923184887631',
  easypaisaNumber: '03184887631',
  easypaisaName: 'MEERAB TARIQ',
  bankName: 'UBL Bank Limited',
  bankAccountNumber: 'no account number use Iban instead',
  bankAccountTitle: 'Meerab Tariq',
  bankIBAN: 'PK61UNIL0109000336862358',
  deliveryCharges: 250,
  freeDeliveryAbove: 3000,
  currency: 'Rs.',
  storeName: 'MeerabLuxe Jewellers',
  storePhone: '+923454777588',
  storeEmail: 'meerabluxejewellers@gmail.com',
  storeAddress: 'Sarafa Bazaar, Haji Baba Chowk, Mingora, Swat, Pakistan',
}

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings)
  const [settingsLoading, setSettingsLoading] = useState(true)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const res = await settingsApi.getPublic()
      if (res.data.success && res.data.settings) {
        setSettings(prev => ({ ...prev, ...res.data.settings }))
      }
    } catch (error) {
      console.error('Settings load error:', error)
      // Keep defaults
    } finally {
      setSettingsLoading(false)
    }
  }

  const refreshSettings = () => loadSettings()

  // ✅ Helper: format price
  const formatPrice = (amount) => {
    const currency = settings.currency || 'Rs.'
    return `${currency} ${Number(amount).toLocaleString('en-PK')}`
  }

  // ✅ Helper: WhatsApp link
  const getWhatsAppLink = (message = '') => {
    const number = settings.whatsappNumber?.replace(/[^0-9]/g, '') || '923184887631'
    const encoded = encodeURIComponent(message)
    return `https://wa.me/${number}?text=${encoded}`
  }

  // ✅ Helper: delivery info
  const getDeliveryInfo = (subtotal) => {
    const charges = Number(settings.deliveryCharges) || 250
    const freeAbove = Number(settings.freeDeliveryAbove) || 3000
    const isFree = subtotal >= freeAbove
    return {
      charges: isFree ? 0 : charges,
      isFree,
      freeAbove,
      displayCharges: isFree ? 'FREE' : `${settings.currency} ${charges}`,
    }
  }

  const value = {
    settings,
    settingsLoading,
    refreshSettings,
    formatPrice,
    getWhatsAppLink,
    getDeliveryInfo,
  }

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (!context) throw new Error('useSettings must be used within SettingsProvider')
  return context
}

export default SettingsContext