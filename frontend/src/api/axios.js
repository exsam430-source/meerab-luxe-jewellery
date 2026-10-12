import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api'

// ✅ REMOVED: console.log('API URL is:', API_URL)

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

const PUBLIC_ROUTES = [
  '/product/list',
  '/product/single',
  '/product/category',
  '/product/featured',
  '/product/search',
  '/product/latest-images',
  '/product/page-products',
  '/settings/public',
  '/whatsapp/number',
  '/newsletter/subscribe',
  '/newsletter/check',
  '/analytics/events',
  '/reviews/',
  '/custom-order/create',
  '/user/register',
  '/user/login',
  '/user/admin',
  '/user/verify-email',
  '/user/forgot-password',
  '/user/reset-password',
  '/user/google-login',
  '/user/resend-verification',
  '/user/admin/exists',
  '/user/email-status',
]

const isPublicRoute = (url) => {
  if (!url) return true
  return PUBLIC_ROUTES.some(route => url.includes(route))
}

axiosInstance.interceptors.request.use(
  (config) => {
    const url = config.url || ''
    if (!isPublicRoute(url)) {
      const adminToken = localStorage.getItem('adminToken')
      const userToken  = localStorage.getItem('token')
      const token      = adminToken || userToken
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
        config.headers['token']         = token
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isAdminRoute = window.location.pathname.startsWith('/admin')
      if (isAdminRoute) {
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminUser')
        window.location.href = '/admin/login'
      } else {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    return Promise.reject(error)
  }
)

export default axiosInstance