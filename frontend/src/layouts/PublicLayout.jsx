import { Outlet } from 'react-router-dom'
import Navbar from '../components/public/navbar/Navbar.jsx'
import Footer from '../components/public/footer/Footer.jsx'
import WhatsAppFloat from '../components/public/common/WhatsAppFloat.jsx'
import ErrorBoundary from '../components/common/ErrorBoundary.jsx'

const PublicLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen" style={{ background: '#1a1a1a' }}>
      {/* ✅ Navbar */}
      <Navbar />

      {/* ✅ Main Content */}
      <main className="flex-1">
        <ErrorBoundary>
          {children || <Outlet />}
        </ErrorBoundary>
      </main>

      {/* ✅ Footer */}
      <Footer />

      {/* ✅ Floating WhatsApp Button */}
      <WhatsAppFloat />
    </div>
  )
}

export default PublicLayout