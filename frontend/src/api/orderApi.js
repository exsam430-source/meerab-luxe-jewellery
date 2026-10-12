import api from './axios.js'

export const orderApi = {
  // Place COD order
  placeCOD: (data) => api.post('/order/place', data),

  // Place Easypaisa order
  placeEasypaisa: (data) => api.post('/order/easypaisa', data),

  // Place Bank Transfer order
  placeBankTransfer: (data) => api.post('/order/bank-transfer', data),

  // Place WhatsApp order
  placeWhatsApp: (data) => api.post('/order/whatsapp', data),

  // Upload payment proof
  uploadPaymentProof: (formData) => api.post('/order/upload-payment-proof', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),

  // Get user orders
  getUserOrders: () => api.post('/order/userorders', {}),

  // Get order by ID
  getById: (id) => api.get(`/order/${id}`),

  // Admin: Get all orders
  getAll: () => api.post('/order/list', {}),

  // Admin: Update status
  updateStatus: (data) => api.post('/order/status', data),

  // Admin: Verify payment
  verifyPayment: (data) => api.post('/order/verify-payment', data),

  // Admin: Update payment
  updatePayment: (data) => api.post('/order/update-payment', data),
}