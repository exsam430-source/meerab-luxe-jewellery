import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiX, FiHome, FiShoppingBag,
  FiPhone, FiInfo, FiUser, FiShoppingCart,
  FiLogOut, FiPackage,
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { WHATSAPP_NUMBER } from '../../../utils/constants.js'

const MAIN_LINKS = [
  { label: 'Home',         path: '/',             icon: FiHome },
  { label: 'Shop All',     path: '/shop',         icon: FiShoppingBag },
  { label: 'About Us',     path: '/about',        icon: FiInfo },
  { label: 'Custom Order', path: '/custom-order', icon: FiPhone },
]

const COLLECTION_LINKS = [
  {
    label:  '🥇 Gold Jewellery',
    path:   '/collections/gold-jewellery',
    isGold: true,
  },
  { label: 'Necklaces',        path: '/collections/necklaces'       },
  { label: 'Bangles',          path: '/collections/bangles'         },
  { label: 'Party Jewellery',  path: '/collections/party-jewellery' },
  { label: 'Kundan Jewellery', path: '/collections/kundan'          },
  { label: 'Bridal Sets',      path: '/collections/bridal-set'      },
  { label: 'Under Rs. 1000',   path: '/collections/under-1000'      },
]

const MobileMenu = ({
  isOpen,
  onClose,
  isAuthenticated,
  user,
  onLogout,
  cartCount,
}) => {
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Assalamu Alaikum! I'm interested in your jewellery. Please assist me."
  )}`

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 lg:hidden"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] z-50 overflow-y-auto lg:hidden"
            style={{
              background: '#1a1a1a',
              borderLeft: '1px solid #3d3d3d',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 sticky top-0"
              style={{
                background:   '#1a1a1a',
                borderBottom: '1px solid #3d3d3d',
              }}
            >
              <Link
                to="/"
                onClick={onClose}
                className="flex items-center gap-2"
              >
                <img
                  src="/logo.png"
                  alt="MeerabLuxe Jewellers"
                  style={{
                    width:     '30px',
                    height:    '30px',
                    objectFit: 'contain',
                    filter:    'drop-shadow(0 0 6px rgba(212,175,55,0.4))',
                  }}
                  onError={e => { e.target.style.display = 'none' }}
                />
                <div>
                  <p
                    className="font-playfair font-bold gold-gradient-text"
                    style={{ fontSize: '16px', letterSpacing: '1px' }}
                  >
                    MeerabLuxe Jewellers
                  </p>
                  <p
                    className="font-cormorant text-[#a0a0a0]"
                    style={{ fontSize: '10px', letterSpacing: '2px' }}
                  >
                    GOLD SMITH
                  </p>
                </div>
              </Link>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-[#a0a0a0] hover:text-white hover:bg-[#2d2d2d] transition-colors"
              >
                <FiX size={22} />
              </button>
            </div>

            <div className="p-5 space-y-6">

              {/* User Info */}
              {isAuthenticated && user && (
                <div
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{
                    background: 'rgba(212,175,55,0.08)',
                    border:     '1px solid rgba(212,175,55,0.2)',
                  }}
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover border border-[#d4af37]"
                    />
                  ) : (
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"
                      style={{ background: 'rgba(212,175,55,0.2)', color: '#d4af37' }}
                    >
                      {user.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{user.name}</p>
                    <p className="text-xs text-[#a0a0a0] truncate">{user.email}</p>
                  </div>
                </div>
              )}

              {/* Main Navigation */}
              <div>
                <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-widest mb-3">
                  Navigate
                </p>
                <div className="space-y-1">
                  {MAIN_LINKS.map((link) => {
                    const Icon = link.icon
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={onClose}
                        className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 text-[#e5e5e5] hover:text-[#d4af37] hover:bg-[#2d2d2d]"
                      >
                        <Icon size={18} />
                        <span className="text-sm font-medium">{link.label}</span>
                      </Link>
                    )
                  })}

                  {/* Cart */}
                  <Link
                    to="/cart"
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 text-[#e5e5e5] hover:text-[#d4af37] hover:bg-[#2d2d2d]"
                  >
                    <FiShoppingCart size={18} />
                    <span className="text-sm font-medium">Cart</span>
                    {cartCount > 0 && (
                      <span
                        className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ background: '#d4af37', color: '#1a1a1a' }}
                      >
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </div>
              </div>

              {/* Collections */}
              <div>
                <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-widest mb-3">
                  Collections
                </p>
                <div className="space-y-1">
                  {COLLECTION_LINKS.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={onClose}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200"
                      style={{
                        color: link.isGold ? '#d4af37' : '#a0a0a0',
                        background: link.isGold
                          ? 'rgba(212,175,55,0.08)'
                          : 'transparent',
                        border: link.isGold
                          ? '1px solid rgba(212,175,55,0.2)'
                          : '1px solid transparent',
                        fontWeight: link.isGold ? '600' : '400',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.color      = '#d4af37'
                        e.currentTarget.style.background = link.isGold
                          ? 'rgba(212,175,55,0.14)'
                          : '#2d2d2d'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.color      = link.isGold ? '#d4af37' : '#a0a0a0'
                        e.currentTarget.style.background = link.isGold
                          ? 'rgba(212,175,55,0.08)'
                          : 'transparent'
                      }}
                    >
                      {!link.isGold && (
                        <div
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: '#d4af37' }}
                        />
                      )}
                      <span className="text-sm">{link.label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Account */}
              <div>
                <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-widest mb-3">
                  Account
                </p>
                <div className="space-y-1">
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/track-order"
                        onClick={onClose}
                        className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-[#e5e5e5] hover:text-[#d4af37] hover:bg-[#2d2d2d]"
                      >
                        <FiPackage size={18} />
                        <span className="text-sm font-medium">My Orders</span>
                      </Link>
                      <button
                        onClick={() => { onLogout(); onClose() }}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-red-400 hover:bg-[#2d2d2d]"
                      >
                        <FiLogOut size={18} />
                        <span className="text-sm font-medium">Logout</span>
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      onClick={onClose}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-[#e5e5e5] hover:text-[#d4af37] hover:bg-[#2d2d2d]"
                    >
                      <FiUser size={18} />
                      <span className="text-sm font-medium">Login / Register</span>
                    </Link>
                  )}
                </div>
              </div>

              {/* WhatsApp CTA */}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-sm transition-all whatsapp-btn"
              >
                <FaWhatsapp size={20} />
                Order on WhatsApp
              </a>

              {/* Store Info */}
              <div
                className="rounded-xl p-4 text-center"
                style={{ background: '#242424', border: '1px solid #3d3d3d' }}
              >
                <p className="text-xs text-[#a0a0a0] leading-relaxed">
                  Sarafa Bazaar, Haji Baba Chowk
                  <br />
                  Mingora, Swat, Pakistan
                </p>
                <a
                  href="tel:+923454777588"
                  className="block mt-2 text-sm font-medium text-[#d4af37]"
                >
                  +92 345 4777588
                </a>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default MobileMenu