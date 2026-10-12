import api from './axios.js'

export const goldPriceApi = {
  getLatest:  ()       => api.get('/gold-price/latest'),
  getHistory: (limit)  => api.get('/gold-price/history', { params: { limit } }),
  update:     (data)   => api.post('/gold-price/update', data),
  calculate:  (params) => api.get('/gold-price/calculate', { params }),
}