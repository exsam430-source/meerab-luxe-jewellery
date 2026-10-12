import api from './axios.js'

export const newsletterApi = {
  subscribe: (data) => api.post('/newsletter/subscribe', data),
  check: (email) => api.get('/newsletter/check', { params: { email } }),
  unsubscribe: (email) => api.post('/newsletter/unsubscribe', { email }),
  getAll: () => api.get('/newsletter/subscribers'),
}