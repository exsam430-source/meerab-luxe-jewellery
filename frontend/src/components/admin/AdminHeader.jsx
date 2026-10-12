import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiMenu, FiBell, FiUser, FiSettings,
  FiLogOut, FiChevronDown, FiExternalLink,
} from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext.jsx'

const AdminHeader = ({ onMenuClick, sidebarCollapsed }) => {
  const { admin, adminLogout } = useAuth()
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)

  const handleLogout = () => {
    adminLogout()
    navigate('/admin/login')
  }

  return (
    <header
      className="sticky top-0 z-20 flex items-center justify-between px-4 md:px-6 h-16"
      style={{
        background: 'rgba(26,26,26,0.97)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #2d2d2d',
      }}
    >
      {/* Left side */}
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-[#a0a0a0] hover:text-white hover:bg-[#2d2d2d] transition-colors"
          aria-label="Open sidebar"
        >
          <FiMenu size={20} />
        </button>

        {/* Page title area */}
        <div className="hidden sm:block">
          <p className="text-xs text-[#6b7280] uppercase tracking-widest">
            Admin Panel
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">

        {/* View Store */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
          style={{
            color: '#a0a0a0',
            border: '1px solid #3d3d3d',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = '#d4af37'
            e.currentTarget.style.borderColor = '#d4af37'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = '#a0a0a0'
            e.currentTarget.style.borderColor = '#3d3d3d'
          }}
        >
          <FiExternalLink size={13} />
          View Store
        </a>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(prev => !prev)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors"
            style={{ color: '#e5e5e5' }}
            onMouseEnter={e => e.currentTarget.style.background = '#2d2d2d'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
              style={{
                background: 'linear-gradient(135deg, #d4af37, #b8960c)',
                color: '#1a1a1a',
              }}
            >
              {admin?.name?.[0]?.toUpperCase() || 'M'}
            </div>

            {/* Name */}
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-white leading-none">
                {admin?.name || 'MeerabLuxe Admin'}
              </p>
              <p className="text-xs text-[#a0a0a0] mt-0.5">
                Administrator
              </p>
            </div>

            <FiChevronDown
              size={14}
              className="text-[#a0a0a0] transition-transform duration-200 hidden md:block"
              style={{
                transform: profileOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            />
          </button>

          {/* Dropdown */}
          <AnimatePresence>
            {profileOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setProfileOpen(false)}
                />

                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-52 rounded-xl overflow-hidden shadow-2xl z-20"
                  style={{
                    background: '#242424',
                    border: '1px solid #3d3d3d',
                  }}
                >
                  {/* User Info */}
                  <div
                    className="px-4 py-3 border-b"
                    style={{ borderColor: '#3d3d3d' }}
                  >
                    <p className="text-sm font-semibold text-white">
                      {admin?.name || 'MeerabLuxe Admin'}
                    </p>
                    <p className="text-xs text-[#a0a0a0] truncate">
                      {admin?.email || 'meerabluxejewellers@gmail.com'}
                    </p>
                  </div>

                  {/* Menu Items */}
                  <div className="p-1.5">
                    <Link
                      to="/admin/settings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#e5e5e5] hover:text-[#d4af37] hover:bg-[#2d2d2d] transition-colors"
                    >
                      <FiSettings size={15} />
                      Store Settings
                    </Link>

                    <a
                      href="/"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#e5e5e5] hover:text-[#d4af37] hover:bg-[#2d2d2d] transition-colors"
                    >
                      <FiExternalLink size={15} />
                      View Store
                    </a>

                    <div
                      className="my-1 border-t"
                      style={{ borderColor: '#3d3d3d' }}
                    />

                    <button
                      onClick={() => {
                        setProfileOpen(false)
                        handleLogout()
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-[#2d2d2d] transition-colors"
                    >
                      <FiLogOut size={15} />
                      Logout
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader