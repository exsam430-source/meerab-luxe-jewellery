import { SITE_URL, STORE_NAME, CURRENCY } from './constants.js'

// ✅ Format price
export const formatPrice = (amount) => {
  return `${CURRENCY} ${Number(amount || 0).toLocaleString('en-PK')}`
}

// ✅ Calculate discount percentage
export const getDiscountPercent = (price, comparePrice) => {
  if (!comparePrice || comparePrice <= price) return 0
  return Math.round(((comparePrice - price) / comparePrice) * 100)
}

// ✅ Generate WhatsApp link
export const generateWhatsAppLink = (number, message) => {
  const clean = (number || '923184887631').replace(/[^0-9]/g, '')
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`
}

// ✅ Generate product WhatsApp message
export const generateProductWhatsAppMessage = (product, settings) => {
  const price = formatPrice(product.price)
  const url = `${SITE_URL}/product/${product._id || product.id}`
  return `Hello! I'm interested in this product:\n\n*${product.name}*\nPrice: ${price}\nLink: ${url}\n\nPlease share availability and delivery details.`
}

// ✅ Generate order WhatsApp message
export const generateOrderWhatsAppMessage = (items, total, address, settings) => {
  let msg = `*New Order - ${STORE_NAME}*\n\n`
  msg += `*Items:*\n`
  items.forEach(item => {
    msg += `• ${item.name} x${item.quantity} = ${formatPrice(item.price * item.quantity)}\n`
  })
  msg += `\n*Total: ${formatPrice(total)}*\n`
  msg += `\n*Delivery Address:*\n${address.firstName} ${address.lastName}\n${address.street}, ${address.city}\nPhone: ${address.phone}`
  return msg
}

// ✅ Cloudinary image optimization
export const getOptimizedImageUrl = (url, width = 400, quality = 80) => {
  if (!url || !url.includes('cloudinary')) return url || ''
  return url.replace('/upload/', `/upload/w_${width},q_${quality},f_auto/`)
}

// ✅ Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

// ✅ Format date
export const formatDate = (dateInput) => {
  if (!dateInput) return 'N/A'
  const date = new Date(typeof dateInput === 'number' ? dateInput : dateInput)
  if (isNaN(date.getTime())) return 'N/A'
  return date.toLocaleDateString('en-PK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// ✅ Format date with time
export const formatDateTime = (dateInput) => {
  if (!dateInput) return 'N/A'
  const date = new Date(typeof dateInput === 'number' ? dateInput : dateInput)
  if (isNaN(date.getTime())) return 'N/A'
  return date.toLocaleString('en-PK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// ✅ Get order status color
export const getStatusColor = (status) => {
  const colors = {
    'Order Placed':      'text-blue-400 bg-blue-400/10 border-blue-400/30',
    'Payment Pending':   'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
    'Payment Verified':  'text-green-400 bg-green-400/10 border-green-400/30',
    'Processing':        'text-purple-400 bg-purple-400/10 border-purple-400/30',
    'Shipped':           'text-cyan-400 bg-cyan-400/10 border-cyan-400/30',
    'Out for Delivery':  'text-orange-400 bg-orange-400/10 border-orange-400/30',
    'Delivered':         'text-green-400 bg-green-400/10 border-green-400/30',
    'Cancelled':         'text-red-400 bg-red-400/10 border-red-400/30',
    'Returned':          'text-gray-400 bg-gray-400/10 border-gray-400/30',
  }
  return colors[status] || 'text-gray-400 bg-gray-400/10 border-gray-400/30'
}

// ✅ Get return status color
export const getReturnStatusColor = (status) => {
  const colors = {
    'pending':            'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
    'approved':           'text-green-400 bg-green-400/10 border-green-400/30',
    'rejected':           'text-red-400 bg-red-400/10 border-red-400/30',
    'shipped':            'text-blue-400 bg-blue-400/10 border-blue-400/30',
    'received':           'text-purple-400 bg-purple-400/10 border-purple-400/30',
    'refund_processing':  'text-orange-400 bg-orange-400/10 border-orange-400/30',
    'completed':          'text-green-400 bg-green-400/10 border-green-400/30',
    'cancelled':          'text-gray-400 bg-gray-400/10 border-gray-400/30',
  }
  return colors[status] || 'text-gray-400 bg-gray-400/10 border-gray-400/30'
}

// ✅ Slugify text for URLs
export const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// ✅ Calculate average rating
export const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0
  const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0)
  return Math.round((sum / reviews.length) * 10) / 10
}

// ✅ Render stars array
export const getStarsArray = (rating) => {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5 ? 1 : 0
  const empty = 5 - full - half
  return { full, half, empty }
}

// ✅ Validate Pakistan phone
export const validatePakistaniPhone = (phone) => {
  const regex = /^(\+92|0)?[0-9]{10}$/
  return regex.test(phone.replace(/\s|-/g, ''))
}

// ✅ Validate email
export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}