import { useState } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Sidebar from '../components/admin/Sidebar.jsx'
import AdminHeader from '../components/admin/AdminHeader.jsx'
import PageLoader from '../components/common/PageLoader.jsx'

const AdminLayout = () => {
  const { isAdminAuthenticated, loading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  if (loading) return <PageLoader />
  if (!isAdminAuthenticated) return <Navigate to="/admin/login" replace />

  return (
    <div
      className="flex min-h-screen"
      style={{ background: '#1a1a1a' }}
    >
      {/* ✅ Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        onToggleCollapse={() => setSidebarCollapsed(prev => !prev)}
      />

      {/* ✅ Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ✅ Main Content */}
      <div
        className="flex-1 flex flex-col min-w-0 transition-all duration-300"
        style={{
          marginLeft: 0,
        }}
      >
        {/* Admin Header */}
        <AdminHeader
          onMenuClick={() => setSidebarOpen(true)}
          sidebarCollapsed={sidebarCollapsed}
        />

        {/* Page Content */}
        <main
          className="flex-1 overflow-auto p-4 md:p-6"
          style={{ background: '#1a1a1a' }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout