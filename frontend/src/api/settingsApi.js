import api from './axios.js'

export const settingsApi = {
  // Public settings
  getPublic: () => api.get('/settings/public'),
  getPublicKey: (key) => api.get(`/settings/public/${key}`),

  // Admin
  getAll: () => api.get('/settings/all'),
  update: (key, value) => api.post('/settings/update', { key, value }),
  updateMultiple: (settings) => api.post('/settings/update-multiple', { settings }),
  initialize: () => api.post('/settings/initialize'),
}