import { WHATSAPP_NUMBER, STORE_NAME, CURRENCY, SITE_URL } from './constants.js'

// ✅ Basic WhatsApp link generator
export const createWhatsAppLink = (message, number = null) => {
  const phone = (number || WHATSAPP_NUMBER).replace(/[^0-9]/g, '')
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

// ✅ Product inquiry WhatsApp link
export const createProductWhatsAppLink = (product, number = null) => {
  const price = `${CURRENCY} ${Number(product.price).toLocaleString('en-PK')}`
  const productUrl = `${SITE_URL}/product/${product._id || product.id}`

  const message = [
    `Assalamu Alaikum! 👋`,
    ``,
    `I'm interested in this product from *${STORE_NAME}*:`,
    ``,
    `🛍️ *${product.name}*`,
    `💰 Price: *${price}*`,
    `🔗 Link: ${productUrl}`,
    ``,
    `Please share availability and delivery details.`,
    `JazakAllah Khair! 🙏`
  ].join('\n')

  return createWhatsAppLink(message, number)
}

// ✅ Order WhatsApp link
export const createOrderWhatsAppLink = (items = [], total = 0, address = {}, number = null) => {
  let itemsList = items.map((item, i) => {
    const itemTotal = `${CURRENCY} ${Number(item.price * item.quantity).toLocaleString('en-PK')}`
    return `${i + 1}. *${item.name}* x${item.quantity} = ${itemTotal}`
  }).join('\n')

  const totalFormatted = `${CURRENCY} ${Number(total).toLocaleString('en-PK')}`

  const addressStr = address
    ? [
        address.firstName && address.lastName
          ? `${address.firstName} ${address.lastName}`
          : address.name || '',
        address.street || address.address || '',
        address.city || '',
        address.phone || '',
      ].filter(Boolean).join(', ')
    : ''

  const message = [
    `*New Order — ${STORE_NAME}* 🛍️`,
    ``,
    `*Order Items:*`,
    itemsList,
    ``,
    `*Total Amount: ${totalFormatted}*`,
    ``,
    `*Delivery Address:*`,
    addressStr,
    ``,
    `Please confirm my order and share payment details.`,
    `JazakAllah Khair! 🙏`
  ].join('\n')

  return createWhatsAppLink(message, number)
}

// ✅ Custom order WhatsApp link
export const createCustomOrderWhatsAppLink = (details = {}, number = null) => {
  const message = [
    `*Custom Jewellery Order — ${STORE_NAME}* 💍`,
    ``,
    `*Customer Details:*`,
    `Name: ${details.name || ''}`,
    `Phone: ${details.phone || ''}`,
    ``,
    `*Order Details:*`,
    `Type: ${details.jewelleryType || ''}`,
    `Budget: ${CURRENCY} ${details.budgetMin || 0} - ${CURRENCY} ${details.budgetMax || 0}`,
    `Description: ${details.description || ''}`,
    details.occasion ? `Occasion: ${details.occasion}` : '',
    details.requiredBy ? `Required By: ${details.requiredBy}` : '',
    ``,
    `Please contact me to discuss this custom order.`,
    `JazakAllah Khair! 🙏`
  ].filter(line => line !== null && line !== undefined).join('\n')

  return createWhatsAppLink(message, number)
}

// ✅ General inquiry WhatsApp link
export const createGeneralWhatsAppLink = (number = null) => {
  const message = [
    `Assalamu Alaikum! 👋`,
    ``,
    `I have a general inquiry about *${STORE_NAME}*.`,
    ``,
    `Please assist me.`,
    `JazakAllah Khair! 🙏`
  ].join('\n')

  return createWhatsAppLink(message, number)
}

// ✅ Return/complaint WhatsApp link
export const createReturnWhatsAppLink = (orderId = '', number = null) => {
  const message = [
    `Assalamu Alaikum! 👋`,
    ``,
    `I would like to request a *Return/Exchange* for:`,
    ``,
    `Order ID: *${orderId}*`,
    ``,
    `Please guide me through the return process.`,
    `JazakAllah Khair! 🙏`
  ].join('\n')

  return createWhatsAppLink(message, number)
}

// ✅ Track order WhatsApp link
export const createTrackOrderWhatsAppLink = (orderId = '', number = null) => {
  const message = [
    `Assalamu Alaikum! 👋`,
    ``,
    `I would like to track my order:`,
    ``,
    `Order ID: *${orderId}*`,
    ``,
    `Please share the current status.`,
    `JazakAllah Khair! 🙏`
  ].join('\n')

  return createWhatsAppLink(message, number)
}

export default createWhatsAppLink