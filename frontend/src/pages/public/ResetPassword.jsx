import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiLock, FiEye, FiEyeOff, FiAlertCircle, FiCheckCircle } from 'react-icons/fi'
import SEO from '../../components/common/SEO.jsx'
import { authApi } from '../../api/authApi.js'
import toast from 'react-hot-toast'

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [token, setToken] = useState('')
  const [form, setForm] = useState({ password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState({})
  const [tokenError, setTokenError] = useState(false)

  useEffect(() => {
    const t = searchParams.get('token')
    if (!t) {
      setTokenError(true)
    } else {
      setToken(t)
    }
  }, [])

  const validate = () => {
    const errs = {}
    if (!form.password) {
      errs.password = 'Password is required'
    } else if (form.password.length < 8) {
      errs.password = 'Password must be at least 8 characters'
    }
    if (!form.confirmPassword) {
      errs.confirmPassword = 'Please confirm your password'
    } else if (form.password !== form.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    if (loading) return

    setLoading(true)
    try {
      const res = await authApi.resetPassword({
        token: token,
        password: form.password,
        confirmPassword: form.confirmPassword,
      })

      if (res.data.success) {
        setSuccess(true)
        toast.success('Password reset successfully!')
        setTimeout(() => {
          navigate('/login', { replace: true })
        }, 3000)
      } else {
        toast.error(res.data.message || 'Reset failed')
        if (
          res.data.message?.includes('expired') ||
          res.data.message?.includes('Invalid')
        ) {
          setTokenError(true)
        }
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getPasswordStrength = (pwd) => {
    if (!pwd) return { strength: 0, label: '', color: '' }
    let score = 0
    if (pwd.length >= 8) score++
    if (pwd.length >= 12) score++
    if (/[A-Z]/.test(pwd)) score++
    if (/[0-9]/.test(pwd)) score++
    if (/[^A-Za-z0-9]/.test(pwd)) score++

    if (score <= 1) return { strength: 20, label: 'Weak', color: '#ef4444' }
    if (score <= 2) return { strength: 40, label: 'Fair', color: '#f59e0b' }
    if (score <= 3) return { strength: 60, label: 'Good', color: '#3b82f6' }
    if (score <= 4) return { strength: 80, label: 'Strong', color: '#10b981' }
    return { strength: 100, label: 'Very Strong', color: '#059669' }
  }

  const strength = getPasswordStrength(form.password)

  return (
    <>
      <SEO title="Reset Password | MeerabLuxe Jewellers" noIndex />

      <div
        className="min-h-screen flex items-center justify-center px-4 py-12"
        style={{ background: '#1a1a1a' }}
      >
        <div style={{ width: '100%', maxWidth: '420px' }}>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <Link to="/">
              <h1
                className="font-playfair font-bold gold-gradient-text"
                style={{ fontSize: '24px' }}
              >
                MeerabLuxe
              </h1>
              <p
                className="font-cormorant"
                style={{ color: '#a0a0a0', fontSize: '11px', letterSpacing: '4px' }}
              >
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
              padding: '36px 32px',
            }}
          >

            {/* TOKEN ERROR */}
            {tokenError && (
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '50%',
                    background: 'rgba(239,68,68,0.1)',
                    border: '2px solid rgba(239,68,68,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                  }}
                >
                  <FiAlertCircle size={36} color="#ef4444" />
                </div>
                <h2
                  className="font-playfair"
                  style={{ color: '#fff', fontSize: '22px', fontWeight: 700, marginBottom: '10px' }}
                >
                  Invalid Reset Link
                </h2>
                <p style={{ color: '#a0a0a0', fontSize: '14px', lineHeight: 1.7, marginBottom: '24px' }}>
                  This password reset link is invalid or has expired.
                  <br />Reset links are valid for{' '}
                  <strong style={{ color: '#e5e5e5' }}>1 hour only</strong>.
                </p>
                <Link
                  to="/login"
                  className="btn-gold"
                  style={{
                    display: 'block',
                    padding: '13px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: 600,
                    textAlign: 'center',
                    marginBottom: '12px',
                  }}
                >
                  Request New Reset Link
                </Link>
              </div>
            )}

            {/* SUCCESS */}
            {success && !tokenError && (
              <div style={{ textAlign: 'center' }}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '50%',
                    background: 'rgba(16,185,129,0.1)',
                    border: '2px solid rgba(16,185,129,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                  }}
                >
                  <FiCheckCircle size={36} color="#10b981" />
                </motion.div>
                <h2
                  className="font-playfair"
                  style={{ color: '#fff', fontSize: '22px', fontWeight: 700, marginBottom: '10px' }}
                >
                  Password Reset! ✅
                </h2>
                <p style={{ color: '#a0a0a0', fontSize: '14px', lineHeight: 1.7, marginBottom: '24px' }}>
                  Your password has been reset successfully.
                  <br />
                  <span style={{ color: '#d4af37' }}>Redirecting to login...</span>
                </p>

                {/* Progress bar */}
                <div
                  style={{
                    width: '100%',
                    height: '3px',
                    background: '#3d3d3d',
                    borderRadius: '2px',
                    overflow: 'hidden',
                    marginBottom: '20px',
                  }}
                >
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 3, ease: 'linear' }}
                    style={{
                      height: '100%',
                      background: 'linear-gradient(90deg, #d4af37, #b8960c)',
                    }}
                  />
                </div>

                <Link
                  to="/login"
                  className="btn-gold"
                  style={{
                    display: 'block',
                    padding: '13px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: 600,
                    textAlign: 'center',
                  }}
                >
                  Login Now →
                </Link>
              </div>
            )}

            {/* RESET FORM */}
            {!tokenError && !success && (
              <>
                <div style={{ marginBottom: '24px' }}>
                  <h2
                    className="font-playfair"
                    style={{ color: '#fff', fontSize: '22px', fontWeight: 700, marginBottom: '6px' }}
                  >
                    Reset Password 🔐
                  </h2>
                  <p style={{ color: '#6b7280', fontSize: '13px' }}>
                    Enter your new password below.
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                    {/* New Password */}
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '8px',
                          fontSize: '13px',
                          color: '#b0b0b0',
                          fontWeight: 500,
                        }}
                      >
                        New Password <span style={{ color: '#d4af37' }}>*</span>
                      </label>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          background: '#1a1a1a',
                          border: errors.password ? '1px solid #ef4444' : '1px solid #3d3d3d',
                          borderRadius: '10px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '46px',
                            minWidth: '46px',
                            height: '48px',
                            borderRight: '1px solid #2d2d2d',
                            background: '#161616',
                          }}
                        >
                          <FiLock size={17} style={{ color: '#6b7280' }} />
                        </div>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={form.password}
                          onChange={e => {
                            setForm(p => ({ ...p, password: e.target.value }))
                            if (errors.password) setErrors(p => ({ ...p, password: '' }))
                          }}
                          placeholder="Min 8 characters"
                          style={{
                            flex: 1,
                            background: 'transparent',
                            border: 'none',
                            outline: 'none',
                            padding: '13px 14px',
                            color: '#fff',
                            fontSize: '14px',
                            letterSpacing: !showPassword ? '2px' : '0',
                            caretColor: '#d4af37',
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(p => !p)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '46px',
                            height: '48px',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#6b7280',
                          }}
                        >
                          {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                        </button>
                      </div>

                      {/* Password strength */}
                      {form.password && (
                        <div style={{ marginTop: '8px' }}>
                          <div
                            style={{
                              width: '100%',
                              height: '3px',
                              background: '#3d3d3d',
                              borderRadius: '2px',
                              overflow: 'hidden',
                              marginBottom: '4px',
                            }}
                          >
                            <div
                              style={{
                                width: strength.strength + '%',
                                height: '100%',
                                background: strength.color,
                                borderRadius: '2px',
                                transition: 'all 0.3s ease',
                              }}
                            />
                          </div>
                          <span style={{ fontSize: '11px', color: strength.color }}>
                            {strength.label}
                          </span>
                        </div>
                      )}

                      {errors.password && (
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
                          {errors.password}
                        </p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '8px',
                          fontSize: '13px',
                          color: '#b0b0b0',
                          fontWeight: 500,
                        }}
                      >
                        Confirm Password <span style={{ color: '#d4af37' }}>*</span>
                      </label>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          background: '#1a1a1a',
                          border: errors.confirmPassword
                            ? '1px solid #ef4444'
                            : form.confirmPassword && form.password === form.confirmPassword
                              ? '1px solid #10b981'
                              : '1px solid #3d3d3d',
                          borderRadius: '10px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '46px',
                            minWidth: '46px',
                            height: '48px',
                            borderRight: '1px solid #2d2d2d',
                            background: '#161616',
                          }}
                        >
                          <FiLock size={17} style={{ color: '#6b7280' }} />
                        </div>
                        <input
                          type={showConfirm ? 'text' : 'password'}
                          value={form.confirmPassword}
                          onChange={e => {
                            setForm(p => ({ ...p, confirmPassword: e.target.value }))
                            if (errors.confirmPassword) setErrors(p => ({ ...p, confirmPassword: '' }))
                          }}
                          placeholder="Re-enter password"
                          style={{
                            flex: 1,
                            background: 'transparent',
                            border: 'none',
                            outline: 'none',
                            padding: '13px 14px',
                            color: '#fff',
                            fontSize: '14px',
                            letterSpacing: !showConfirm ? '2px' : '0',
                            caretColor: '#d4af37',
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(p => !p)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '46px',
                            height: '48px',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#6b7280',
                          }}
                        >
                          {showConfirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                        </button>
                      </div>

                      {/* Match indicator */}
                      {form.confirmPassword && form.password === form.confirmPassword && (
                        <p
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            marginTop: '6px',
                            fontSize: '12px',
                            color: '#10b981',
                          }}
                        >
                          <FiCheckCircle size={12} />
                          Passwords match
                        </p>
                      )}

                      {errors.confirmPassword && (
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
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-gold"
                      style={{
                        width: '100%',
                        padding: '14px',
                        fontSize: '15px',
                        marginTop: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                      }}
                    >
                      {loading ? (
                        <>
                          <div
                            style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              border: '2px solid #1a1a1a',
                              borderTopColor: 'transparent',
                              animation: 'spin 0.8s linear infinite',
                            }}
                          />
                          Resetting...
                        </>
                      ) : (
                        'Reset Password 🔐'
                      )}
                    </button>

                    <p style={{ textAlign: 'center', fontSize: '13px', color: '#6b7280' }}>
                      Remember your password?{' '}
                      <Link
                        to="/login"
                        style={{ color: '#d4af37', textDecoration: 'none', fontWeight: 600 }}
                      >
                        Login
                      </Link>
                    </p>
                  </div>
                </form>
              </>
            )}
          </motion.div>

          {/* Back link */}
          <p style={{ textAlign: 'center', marginTop: '20px' }}>
            <Link
              to="/"
              style={{ fontSize: '13px', color: '#6b7280', textDecoration: 'none' }}
            >
              ← Back to Store
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}

export default ResetPassword