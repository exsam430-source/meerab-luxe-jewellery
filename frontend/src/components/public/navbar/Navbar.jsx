import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiShoppingCart,
  FiMenu,
  FiSearch,
  FiUser,
  FiX,
  FiChevronDown,
} from 'react-icons/fi'
import { useAuth } from '../../../context/AuthContext.jsx'
import useCart from '../../../hooks/useCart.js'
import useScrollPosition from '../../../hooks/useScrollPosition.js'
import MobileMenu from './MobileMenu.jsx'
import CollectionsDropdown from './CollectionsDropdown.jsx'

const NAV_LINKS = [
  { label: 'Home',           path: '/' },
  { label: 'Shop',           path: '/shop' },
  { label: 'Gold Jewellery', path: '/collections/gold-jewellery', isGold: true },
  { label: 'Collections',    path: '#', hasDropdown: true },
  { label: 'About',          path: '/about' },
  { label: 'Custom Order',   path: '/custom-order' },
]

const Navbar = () => {
  const { isScrolled }                    = useScrollPosition()
  const { isAuthenticated, user, logout } = useAuth()
  const { getCartCount }                  = useCart()
  const location                          = useLocation()
  const navigate                          = useNavigate()

  const [mobileOpen,      setMobileOpen]      = useState(false)
  const [collectionsOpen, setCollectionsOpen] = useState(false)
  const [searchOpen,      setSearchOpen]      = useState(false)
  const [searchQuery,     setSearchQuery]     = useState('')
  const [userMenuOpen,    setUserMenuOpen]    = useState(false)

  const cartCount = getCartCount()

  useEffect(() => {
    setMobileOpen(false)
    setCollectionsOpen(false)
    setSearchOpen(false)
    setUserMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest('.collections-dropdown')) {
        setCollectionsOpen(false)
      }
      if (!e.target.closest('.user-menu')) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    if (path === '#') return false
    return location.pathname.startsWith(path)
  }

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: isScrolled
            ? 'rgba(26, 26, 26, 0.97)'
            : 'rgba(26, 26, 26, 0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: isScrolled
            ? '1px solid #3d3d3d'
            : '1px solid transparent',
          boxShadow: isScrolled
            ? '0 4px 30px rgba(0,0,0,0.3)'
            : 'none',
        }}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* ── Logo ── */}
            <Link
              to="/"
              className="flex items-center gap-2.5 flex-shrink-0 group"
            >
              <img
                src="/logo.png"
                alt="MeerabLuxe Jewellers"
                style={{
                  width:     'clamp(32px, 4vw, 44px)',
                  height:    'clamp(32px, 4vw, 44px)',
                  objectFit: 'contain',
                  filter:    'drop-shadow(0 0 8px rgba(212,175,55,0.35))',
                }}
                onError={e => { e.target.style.display = 'none' }}
              />
              <div className="flex flex-col leading-none">
                <span
                  className="font-playfair font-bold gold-gradient-text"
                  style={{ fontSize: 'clamp(15px, 2.5vw, 21px)', letterSpacing: '1px' }}
                >
                  MeerabLuxe Jewellers
                </span>
                <span
                  className="font-cormorant text-[#a0a0a0]"
                  style={{ fontSize: 'clamp(9px, 1.5vw, 12px)', letterSpacing: '2.5px' }}
                >
                  GOLD SMITH — MINGORA, SWAT
                </span>
              </div>
            </Link>

            {/* ── Desktop Navigation ── */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                if (link.hasDropdown) {
                  return (
                    <div
                      key={link.label}
                      className="relative collections-dropdown"
                    >
                      <button
                        onClick={() => setCollectionsOpen(prev => !prev)}
                        className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                        style={{
                          color: collectionsOpen ? '#d4af37' : '#e5e5e5',
                          background: collectionsOpen
                            ? 'rgba(212,175,55,0.08)'
                            : 'transparent',
                        }}
                      >
                        {link.label}
                        <FiChevronDown
                          size={14}
                          className="transition-transform duration-200"
                          style={{
                            transform: collectionsOpen
                              ? 'rotate(180deg)'
                              : 'rotate(0deg)',
                          }}
                        />
                      </button>
                      <CollectionsDropdown
                        isOpen={collectionsOpen}
                        onClose={() => setCollectionsOpen(false)}
                      />
                    </div>
                  )
                }

                if (link.isGold) {
                  return (
                    <Link
                      key={link.label}
                      to={link.path}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
                      style={{
                        color: isActive(link.path) ? '#1a1a1a' : '#d4af37',
                        background: isActive(link.path)
                          ? '#d4af37'
                          : 'rgba(212,175,55,0.1)',
                        border: '1px solid rgba(212,175,55,0.3)',
                      }}
                      onMouseEnter={e => {
                        if (!isActive(link.path)) {
                          e.currentTarget.style.background = '#d4af37'
                          e.currentTarget.style.color      = '#1a1a1a'
                        }
                      }}
                      onMouseLeave={e => {
                        if (!isActive(link.path)) {
                          e.currentTarget.style.background = 'rgba(212,175,55,0.1)'
                          e.currentTarget.style.color      = '#d4af37'
                        }
                      }}
                    >
                      🥇 {link.label}
                    </Link>
                  )
                }

                return (
                  <Link
                    key={link.label}
                    to={link.path}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                    style={{
                      color: isActive(link.path) ? '#d4af37' : '#e5e5e5',
                      background: isActive(link.path)
                        ? 'rgba(212,175,55,0.08)'
                        : 'transparent',
                    }}
                    onMouseEnter={e => {
                      if (!isActive(link.path)) {
                        e.currentTarget.style.color      = '#d4af37'
                        e.currentTarget.style.background = 'rgba(212,175,55,0.06)'
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isActive(link.path)) {
                        e.currentTarget.style.color      = '#e5e5e5'
                        e.currentTarget.style.background = 'transparent'
                      }
                    }}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>

            {/* ── Right Actions ── */}
            <div className="flex items-center gap-1 md:gap-2">

              {/* Search */}
              <button
                onClick={() => setSearchOpen(prev => !prev)}
                className="p-2 rounded-lg transition-colors duration-200 hidden sm:flex items-center justify-center"
                style={{ color: searchOpen ? '#d4af37' : '#e5e5e5' }}
                onMouseEnter={e => e.currentTarget.style.color = '#d4af37'}
                onMouseLeave={e => {
                  if (!searchOpen) e.currentTarget.style.color = '#e5e5e5'
                }}
                aria-label="Search"
              >
                <FiSearch size={20} />
              </button>

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative user-menu hidden sm:block">
                  <button
                    onClick={() => setUserMenuOpen(prev => !prev)}
                    className="flex items-center gap-2 p-1.5 rounded-lg transition-colors"
                    style={{ color: '#d4af37' }}
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-7 h-7 rounded-full object-cover"
                        style={{ border: '1.5px solid #d4af37' }}
                      />
                    ) : (
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{
                          background: 'rgba(212,175,55,0.2)',
                          color:      '#d4af37',
                          border:     '1.5px solid #d4af37',
                        }}
                      >
                        {user?.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                    )}
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-48 rounded-xl overflow-hidden shadow-2xl z-50"
                        style={{
                          background: '#242424',
                          border:     '1px solid #3d3d3d',
                        }}
                      >
                        <div
                          className="px-4 py-3"
                          style={{ borderBottom: '1px solid #3d3d3d' }}
                        >
                          <p className="text-sm font-medium text-white truncate">
                            {user?.name}
                          </p>
                          <p className="text-xs text-[#a0a0a0] truncate">
                            {user?.email}
                          </p>
                        </div>
                        <Link
                          to="/track-order"
                          className="flex items-center px-4 py-2.5 text-sm text-[#e5e5e5] hover:text-[#d4af37] hover:bg-[#2d2d2d] transition-colors"
                        >
                          My Orders
                        </Link>
                        <button
                          onClick={logout}
                          className="w-full text-left flex items-center px-4 py-2.5 text-sm text-red-400 hover:bg-[#2d2d2d] transition-colors"
                        >
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden sm:flex items-center gap-1.5 p-2 rounded-lg transition-colors"
                  style={{ color: '#e5e5e5' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#d4af37'}
                  onMouseLeave={e => e.currentTarget.style.color = '#e5e5e5'}
                >
                  <FiUser size={20} />
                </Link>
              )}

              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2 rounded-lg transition-colors duration-200 flex items-center justify-center"
                style={{ color: '#e5e5e5' }}
                onMouseEnter={e => e.currentTarget.style.color = '#d4af37'}
                onMouseLeave={e => e.currentTarget.style.color = '#e5e5e5'}
                aria-label="Cart"
              >
                <FiShoppingCart size={22} />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
                    style={{
                      background: '#d4af37',
                      color:      '#1a1a1a',
                      fontSize:   '10px',
                    }}
                  >
                    {cartCount > 9 ? '9+' : cartCount}
                  </motion.span>
                )}
              </Link>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 rounded-lg transition-colors"
                style={{ color: '#e5e5e5' }}
                aria-label="Open menu"
              >
                <FiMenu size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Search Bar ── */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
              style={{ borderTop: '1px solid #3d3d3d' }}
            >
              <div className="container-custom py-3">
                <form
                  onSubmit={handleSearch}
                  className="flex items-center gap-3"
                >
                  <FiSearch size={18} className="text-[#a0a0a0] flex-shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search jewellery..."
                    autoFocus
                    className="flex-1 bg-transparent text-white text-sm outline-none placeholder-[#6b7280]"
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="text-[#a0a0a0] hover:text-white transition-colors"
                  >
                    <FiX size={18} />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── Spacer ── */}
      <div className="h-16 md:h-20" />

      {/* ── Mobile Menu ── */}
      <MobileMenu
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={logout}
        cartCount={cartCount}
      />
    </>
  )
}

export default Navbar