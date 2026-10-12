import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const COLLECTIONS = [
  {
    label: 'Necklaces',
    path: '/collections/necklaces',
    emoji: '📿',
    desc: 'Gold plated necklace sets',
  },
  {
    label: 'Bangles & Bracelets',
    path: '/collections/bangles',
    emoji: '⭕',
    desc: 'Traditional & modern bangles',
  },
  {
    label: 'Party Jewellery',
    path: '/collections/party-jewellery',
    emoji: '🎉',
    desc: 'Earrings, rings & party sets',
  },
  {
    label: 'Bridal Sets',
    path: '/collections/bridal-set',
    emoji: '👰',
    desc: 'Complete wedding jewellery sets',
  },
  {
    label: 'Kundan Collection',
    path: '/collections/kundan',
    emoji: '✨',
    desc: 'Traditional kundan jewellery',
  },
  {
    label: 'Under Rs. 1000',
    path: '/collections/under-1000',
    emoji: '💎',
    desc: 'Affordable luxury pieces',
  },
]

const CollectionsDropdown = ({ isOpen, onClose }) => {
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: 10, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.97 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 rounded-2xl overflow-hidden shadow-2xl z-50"
          style={{
            background: '#1e1e1e',
            border: '1px solid #3d3d3d',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}
        >
          {/* Header */}
          <div
            className="px-4 py-3 border-b"
            style={{
              borderColor: '#3d3d3d',
              background: 'rgba(212,175,55,0.06)',
            }}
          >
            <p
              className="text-xs font-semibold tracking-widest uppercase"
              style={{ color: '#d4af37' }}
            >
              Our Collections
            </p>
          </div>

          {/* Links */}
          <div className="p-2">
            {COLLECTIONS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group"
                style={{ color: '#e5e5e5' }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(212,175,55,0.08)'
                  e.currentTarget.style.color = '#d4af37'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = '#e5e5e5'
                }}
              >
                <span className="text-xl w-8 text-center flex-shrink-0">
                  {item.emoji}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-tight">
                    {item.label}
                  </p>
                  <p
                    className="text-xs mt-0.5 truncate"
                    style={{ color: '#6b7280' }}
                  >
                    {item.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Footer */}
          <div
            className="px-4 py-2.5 border-t"
            style={{ borderColor: '#3d3d3d' }}
          >
            <Link
              to="/shop"
              onClick={onClose}
              className="flex items-center justify-center gap-2 text-xs font-medium transition-colors"
              style={{ color: '#d4af37' }}
            >
              View All Products →
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CollectionsDropdown