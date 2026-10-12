// src/pages/auth/Login.jsx
import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiMail, FiLock, FiEye, FiEyeOff,
  FiUser, FiPhone, FiAlertCircle,
  FiArrowLeft,
} from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import SEO from '../../components/common/SEO.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { authApi } from '../../api/authApi.js'
import toast from 'react-hot-toast'

// ✅ Reusable Input Component
const FormInput = ({
  icon: Icon,
  label,
  error,
  required = false,
  type = 'text',
  showToggle = false,
  showPassword = false,
  onTogglePassword,
  ...inputProps
}) => {
  return (
    <div>
      {label && (
        <label className="block mb-2" style={{ fontSize: '13px', color: '#b0b0b0', fontWeight: 500 }}>
          {label}
          {required && <span style={{ color: '#d4af37', marginLeft: '3px' }}>*</span>}
        </label>
      )}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          background: '#1a1a1a',
          border: error ? '1px solid #ef4444' : '1px solid #3d3d3d',
          borderRadius: '10px',
          transition: 'border-color 0.3s ease',
          overflow: 'hidden',
        }}
        onFocus={e => {
          if (!error) e.currentTarget.style.borderColor = '#d4af37'
        }}
        onBlur={e => {
          if (!error) e.currentTarget.style.borderColor = '#3d3d3d'
        }}
      >
        {Icon && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '44px',
              minWidth: '44px',
              height: '46px',
              borderRight: '1px solid #2d2d2d',
              background: '#222222',
            }}
          >
            <Icon size={16} style={{ color: '#6b7280' }} />
          </div>
        )}
        <input
          type={showToggle ? (showPassword ? 'text' : 'password') : type}
          {...inputProps}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            padding: '12px 14px',
            color: '#ffffff',
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif',
            letterSpacing: type === 'password' && !showPassword ? '2px' : '0',
            caretColor: '#d4af37',
            ...(inputProps.style || {}),
          }}
        />
        {showToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            tabIndex={-1}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '44px',
              minWidth: '44px',
              height: '46px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#6b7280',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#d4af37'}
            onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
          >
            {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
          </button>
        )}
      </div>
      {error && (
        <p
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginTop: '6px',
            fontSize: '12px',
            color: '#ef4444',
          }}
        >
          <FiAlertCircle size={12} />
          {error}
        </p>
      )}
    </div>
  )
}

