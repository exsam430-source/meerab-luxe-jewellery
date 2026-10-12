import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { jwtDecode } from 'jwt-decode'
import { authApi } from '../api/authApi.js'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)

  // ✅ Initialize auth state from localStorage
  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = () => {
    try {
      // Check user token
      const token = localStorage.getItem('token')
      const savedUser = localStorage.getItem('user')

      if (token && savedUser) {
        try {
          const decoded = jwtDecode(token)
          const isExpired = decoded.exp * 1000 < Date.now()

          if (!isExpired) {
            setUser(JSON.parse(savedUser))
            setIsAuthenticated(true)
          } else {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
          }
        } catch {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        }
      }

      // Check admin token
      const adminToken = localStorage.getItem('adminToken')
      const savedAdmin = localStorage.getItem('adminUser')

      if (adminToken && savedAdmin) {
        try {
          const decoded = jwtDecode(adminToken)
          const isExpired = decoded.exp * 1000 < Date.now()

          if (!isExpired) {
            setAdmin(JSON.parse(savedAdmin))
            setIsAdminAuthenticated(true)
          } else {
            localStorage.removeItem('adminToken')
            localStorage.removeItem('adminUser')
          }
        } catch {
          localStorage.removeItem('adminToken')
          localStorage.removeItem('adminUser')
        }
      }
    } catch (error) {
      console.error('Auth init error:', error)
    } finally {
      setLoading(false)
    }
  }

  // ✅ User Login
  const login = useCallback(async (email, password) => {
    try {
      const res = await authApi.login({ email, password })
      const data = res.data

      if (data.success) {
        if (data.useAdminLogin) {
          return { success: false, useAdminLogin: true }
        }

        if (data.requiresVerification) {
          return {
            success: false,
            requiresVerification: true,
            email: data.email,
            message: data.message
          }
        }

        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        setUser(data.user)
        setIsAuthenticated(true)
        return { success: true, message: data.message }
      }

      return { success: false, message: data.message }
    } catch (error) {
      return { success: false, message: 'Login failed. Please try again.' }
    }
  }, [])

  // ✅ User Register
  const register = useCallback(async (data) => {
    try {
      const res = await authApi.register(data)
      const resData = res.data

      if (resData.success) {
        if (!resData.requiresVerification && resData.token) {
          localStorage.setItem('token', resData.token)
          localStorage.setItem('user', JSON.stringify(resData.user))
          setUser(resData.user)
          setIsAuthenticated(true)
        }
        return { success: true, message: resData.message, requiresVerification: resData.requiresVerification }
      }

      return { success: false, message: resData.message }
    } catch (error) {
      return { success: false, message: 'Registration failed. Please try again.' }
    }
  }, [])

  // ✅ Google Login
  const googleLogin = useCallback(async (googleData) => {
    try {
      const res = await authApi.googleLogin({
        email: googleData.email,
        name: googleData.name,
        profileImage: googleData.picture,
      })
      const data = res.data

      if (data.success) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        setUser(data.user)
        setIsAuthenticated(true)
        return { success: true, message: data.message }
      }

      return { success: false, message: data.message }
    } catch (error) {
      return { success: false, message: 'Google login failed.' }
    }
  }, [])

  // ✅ User Logout
  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setIsAuthenticated(false)
    toast.success('Logged out successfully')
  }, [])

  // ✅ Admin Login
  const adminLogin = useCallback(async (email, password) => {
    try {
      const res = await authApi.adminLogin({ email, password })
      const data = res.data

      if (data.success) {
        localStorage.setItem('adminToken', data.token)
        localStorage.setItem('adminUser', JSON.stringify(data.admin))
        setAdmin(data.admin)
        setIsAdminAuthenticated(true)
        return { success: true, message: data.message }
      }

      return { success: false, message: data.message }
    } catch (error) {
      return { success: false, message: 'Admin login failed.' }
    }
  }, [])

  // ✅ Admin Logout
  const adminLogout = useCallback(() => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    setAdmin(null)
    setIsAdminAuthenticated(false)
    toast.success('Admin logged out')
  }, [])

  // ✅ Update user in state
  const updateUser = useCallback((updatedUser) => {
    const merged = { ...user, ...updatedUser }
    setUser(merged)
    localStorage.setItem('user', JSON.stringify(merged))
  }, [user])

  const value = {
    user,
    admin,
    loading,
    isAuthenticated,
    isAdminAuthenticated,
    login,
    register,
    googleLogin,
    logout,
    adminLogin,
    adminLogout,
    updateUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export default AuthContext