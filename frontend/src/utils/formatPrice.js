import { CURRENCY } from './constants.js'

// ✅ Format price with currency
export const formatPrice = (amount, currency = null) => {
  const curr = currency || CURRENCY
  const num = Number(amount) || 0
  return `${curr} ${num.toLocaleString('en-PK')}`
}

// ✅ Format price without currency symbol
export const formatNumber = (amount) => {
  return Number(amount || 0).toLocaleString('en-PK')
}

// ✅ Get discount percentage
export const getDiscountPercent = (price, comparePrice) => {
  if (!comparePrice || Number(comparePrice) <= Number(price)) return 0
  const discount = ((Number(comparePrice) - Number(price)) / Number(comparePrice)) * 100
  return Math.round(discount)
}

// ✅ Get savings amount
export const getSavingsAmount = (price, comparePrice) => {
  if (!comparePrice || Number(comparePrice) <= Number(price)) return 0
  return Number(comparePrice) - Number(price)
}

// ✅ Format price range
export const formatPriceRange = (min, max, currency = null) => {
  const curr = currency || CURRENCY
  return `${curr} ${Number(min).toLocaleString('en-PK')} - ${curr} ${Number(max).toLocaleString('en-PK')}`
}

// ✅ Calculate total from cart items
export const calculateCartTotal = (items = []) => {
  return items.reduce((total, item) => {
    return total + (Number(item.price) * Number(item.quantity || 1))
  }, 0)
}

// ✅ Calculate delivery charges
export const calculateDelivery = (subtotal, freeAbove = 3000, charges = 250) => {
  if (Number(subtotal) >= Number(freeAbove)) {
    return 0
  }
  return Number(charges)
}

// ✅ Calculate grand total
export const calculateGrandTotal = (subtotal, freeAbove = 3000, charges = 250) => {
  const delivery = calculateDelivery(subtotal, freeAbove, charges)
  return Number(subtotal) + delivery
}

export default formatPrice