// ✅ Google Button Component
const GoogleLoginButton = ({ onSuccess, onError, disabled }) => {
  const buttonRef = useRef(null)
  const [gsiLoaded, setGsiLoaded] = useState(false)
  const [gsiError, setGsiError] = useState(false)

  useEffect(() => {
    const loadGSI = () => {
      if (window.google && window.google.accounts) {
        initializeGSI()
        return
      }

      const existingScript = document.getElementById('google-gsi-script')
      if (existingScript) {
        existingScript.addEventListener('load', initializeGSI)
        existingScript.addEventListener('error', () => setGsiError(true))
        return
      }

      const script = document.createElement('script')
      script.id = 'google-gsi-script'
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.onload = initializeGSI
      script.onerror = () => {
        console.error('Failed to load Google GSI script')
        setGsiError(true)
      }
      document.head.appendChild(script)
    }

    const initializeGSI = () => {
      try {
        if (!window.google || !window.google.accounts) {
          setTimeout(initializeGSI, 500)
          return
        }

        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
          use_fedcm_for_prompt: false,
        })

        setGsiLoaded(true)
      } catch (err) {
        console.error('GSI init error:', err)
        setGsiError(true)
      }
    }

    loadGSI()

    return () => {
      if (window.google && window.google.accounts) {
        try {
          window.google.accounts.id.cancel()
        } catch (e) {
          // ignore
        }
      }
    }
  }, [])

  const handleCredentialResponse = async (response) => {
    try {
      if (!response.credential) {
        onError('No credential received from Google')
        return
      }

      const base64Url = response.credential.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      const userInfo = JSON.parse(jsonPayload)

      await onSuccess({
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        googleId: userInfo.sub,
      })
    } catch (err) {
      console.error('Google credential error:', err)
      onError('Failed to process Google login')
    }
  }

  const handleGoogleClick = () => {
    if (!gsiLoaded || gsiError) {
      onError('Google login is not available. Please try again.')
      return
    }

    try {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed()) {
          triggerPopupFlow()
        } else if (notification.isSkippedMoment()) {
          triggerPopupFlow()
        }
      })
    } catch (err) {
      console.error('Google prompt error:', err)
      triggerPopupFlow()
    }
  }

  const triggerPopupFlow = () => {
    try {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
      const redirectUri = encodeURIComponent(window.location.origin)
      const scope = encodeURIComponent('email profile openid')
      const responseType = 'token'
      const prompt = 'select_account'

      const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${clientId}` +
        `&redirect_uri=${redirectUri}` +
        `&response_type=${responseType}` +
        `&scope=${scope}` +
        `&prompt=${prompt}`

      const width = 500
      const height = 600
      const left = window.screenX + (window.outerWidth - width) / 2
      const top = window.screenY + (window.outerHeight - height) / 2

      const popup = window.open(
        oauthUrl,
        'google-oauth-popup',
        `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
      )

      if (!popup) {
        onError('Popup was blocked. Please allow popups for this site.')
        return
      }

      const checkPopup = setInterval(async () => {
        try {
          if (!popup || popup.closed) {
            clearInterval(checkPopup)
            return
          }

          const popupUrl = popup.location.href
          if (popupUrl && popupUrl.includes(window.location.origin)) {
            const hash = popup.location.hash
            const params = new URLSearchParams(hash.substring(1))
            const accessToken = params.get('access_token')

            popup.close()
            clearInterval(checkPopup)

            if (accessToken) {
              const response = await fetch(
                'https://www.googleapis.com/oauth2/v3/userinfo',
                { headers: { Authorization: `Bearer ${accessToken}` } }
              )
              const userInfo = await response.json()

              if (userInfo.email) {
                await onSuccess({
                  email: userInfo.email,
                  name: userInfo.name,
                  picture: userInfo.picture,
                })
              } else {
                onError('Could not get user info from Google')
              }
            }
          }
        } catch (e) {
          // Cross-origin errors during redirect are expected, ignore them
        }
      }, 500)

      setTimeout(() => {
        if (!popup.closed) {
          popup.close()
        }
        clearInterval(checkPopup)
      }, 300000)

    } catch (err) {
      console.error('Popup flow error:', err)
      onError('Google login failed. Please try email/password login.')
    }
  }

  if (gsiError) {
    return (
      <button
        disabled
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          padding: '12px',
          borderRadius: '10px',
          fontSize: '13px',
          fontWeight: 500,
          background: '#1a1a1a',
          color: '#6b7280',
          border: '1px solid #3d3d3d',
          cursor: 'not-allowed',
          marginBottom: '16px',
          opacity: 0.6,
        }}
      >
        <FcGoogle size={20} />
        Google Login Unavailable
      </button>
    )
  }

  return (
    <button
      onClick={handleGoogleClick}
      disabled={disabled || !gsiLoaded}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        padding: '12px',
        borderRadius: '10px',
        fontSize: '13px',
        fontWeight: 500,
        background: '#1a1a1a',
        color: disabled || !gsiLoaded ? '#6b7280' : '#e5e5e5',
        border: '1px solid #3d3d3d',
        cursor: disabled || !gsiLoaded ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s',
        marginBottom: '16px',
        opacity: disabled || !gsiLoaded ? 0.7 : 1,
      }}
      onMouseEnter={e => {
        if (!disabled && gsiLoaded) {
          e.currentTarget.style.borderColor = '#d4af37'
          e.currentTarget.style.background = '#222222'
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#3d3d3d'
        e.currentTarget.style.background = '#1a1a1a'
      }}
    >
      <FcGoogle size={20} />
      {!gsiLoaded ? 'Loading Google...' : 'Continue with Google'}
    </button>
  )
}

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, register, googleLogin, isAuthenticated } = useAuth()

  const [mode, setMode] = useState('login')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [verificationSent, setVerificationSent] = useState(false)
  const [forgotSent, setForgotSent] = useState(false)

  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/'
      navigate(from, { replace: true })
    }
  }, [isAuthenticated])

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (mode === 'forgot') {
      if (!form.email.trim()) errs.email = 'Email is required'
      else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email'
      setErrors(errs)
      return Object.keys(errs).length === 0
    }
    if (mode === 'register' && !form.name.trim()) {
      errs.name = 'Name is required'
    }
    if (!form.email.trim()) {
      errs.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errs.email = 'Invalid email address'
    }
    if (!form.password) {
      errs.password = 'Password is required'
    } else if (mode === 'register' && form.password.length < 6) {
      errs.password = 'At least 6 characters'
    }
    if (mode === 'register' && form.password !== form.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleForgotPassword = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      const res = await authApi.forgotPassword(form.email)
      if (res.data.success) {
        setForgotSent(true)
        toast.success('Reset link sent to your email!')
      } else {
        toast.error(res.data.message || 'Failed to send reset email')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (mode === 'forgot') { handleForgotPassword(); return }
    if (!validate()) return
    setLoading(true)
    try {
      let result
      if (mode === 'login') {
        result = await login(form.email, form.password)
        if (result.useAdminLogin) {
          toast.error('Please use the admin login panel.')
          navigate('/admin/login')
          return
        }
        if (result.requiresVerification) {
          setVerificationSent(true)
          toast.error(result.message || 'Please verify your email first.')
          return
        }
      } else {
        result = await register({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
        })
        if (result.requiresVerification) {
          setVerificationSent(true)
          toast.success(result.message || 'Verification email sent!')
          return
        }
      }
      if (result.success) {
        toast.success(result.message || 'Welcome!')
        navigate(location.state?.from?.pathname || '/', { replace: true })
      } else {
        toast.error(result.message || 'Something went wrong')
      }
    } catch {
      toast.error('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSuccess = async (userData) => {
    setLoading(true)
    try {
      const result = await googleLogin({
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
      })
      if (result.success) {
        toast.success('Welcome! 🎉')
        navigate(location.state?.from?.pathname || '/', { replace: true })
      } else {
        toast.error(result.message || 'Google login failed')
      }
    } catch {
      toast.error('Google login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleError = (message) => {
    toast.error(message || 'Google login failed')
  }

  const handleResendVerification = async () => {
    if (!form.email) { toast.error('Enter your email first'); return }
    setLoading(true)
    try {
      const res = await authApi.resendVerification(form.email)
      if (res.data.success) toast.success('Verification email resent!')
      else toast.error(res.data.message || 'Failed to resend')
    } catch { toast.error('Failed to resend verification') }
    finally { setLoading(false) }
  }

  const switchMode = (m) => {
    setMode(m)
    setErrors({})
    setVerificationSent(false)
    setForgotSent(false)
    setShowPassword(false)
    setShowConfirm(false)
  }

  return (
    <>
      <SEO
        title={`${mode === 'login' ? 'Login' : mode === 'register' ? 'Register' : 'Forgot Password'} | MeerabLuxe Jewellers`}
        noIndex
      />

      <div
        className="min-h-screen flex items-center justify-center py-10 px-4"
        style={{ background: '#1a1a1a' }}
      >
        <div style={{ width: '100%', maxWidth: '440px' }}>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <Link to="/" className="inline-block">
              <img
                src="/logo.png"
                alt="MeerabLuxe Jewellers"
                style={{ width: '64px', height: '64px', objectFit: 'contain', margin: '0 auto 8px' }}
              />
              <h1 className="font-playfair font-bold gold-gradient-text" style={{ fontSize: '22px' }}>
                MeerabLuxe
              </h1>
              <p className="font-cormorant" style={{ color: '#a0a0a0', fontSize: '11px', letterSpacing: '4px' }}>
                JEWELLERS
              </p>
            </Link>
          </motion.div>

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              background: '#242424',
              border: '1px solid #3d3d3d',
              borderRadius: '16px',
              padding: '28px',
            }}
          >
            {/* Verification banner */}
            {verificationSent && (
              <div
                style={{
                  background: 'rgba(212,175,55,0.08)',
                  border: '1px solid rgba(212,175,55,0.2)',
                  borderRadius: '10px',
                  padding: '14px',
                  marginBottom: '20px',
                }}
              >
                <p style={{ color: '#d4af37', fontWeight: 600, fontSize: '13px', marginBottom: '4px' }}>
                  📧 Verification Email Sent!
                </p>
                <p style={{ color: '#a0a0a0', fontSize: '12px', lineHeight: 1.5 }}>
                  Check your email inbox and spam folder. Click the link to verify.
                </p>
                <button
                  onClick={handleResendVerification}
                  disabled={loading}
                  style={{
                    marginTop: '8px', fontSize: '12px', color: '#d4af37',
                    background: 'none', border: 'none', cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Resend verification email
                </button>
              </div>
            )}

            {/* Forgot sent banner */}
            {forgotSent && (
              <div
                style={{
                  background: 'rgba(16,185,129,0.08)',
                  border: '1px solid rgba(16,185,129,0.2)',
                  borderRadius: '10px',
                  padding: '14px',
                  marginBottom: '20px',
                }}
              >
                <p style={{ color: '#10b981', fontWeight: 600, fontSize: '13px', marginBottom: '4px' }}>
                  ✅ Reset Link Sent!
                </p>
                <p style={{ color: '#a0a0a0', fontSize: '12px', lineHeight: 1.5 }}>
                  Password reset link sent to <strong style={{ color: '#e5e5e5' }}>{form.email}</strong>.
                </p>
                <button
                  onClick={() => switchMode('login')}
                  style={{
                    marginTop: '8px', fontSize: '12px', color: '#d4af37',
                    background: 'none', border: 'none', cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Back to Login
                </button>
              </div>
            )}

            {/* FORGOT PASSWORD */}
            {mode === 'forgot' && !forgotSent && (
              <>
                <button
                  onClick={() => switchMode('login')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '4px',
                    fontSize: '13px', color: '#a0a0a0', background: 'none',
                    border: 'none', cursor: 'pointer', marginBottom: '16px',
                  }}
                >
                  <FiArrowLeft size={14} /> Back to Login
                </button>
                <h2 className="font-playfair" style={{ color: '#fff', fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>
                  Forgot Password?
                </h2>
                <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '20px' }}>
                  Enter your email to receive a reset link.
                </p>
                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: '16px' }}>
                    <FormInput
                      icon={FiMail}
                      label="Email Address"
                      required
                      type="email"
                      value={form.email}
                      onChange={e => handleChange('email', e.target.value)}
                      placeholder="your@email.com"
                      autoComplete="email"
                      error={errors.email}
                    />
                  </div>
                  <button type="submit" disabled={loading} className="btn-gold" style={{ width: '100%', padding: '14px' }}>
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </form>
              </>
            )}

            {/* LOGIN / REGISTER */}
            {mode !== 'forgot' && !forgotSent && (
              <>
                {/* Tabs */}
                <div
                  style={{
                    display: 'flex',
                    background: '#1a1a1a',
                    borderRadius: '10px',
                    padding: '3px',
                    marginBottom: '20px',
                  }}
                >
                  {['login', 'register'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => switchMode(tab)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        fontSize: '13px',
                        fontWeight: 600,
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        textTransform: 'capitalize',
                        transition: 'all 0.2s',
                        background: mode === tab
                          ? 'linear-gradient(135deg, #d4af37, #b8960c)'
                          : 'transparent',
                        color: mode === tab ? '#1a1a1a' : '#6b7280',
                      }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Google Button */}
                <GoogleLoginButton
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  disabled={loading}
                />

                {/* Divider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ flex: 1, height: '1px', background: '#3d3d3d' }} />
                  <span style={{ fontSize: '11px', color: '#6b7280' }}>or</span>
                  <div style={{ flex: 1, height: '1px', background: '#3d3d3d' }} />
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {mode === 'register' && (
                      <FormInput
                        icon={FiUser}
                        label="Full Name"
                        required
                        value={form.name}
                        onChange={e => handleChange('name', e.target.value)}
                        placeholder="Muhammad Ahmed"
                        autoComplete="name"
                        error={errors.name}
                      />
                    )}
                    {mode === 'register' && (
                      <FormInput
                        icon={FiPhone}
                        label="Phone Number"
                        type="tel"
                        value={form.phone}
                        onChange={e => handleChange('phone', e.target.value)}
                        placeholder="03XX-XXXXXXX"
                        autoComplete="tel"
                      />
                    )}
                    <FormInput
                      icon={FiMail}
                      label="Email Address"
                      required
                      type="email"
                      value={form.email}
                      onChange={e => handleChange('email', e.target.value)}
                      placeholder="your@email.com"
                      autoComplete="email"
                      error={errors.email}
                    />
                    <FormInput
                      icon={FiLock}
                      label="Password"
                      required
                      showToggle
                      showPassword={showPassword}
                      onTogglePassword={() => setShowPassword(p => !p)}
                      value={form.password}
                      onChange={e => handleChange('password', e.target.value)}
                      placeholder="Enter password"
                      autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                      error={errors.password}
                    />
                    {mode === 'register' && (
                      <FormInput
                        icon={FiLock}
                        label="Confirm Password"
                        required
                        showToggle
                        showPassword={showConfirm}
                        onTogglePassword={() => setShowConfirm(p => !p)}
                        value={form.confirmPassword}
                        onChange={e => handleChange('confirmPassword', e.target.value)}
                        placeholder="Re-enter password"
                        autoComplete="new-password"
                        error={errors.confirmPassword}
                      />
                    )}
                    {mode === 'login' && (
                      <div style={{ textAlign: 'right', marginTop: '-4px' }}>
                        <button
                          type="button"
                          onClick={() => switchMode('forgot')}
                          style={{
                            fontSize: '12px', color: '#d4af37', background: 'none',
                            border: 'none', cursor: 'pointer',
                          }}
                        >
                          Forgot password?
                        </button>
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-gold"
                      style={{ width: '100%', padding: '14px', fontSize: '15px', marginTop: '4px' }}
                    >
                      {loading ? (
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                          <span
                            style={{
                              width: '18px', height: '18px', borderRadius: '50%',
                              border: '2px solid #1a1a1a', borderTopColor: 'transparent',
                              animation: 'spin 0.8s linear infinite', display: 'inline-block',
                            }}
                          />
                          {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                        </span>
                      ) : (
                        mode === 'login' ? 'Sign In' : 'Create Account'
                      )}
                    </button>
                  </div>
                </form>

                <p style={{ textAlign: 'center', fontSize: '13px', color: '#6b7280', marginTop: '16px' }}>
                  {mode === 'login' ? (
                    <>
                      Don't have an account?{' '}
                      <button
                        onClick={() => switchMode('register')}
                        style={{ color: '#d4af37', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Register
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <button
                        onClick={() => switchMode('login')}
                        style={{ color: '#d4af37', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Login
                      </button>
                    </>
                  )}
                </p>
              </>
            )}
          </motion.div>

          {/* Bottom links */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginTop: '16px' }}>
            <Link to="/" style={{ fontSize: '12px', color: '#6b7280', textDecoration: 'none' }}>
              ← Back to Store
            </Link>
            <span style={{ width: '1px', height: '12px', background: '#3d3d3d' }} />
            <Link to="/admin/login" style={{ fontSize: '12px', color: '#d4af37', textDecoration: 'none' }}>
              Admin Panel →
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login