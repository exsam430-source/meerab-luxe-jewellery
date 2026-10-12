import api from './axios.js'

export const whatsappApi = {
  getNumber: () => api.get('/whatsapp/number'),
  logInquiry: (data) => api.post('/whatsapp/log', data),
  getAll: () => api.get('/whatsapp/inquiries'),
  updateStatus: (data) => api.post('/whatsapp/update-status', data),
  updateNumber: (data) => api.post('/whatsapp/update-number', data),
  delete: (data) => api.post('/whatsapp/delete', data),
}