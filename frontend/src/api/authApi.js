import api from './axios.js'

export const authApi = {
  // User auth
  register:           (data)  => api.post('/user/register', data),
  login:              (data)  => api.post('/user/login', data),
  // ✅ verifyEmail sends token in body
  verifyEmail:        (token) => api.post('/user/verify-email', { token }),
  forgotPassword:     (email) => api.post('/user/forgot-password', { email }),
  // ✅ resetPassword sends all fields
  resetPassword:      (data)  => api.post('/user/reset-password', data),
  googleLogin:        (data)  => api.post('/user/google-login', data),
  resendVerification: (email) => api.post('/user/resend-verification', { email }),

  // Admin auth
  adminLogin:          (data) => api.post('/user/admin', data),
  verifyAdmin:         ()     => api.get('/user/verify'),
  getAdminProfile:     ()     => api.get('/user/admin/profile'),
  changeAdminPassword: (data) => api.post('/user/admin/change-password', data),
}