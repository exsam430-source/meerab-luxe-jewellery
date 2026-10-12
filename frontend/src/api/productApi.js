import api from './axios.js'

export const productApi = {
  // Get all products
  getAll: () => api.get('/product/list'),

  // Get single product
  getById: (id) => api.get(`/product/single/${id}`),

  // Search products
  search: (params) => api.get('/product/search', { params }),

  // Get by category
  getByCategory: (params) => api.get('/product/category', { params }),

  // Get featured
  getFeatured: (params) => api.get('/product/featured', { params }),

  // Get latest images
  getLatestImages: (limit = 5) => api.get('/product/latest-images', { params: { limit } }),

  // Get page products (necklaces, bangles, under1000, kundan)
  getPageProducts: (page) => api.get('/product/page-products', { params: { page } }),

  // Admin: Add product
  add: (formData) => api.post('/product/add', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),

  // Admin: Update product
  update: (id, formData) => api.put(`/product/update/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),

  // Admin: Remove product
  remove: (id) => api.post('/product/remove', { id }),
}