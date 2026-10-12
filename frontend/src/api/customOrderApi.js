import api from './axios.js'

export const customOrderApi = {
  create: (formData) => api.post('/custom-order/create', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getMyOrders: () => api.get('/custom-order/my-orders'),
  getById: (id) => api.get(`/custom-order/order/${id}`),
  getAll: () => api.post('/custom-order/all', {}),
  updateStatus: (data) => api.post('/custom-order/update-status', data),
  delete: (id) => api.delete(`/custom-order/${id}`),
}