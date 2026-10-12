import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import PageLoader from './PageLoader.jsx'

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdminAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) return <PageLoader />

  if (requireAdmin) {
    if (!isAdminAuthenticated) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />
    }
    return children
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute