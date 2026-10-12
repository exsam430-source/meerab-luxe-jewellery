import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiGrid,
  FiPackage,
  FiShoppingBag,
  FiStar,
  FiSettings,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
  FiTool,
  FiTrendingUp, 
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'

const NAV_ITEMS = [
  {
    section: 'Main',
    items: [
      {
        label: 'Dashboard',
        path: '/admin/dashboard',
        icon: FiGrid,
      },
    ],
  },
  {
    section: 'Products',
    items: [
      {
        label: 'All Products',
        path: '/admin/products',
        icon: FiPackage,
      },
      {
        label: 'Add Product',
        path: '/admin/products/add',
        icon: FiTool,
      },
      // ✅ ADD THIS
      {
        label: 'Gold Price',
        path: '/admin/gold-price',
        icon: FiTrendingUp,
      },
    ],
  },
  {
    section: 'Orders',
    items: [
      {
        label: 'All Orders',
        path: '/admin/orders',
        icon: FiShoppingBag,
      },
      {
        label: 'Custom Orders',
        path: '/admin/custom-orders',
        icon: FiTool,
      },
      {
        label: 'Returns',
        path: '/admin/returns',
        icon: FiRefreshCw,
      },
    ],
  },
  {
    section: 'Content',
    items: [
      {
        label: 'Reviews',
        path: '/admin/reviews',
        icon: FiStar,
      },
    ],
  },
  {
    section: 'System',
    items: [
      {
        label: 'Settings',
        path: '/admin/settings',
        icon: FiSettings,
      },
    ],
  },
]

const Sidebar = ({
  isOpen,
  isCollapsed,
  onClose,
  onToggleCollapse,
}) => {
  const location = useLocation()

  const SidebarContent = () => (
    <div className="flex flex-col h-full">

      {/* ✅ Logo */}
      <div
        className="flex items-center justify-between px-4 py-5 border-b flex-shrink-0"
        style={{ borderColor: '#2d2d2d' }}
      >
        {!isCollapsed && (
          <div>
            <p
              className="font-playfair font-bold gold-gradient-text"
              style={{ fontSize: '16px', letterSpacing: '0.5px' }}
            >
              MeerabLuxe Jewellers
            </p>
            <p
              className="text-[#6b7280] mt-0.5"
              style={{ fontSize: '10px', letterSpacing: '2px' }}
            >
              ADMIN PANEL
            </p>
          </div>
        )}

        {isCollapsed && (
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto"
            style={{
              background: 'linear-gradient(135deg, #d4af37, #b8960c)',
            }}
          >
            <span className="text-[#1a1a1a] font-bold text-sm">ML</span>
          </div>
        )}

        {/* Collapse toggle — desktop only */}
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex p-1.5 rounded-lg text-[#6b7280] hover:text-white hover:bg-[#2d2d2d] transition-colors"
        >
          {isCollapsed
            ? <FiChevronRight size={16} />
            : <FiChevronLeft size={16} />
          }
        </button>

        {/* Mobile close */}
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg text-[#6b7280] hover:text-white hover:bg-[#2d2d2d] transition-colors"
        >
          <FiX size={18} />
        </button>
      </div>

      {/* ✅ Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {NAV_ITEMS.map((section) => (
          <div key={section.section} className="mb-5">

            {/* Section Label */}
            {!isCollapsed && (
              <p
                className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: '#4a4a4a' }}
              >
                {section.section}
              </p>
            )}

            {section.items.map((item) => {
              const Icon = item.icon

              const isActive =
                item.path === '/admin/dashboard'
                  ? location.pathname === '/admin/dashboard'
                  : location.pathname.startsWith(item.path)

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => {
                    if (window.innerWidth < 1024) onClose()
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 transition-all duration-200 group relative"
                  style={{
                    background: isActive
                      ? 'rgba(212,175,55,0.12)'
                      : 'transparent',
                    color: isActive ? '#d4af37' : '#a0a0a0',
                    borderLeft: isActive
                      ? '2px solid #d4af37'
                      : '2px solid transparent',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = '#2d2d2d'
                      e.currentTarget.style.color = '#e5e5e5'
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = '#a0a0a0'
                    }
                  }}
                  title={isCollapsed ? item.label : ''}
                >
                  <Icon size={18} className="flex-shrink-0" />

                  {!isCollapsed && (
                    <span className="text-sm font-medium truncate">
                      {item.label}
                    </span>
                  )}

                  {/* ✅ Tooltip when collapsed */}
                  {isCollapsed && (
                    <div
                      className="absolute left-full ml-3 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50"
                      style={{
                        background: '#2d2d2d',
                        color: '#e5e5e5',
                        border: '1px solid #3d3d3d',
                      }}
                    >
                      {item.label}
                    </div>
                  )}
                </NavLink>
              )
            })}
          </div>
        ))}
      </nav>

      {/* ✅ Bottom WhatsApp */}
      {!isCollapsed && (
        <div
          className="p-4 border-t"
          style={{ borderColor: '#2d2d2d' }}
        >
          <a
            href="https://wa.me/923184887631"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 w-full py-2.5 px-3 rounded-xl text-sm font-medium transition-all"
            style={{
              background: 'rgba(37,211,102,0.08)',
              color: '#25d366',
              border: '1px solid rgba(37,211,102,0.15)',
            }}
            onMouseEnter={e =>
              e.currentTarget.style.background = 'rgba(37,211,102,0.18)'
            }
            onMouseLeave={e =>
              e.currentTarget.style.background = 'rgba(37,211,102,0.08)'
            }
          >
            <FaWhatsapp size={18} />
            <span>WhatsApp</span>
          </a>
        </div>
      )}

      {/* Collapsed WhatsApp icon only */}
      {isCollapsed && (
        <div className="p-3 border-t" style={{ borderColor: '#2d2d2d' }}>
          <a
            href="https://wa.me/923184887631"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full py-2 rounded-xl transition-all"
            style={{
              background: 'rgba(37,211,102,0.08)',
              color: '#25d366',
            }}
          >
            <FaWhatsapp size={18} />
          </a>
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* ✅ Desktop Sidebar */}
      <aside
        className="hidden lg:flex flex-col flex-shrink-0 h-screen sticky top-0 transition-all duration-300"
        style={{
          width: isCollapsed ? '72px' : '240px',
          background: '#111111',
          borderRight: '1px solid #2d2d2d',
        }}
      >
        <SidebarContent />
      </aside>

      {/* ✅ Mobile Sidebar Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="fixed top-0 left-0 bottom-0 w-64 z-40 lg:hidden flex flex-col"
            style={{
              background: '#111111',
              borderRight: '1px solid #2d2d2d',
            }}
          >
            <SidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}

export default Sidebar