// src/api/reviewApi.js
import api from './axios.js'

export const reviewApi = {
  // ✅ GET /api/reviews/:productId
  getReviews: (productId, params = {}) =>
    api.get(`/reviews/${productId}`, { params }),

  // ✅ POST /api/reviews/review/:id
  // Uses multipart/form-data for image uploads
  addReview: (productId, formData) =>
    api.post(`/reviews/review/${productId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000, // longer timeout for image uploads
    }),

  // ✅ DELETE /api/reviews/review/:productId/:reviewId
  deleteReview: (productId, reviewId) =>
    api.delete(`/reviews/review/${productId}/${reviewId}`),
}