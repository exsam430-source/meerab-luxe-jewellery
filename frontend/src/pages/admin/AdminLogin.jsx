import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiEye, FiEyeOff, FiShield, FiAlertCircle } from 'react-icons/fi'
import SEO from '../../components/common/SEO.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import toast from 'react-hot-toast'

// ✅ Reusable Admin Input
const AdminInput = ({
  icon: Icon,
  label,
  error,
  showToggle = false,
  showPassword = false,
  onTogglePassword,
  ...inputProps
}) => {
  return (
    <div>
      {label && (
        <label
          style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '13px',
            color: '#b0b0b0',
            fontWeight: 500,
          }}
        >
          {label}
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
        {/* Icon area */}
        {Icon && (
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
            <Icon size={17} style={{ color: '#6b7280' }} />
          </div>
        )}

        {/* Input */}
        <input
          {...inputProps}
          type={showToggle ? (showPassword ? 'text' : 'password') : inputProps.type || 'text'}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            padding: '13px 14px',
            color: '#ffffff',
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif',
            caretColor: '#d4af37',
            letterSpacing: (showToggle && !showPassword) ? '2px' : '0',
          }}
        />

        {/* Password toggle */}
        {showToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            tabIndex={-1}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '46px',
              minWidth: '46px',
              height: '48px',
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

      {/* Error */}
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

const AdminLogin = () => {
  const navigate = useNavigate()
  const { adminLogin, isAdminAuthenticated } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isAdminAuthenticated) {
      navigate('/admin/dashboard', { replace: true })
    }
  }, [isAdminAuthenticated])

  const validate = () => {
    const errs = {}
    if (!form.email.trim()) errs.email = 'Email is required'
    if (!form.password) errs.password = 'Password is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const result = await adminLogin(form.email, form.password)
      if (result.success) {
        toast.success('Welcome back, Admin! 👑')
        navigate('/admin/dashboard', { replace: true })
      } else {
        toast.error(result.message || 'Login failed')
        if (result.message?.includes('locked')) {
          setErrors({ general: result.message })
        }
      }
    } catch {
      toast.error('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEO title="Admin Login | RB Jewellers" noIndex />

      <div
        className="min-h-screen flex items-center justify-center px-4 py-12"
        style={{ background: '#111111' }}
      >
        <div style={{ width: '100%', maxWidth: '400px' }}>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
            style={{ marginBottom: '28px' }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
                background: 'linear-gradient(135deg, #d4af37, #b8960c)',
              }}
            >
              <FiShield size={28} color="#1a1a1a" />
            </div>
            <h1
              className="font-playfair font-bold gold-gradient-text"
              style={{ fontSize: '22px' }}
            >
              Admin Panel
            </h1>
            <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px' }}>
              Rana Brother's Gold Smith
            </p>
          </motion.div>

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              background: '#1a1a1a',
              border: '1px solid #2d2d2d',
              borderRadius: '16px',
              padding: '28px',
            }}
          >
            <h2
              className="font-playfair"
              style={{
                color: '#ffffff',
                fontSize: '18px',
                fontWeight: 700,
                marginBottom: '20px',
              }}
            >
              Sign In to Admin
            </h2>

            {/* Error banner */}
            {errors.general && (
              <div
                style={{
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  borderRadius: '10px',
                  padding: '12px',
                  marginBottom: '16px',
                  fontSize: '13px',
                  color: '#ef4444',
                }}
              >
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                <AdminInput
                  icon={FiMail}
                  label="Admin Email"
                  type="email"
                  value={form.email}
                  onChange={e => {
                    setForm(p => ({ ...p, email: e.target.value }))
                    if (errors.email) setErrors(p => ({ ...p, email: '' }))
                  }}
                  placeholder="admin@rbjewellry.pk"
                  autoComplete="username"
                  error={errors.email}
                />

                <AdminInput
                  icon={FiLock}
                  label="Password"
                  showToggle
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword(p => !p)}
                  value={form.password}
                  onChange={e => {
                    setForm(p => ({ ...p, password: e.target.value }))
                    if (errors.password) setErrors(p => ({ ...p, password: '' }))
                  }}
                  placeholder="Enter admin password"
                  autoComplete="current-password"
                  error={errors.password}
                />

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
                      Signing in...
                    </span>
                  ) : (
                    '🔐 Sign In'
                  )}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Back link */}
          <p style={{ textAlign: 'center', marginTop: '16px' }}>
            <Link
              to="/"
              style={{ fontSize: '12px', color: '#d4af37', textDecoration: 'none' }}
            >
              ← Back to Store
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}

export default AdminLogin