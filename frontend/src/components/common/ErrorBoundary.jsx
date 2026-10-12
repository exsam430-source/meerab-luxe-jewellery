import { Component } from 'react'
import { FiAlertTriangle, FiRefreshCw, FiHome } from 'react-icons/fi'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
    this.setState({ errorInfo })
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            background: '#1a1a1a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          <div
            style={{
              maxWidth: '500px',
              width: '100%',
              textAlign: 'center',
            }}
          >
            {/* ✅ Icon */}
            <div
              style={{
                width: '80px',
                height: '80px',
                background: 'rgba(239, 68, 68, 0.1)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                border: '1px solid rgba(239, 68, 68, 0.3)',
              }}
            >
              <FiAlertTriangle
                size={36}
                style={{ color: '#ef4444' }}
              />
            </div>

            {/* ✅ Title */}
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '28px',
                color: '#ffffff',
                marginBottom: '12px',
              }}
            >
              Something Went Wrong
            </h1>

            {/* ✅ Message */}
            <p
              style={{
                color: '#a0a0a0',
                fontSize: '15px',
                lineHeight: '1.6',
                marginBottom: '32px',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              We apologize for the inconvenience. An unexpected error occurred.
              Please try refreshing the page or go back to home.
            </p>

            {/* ✅ Error details (dev only) */}
            {import.meta.env.DEV && this.state.error && (
              <div
                style={{
                  background: '#2d2d2d',
                  border: '1px solid #3d3d3d',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '24px',
                  textAlign: 'left',
                  overflow: 'auto',
                  maxHeight: '150px',
                }}
              >
                <p
                  style={{
                    color: '#ef4444',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all',
                  }}
                >
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            {/* ✅ Actions */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              {/* Retry */}
              <button
                onClick={this.handleRetry}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, #d4af37, #b8960c)',
                  color: '#1a1a1a',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                <FiRefreshCw size={16} />
                Try Again
              </button>

              {/* Reload */}
              <button
                onClick={this.handleReload}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'transparent',
                  color: '#d4af37',
                  border: '1px solid #d4af37',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '14px',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                <FiRefreshCw size={16} />
                Reload Page
              </button>

              {/* Home */}
              <button
                onClick={this.handleGoHome}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'transparent',
                  color: '#a0a0a0',
                  border: '1px solid #3d3d3d',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '14px',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                <FiHome size={16} />
                Go Home
              </button>
            </div>

            {/* ✅ Contact */}
            <p
              style={{
                color: '#6b7280',
                fontSize: '13px',
                marginTop: '32px',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Need help?{' '}
              <a
                href="https://wa.me/923184887631"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#25d366', textDecoration: 'none' }}
              >
                Contact us on WhatsApp
              </a>
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary