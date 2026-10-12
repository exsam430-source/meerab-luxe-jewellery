import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiHome, FiShoppingBag, FiSearch } from 'react-icons/fi'
import SEO from '../../components/common/SEO.jsx'

const NotFound = () => {
  return (
    <>
      <SEO
        title="404 - Page Not Found | MeerabLuxe Jewellers"
        description="The page you're looking for doesn't exist."
        noIndex
      />

      <div
        className="min-h-screen flex items-center justify-center py-12 px-4"
        style={{ background: '#1a1a1a' }}
      >
        <div className="text-center max-w-md">

          {/* 404 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
          >
            <p
              className="font-playfair font-bold gold-gradient-text"
              style={{ fontSize: 'clamp(80px, 15vw, 140px)', lineHeight: 1 }}
            >
              404
            </p>
          </motion.div>

          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl mb-4"
          >
            💍
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-playfair font-bold text-white text-2xl mb-2"
          >
            Page Not Found
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-[#6b7280] text-sm mb-8 max-w-xs mx-auto"
          >
            The jewellery piece you're looking for seems to have moved
            or doesn't exist. Let's find something beautiful for you!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link
              to="/"
              className="btn-gold flex items-center justify-center gap-2"
            >
              <FiHome size={16} />
              Go Home
            </Link>
            <Link
              to="/shop"
              className="btn-outline-gold flex items-center justify-center gap-2"
            >
              <FiShoppingBag size={16} />
              Browse Shop
            </Link>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-10"
          >
            <p className="text-xs text-[#6b7280] mb-3">
              Popular Collections:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { label: 'Necklaces', path: '/collections/necklaces' },
                { label: 'Bangles', path: '/collections/bangles' },
                { label: 'Kundan', path: '/collections/kundan' },
                { label: 'Under Rs.1000', path: '/collections/under-1000' },
              ].map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-xs px-3 py-1.5 rounded-lg transition-all"
                  style={{
                    background: '#2d2d2d',
                    color: '#a0a0a0',
                    border: '1px solid #3d3d3d',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = '#d4af37'
                    e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = '#a0a0a0'
                    e.currentTarget.style.borderColor = '#3d3d3d'
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default NotFound