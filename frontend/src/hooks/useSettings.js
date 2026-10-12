import { useSettings as useSettingsContext } from '../context/SettingsContext.jsx'
import { formatPrice as formatPriceUtil } from '../utils/formatPrice.js'

// ✅ Enhanced useSettings hook
const useSettings = () => {
  const context = useSettingsContext()

  const {
    settings,
    settingsLoading,
    refreshSettings,
    formatPrice,
    getWhatsAppLink,
    getDeliveryInfo,
  } = context

  // ✅ Get WhatsApp number (clean)
  const getWhatsAppNumber = () => {
    return settings?.whatsappNumber || '923184887631'
  }

  // ✅ Get store info
  const getStoreInfo = () => ({
    name: settings?.storeName || 'MeerabLuxe Jewellers',
    phone: settings?.storePhone || '+923454777588',
    email: settings?.storeEmail || 'meerabluxejewellers@gmail.com',
    address: settings?.storeAddress || 'Sarafa Bazaar, Haji Baba Chowk, Mingora, Swat, Pakistan',
    whatsapp: settings?.whatsappNumber || '923184887631',
  })

  // ✅ Get payment info
  const getPaymentInfo = () => ({
    easypaisa: {
      number: settings?.easypaisaNumber || '03184887631',
      name: settings?.easypaisaName || 'MEERAB TARIQ',
    },
    bank: {
      name: settings?.bankName || 'UBL Bank Limited',
      accountNumber: settings?.bankAccountNumber || 'no account number use Iban instead',
      accountTitle: settings?.bankAccountTitle || 'Meerab Tariq',
      iban: settings?.bankIBAN || 'PK61UNIL0109000336862358',
    },
  })

  // ✅ Get delivery info with subtotal
  const getDeliveryDetails = (subtotal = 0) => {
    const charges = Number(settings?.deliveryCharges) || 250
    const freeAbove = Number(settings?.freeDeliveryAbove) || 3000
    const isFree = Number(subtotal) >= freeAbove
    const amount = isFree ? 0 : charges
    const remaining = isFree ? 0 : freeAbove - Number(subtotal)

    return {
      charges,
      freeAbove,
      isFree,
      amount,
      remaining,
      displayCharges: isFree ? 'FREE' : formatPriceUtil(charges),
      displayFreeAbove: formatPriceUtil(freeAbove),
    }
  }

  // ✅ Format price with store currency
  const formatStorePrice = (amount) => {
    const currency = settings?.currency || 'Rs.'
    return `${currency} ${Number(amount || 0).toLocaleString('en-PK')}`
  }

  return {
    settings,
    settingsLoading,
    refreshSettings,
    formatPrice: formatStorePrice,
    getWhatsAppLink,
    getDeliveryInfo: getDeliveryDetails,
    getWhatsAppNumber,
    getStoreInfo,
    getPaymentInfo,
  }
}

// ✅ Both exports — fixes all import styles
export { useSettings }
export default useSettings