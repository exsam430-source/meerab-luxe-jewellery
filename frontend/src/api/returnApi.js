import api from './axios.js'

export const returnApi = {
  create: (formData) => api.post('/return/create', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  uploadReceipt: (formData) => api.post('/return/upload-receipt', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  cancel: (returnId) => api.post('/return/cancel', { returnId }),
  getMyReturns: () => api.post('/return/my-returns', {}),
  getById: (id) => api.get(`/return/detail/${id}`),
  getAll: () => api.post('/return/all', {}),
  getStats: () => api.post('/return/stats', {}),
  approve: (data) => api.post('/return/approve', data),
  reject: (data) => api.post('/return/reject', data),
  markReceived: (data) => api.post('/return/mark-received', data),
  processRefund: (data) => api.post('/return/process-refund', data),
  completeRefund: (data) => api.post('/return/complete-refund', data),
  updateStatus: (data) => api.post('/return/update-status', data),
  delete: (id) => api.delete(`/return/delete/${id}`),
}