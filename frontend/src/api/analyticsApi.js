import api from './axios.js'

export const analyticsApi = {
  createEvent: (data) => api.post('/analytics/events', data),
  getTotalUsers: () => api.get('/analytics/totalUsers'),
  getTotalOrders: () => api.get('/analytics/totalOrders'),
  getVisitors: (range) => api.get('/analytics/visitors', { params: { range } }),
  getTopProducts: (params) => api.get('/analytics/top-products', { params }),
  getOverallStats: () => api.get('/analytics/product/all/stats'),
  getConversion: () => api.get('/analytics/conversion'),
  getEventsByDate: (range) => api.get('/analytics/events-by-date', { params: { range } }),
}