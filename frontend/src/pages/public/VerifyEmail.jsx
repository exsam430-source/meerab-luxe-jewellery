import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi'
import SEO from '../../components/common/SEO.jsx'
import { authApi } from '../../api/authApi.js'
import { useAuth } from '../../context/AuthContext.jsx'
import toast from 'react-hot-toast'

const VerifyEmail = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { updateUser } = useAuth()

  const [status, setStatus] = useState('verifying') // verifying | success | error
  const [message, setMessage] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) {
      setStatus('error')
      setMessage('No verification token found in the link.')
      return
    }
    verifyToken(token)
  }, [])

  const verifyToken = async (token) => {
    try {
      setStatus('verifying')
      const res = await authApi.verifyEmail(token)

      if (res.data.success) {
        if (res.data.token) {
          localStorage.setItem('token', res.data.token)
          localStorage.setItem('user', JSON.stringify(res.data.user))
          if (updateUser) updateUser(res.data.user)
        }
        setStatus('success')
        setMessage(res.data.message || 'Email verified successfully!')
        toast.success('Email verified! Welcome to MeerabLuxe Jewellers 🎉')

        setTimeout(() => {
          navigate('/', { replace: true })
        }, 3000)
      } else {
        setStatus('error')
        setMessage(res.data.message || 'Verification failed. Link may be expired.')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <>
      <SEO title="Verify Email | MeerabLuxe Jewellers" noIndex />

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
              padding: '40px 32px',
              textAlign: 'center',
            }}
          >
            {/* VERIFYING */}
            {status === 'verifying' && (
              <>
                <div
                  style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '50%',
                    background: 'rgba(212,175,55,0.1)',
                    border: '2px solid rgba(212,175,55,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      border: '3px solid #d4af37',
                      borderTopColor: 'transparent',
                      animation: 'spin 0.8s linear infinite',
                    }}
                  />
                </div>
                <h2
                  className="font-playfair"
                  style={{ color: '#ffffff', fontSize: '22px', fontWeight: 700, marginBottom: '10px' }}
                >
                  Verifying Your Email...
                </h2>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>
                  Please wait while we verify your email address.
                </p>
              </>
            )}

            {/* SUCCESS */}
            {status === 'success' && (
              <>
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
                  style={{ color: '#ffffff', fontSize: '22px', fontWeight: 700, marginBottom: '10px' }}
                >
                  Email Verified! 🎉
                </h2>
                <p style={{ color: '#a0a0a0', fontSize: '14px', lineHeight: 1.7, marginBottom: '24px' }}>
                  {message}
                  <br />
                  <span style={{ color: '#d4af37' }}>
                    Redirecting you to the store...
                  </span>
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
                      borderRadius: '2px',
                    }}
                  />
                </div>

                <Link
                  to="/"
                  className="btn-gold"
                  style={{
                    display: 'inline-block',
                    padding: '12px 32px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: 600,
                  }}
                >
                  Go to Store Now →
                </Link>
              </>
            )}

            {/* ERROR */}
            {status === 'error' && (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
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
                  <FiXCircle size={36} color="#ef4444" />
                </motion.div>
                <h2
                  className="font-playfair"
                  style={{ color: '#ffffff', fontSize: '22px', fontWeight: 700, marginBottom: '10px' }}
                >
                  Verification Failed
                </h2>
                <p style={{ color: '#a0a0a0', fontSize: '14px', lineHeight: 1.7, marginBottom: '24px' }}>
                  {message}
                </p>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <Link
                    to="/login"
                    className="btn-gold"
                    style={{
                      display: 'block',
                      padding: '12px 32px',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: 600,
                      textAlign: 'center',
                    }}
                  >
                    Go to Login
                  </Link>
                  <p style={{ color: '#6b7280', fontSize: '13px' }}>
                    Didn't get the email?{' '}
                    <Link
                      to="/login"
                      style={{ color: '#d4af37', textDecoration: 'none' }}
                    >
                      Resend verification
                    </Link>
                  </p>
                </div>
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

export default VerifyEmail