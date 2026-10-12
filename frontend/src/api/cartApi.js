import api from './axios.js'

export const cartApi = {
  get: () => api.post('/cart/get', {}),
  add: (data) => api.post('/cart/add', data),
  update: (data) => api.post('/cart/update', data),
  clear: () => api.post('/cart/clear', {}),
}