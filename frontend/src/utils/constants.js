export const CATEGORIES = ['Ladies', 'Groom', 'Customize']

export const LADIES_SUBCATEGORIES = [
  'Necklaces', 'Earrings', 'Bangles', 'Bracelets',
  'Rings', 'Anklets', 'Bridal Sets', 'Kundan',
  'Maang Tikka', 'Nose Pins', 'Hair Accessories'
]

export const GROOM_SUBCATEGORIES = [
  'Sherwani Buttons', 'Kullah/Pagri Brooches', 'Mala/Haar',
  'Rings', 'Bracelets', 'Chains', 'Cufflinks',
  'Sehra', 'Kalgi', 'Dupatta Brooches'
]

// ✅ Keep for backward compatibility (old code might use this)
export const GENTS_SUBCATEGORIES = GROOM_SUBCATEGORIES

export const MATERIALS = [
  'Artificial Gold Plated',
  'Rose Gold Plated',
  'Silver Plated',
  'Kundan',
  'Meena Work',
  'Stone Studded',
  'Pearl',
  'Oxidized'
]

export const ORDER_STATUSES = [
  'Order Placed',
  'Payment Pending',
  'Payment Verified',
  'Processing',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
  'Returned'
]

export const PAYMENT_METHODS = [
  { id: 'COD',          label: 'Cash on Delivery',    icon: '💵' },
  { id: 'Easypaisa',    label: 'Easypaisa',            icon: '📱' },
  { id: 'BankTransfer', label: 'Bank Transfer',        icon: '🏦' },
  { id: 'WhatsApp',     label: 'Order via WhatsApp',   icon: '💬' },
]

export const RETURN_REASONS = [
  'Defective/Damaged item',
  'Wrong item received',
  'Not as described',
  'Size/Color mismatch',
  'Quality not satisfactory',
  'Changed my mind',
  'Other'
]

export const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://www.meerabluxejewellers.pk'
export const STORE_NAME = import.meta.env.VITE_STORE_NAME || 'MeerabLuxe Jewellers'
export const CURRENCY = import.meta.env.VITE_CURRENCY || 'Rs.'
export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '923184887631'
export const FREE_DELIVERY_ABOVE = Number(import.meta.env.VITE_FREE_DELIVERY_ABOVE) || 3000
export const DELIVERY_CHARGES = Number(import.meta.env.VITE_DELIVERY_CHARGES) || 250