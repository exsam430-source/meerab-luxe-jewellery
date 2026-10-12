import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getOptimizedImageUrl } from '../../../utils/helpers.js'

const CATEGORIES = [
  {
    label: 'Necklaces',
    path: '/collections/necklaces',
    emoji: '📿',
    desc: 'Gold-plated sets',
    color: '#d4af37',
  },
  {
    label: 'Bangles',
    path: '/collections/bangles',
    emoji: '⭕',
    desc: 'Traditional & modern',
    color: '#f4e5c2',
  },
  {
    label: 'Kundan',
    path: '/collections/kundan',
    emoji: '💎',
    desc: 'Bridal & festive',
    color: '#d4af37',
  },
  {
    label: 'Under Rs.1000',
    path: '/collections/under-1000',
    emoji: '🏷️',
    desc: 'Affordable luxury',
    color: '#10b981',
  },
  {
    label: 'Ladies',
    path: '/category/Ladies',
    emoji: '👑',
    desc: 'All ladies jewellery',
    color: '#d4af37',
  },
  {
    label: 'Gents',
    path: '/category/Gents',
    emoji: '💍',
    desc: 'Men\'s collection',
    color: '#a0a0a0',
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const CategoriesSection = ({ products = [] }) => {
  // ✅ Get category images from products
  const getCategoryImage = (label) => {
    const map = {
      'Necklaces': 'Necklaces',
      'Bangles': 'Bangles',
      'Ladies': 'Ladies',
      'Gents': 'Gents',
    }
    const subCat = map[label]
    if (!subCat) return null

    const match = products.find(p =>
      subCat === 'Ladies' || subCat === 'Gents'
        ? p.category === subCat
        : p.subCategory === subCat
    )
    return match?.images?.[0] || null
  }

  return (
    <section className="py-14 md:py-20">
      <div className="container-custom">

        {/* ✅ Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-14"
        >
          <p className="section-subheading">Browse by Category</p>
          <h2 className="section-heading">Explore Our Collections</h2>
          <div className="gold-divider" />
        </motion.div>

        {/* ✅ Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-3 md:gap-5"
        >
          {CATEGORIES.map((cat) => {
            const img = getCategoryImage(cat.label)

            return (
              <motion.div key={cat.path} variants={itemVariants}>
                <Link
                  to={cat.path}
                  className="group flex flex-col items-center gap-3"
                >
                  {/* Circle */}
                  <div
                    className="relative w-full rounded-2xl overflow-hidden transition-all duration-300 group-hover:scale-105"
                    style={{
                      aspectRatio: '1',
                      background: img
                        ? 'transparent'
                        : `linear-gradient(135deg, ${cat.color}15, ${cat.color}08)`,
                      border: `1px solid ${cat.color}20`,
                      boxShadow: `0 0 0 0 ${cat.color}30`,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.boxShadow = `0 8px 30px ${cat.color}25`
                      e.currentTarget.style.borderColor = `${cat.color}40`
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.boxShadow = `0 0 0 0 ${cat.color}30`
                      e.currentTarget.style.borderColor = `${cat.color}20`
                    }}
                  >
                    {img ? (
                      <>
                        <img
                          src={getOptimizedImageUrl(img, 300, 80)}
                          alt={cat.label}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div
                          className="absolute inset-0"
                          style={{
                            background: 'linear-gradient(to top, rgba(26,26,26,0.6) 0%, transparent 60%)',
                          }}
                        />
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span style={{ fontSize: 'clamp(28px, 5vw, 42px)' }}>
                          {cat.emoji}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Label */}
                  <div className="text-center">
                    <p
                      className="font-medium text-white group-hover:text-[#d4af37] transition-colors duration-200 leading-tight"
                      style={{ fontSize: 'clamp(11px, 2.5vw, 14px)' }}
                    >
                      {cat.label}
                    </p>
                    <p
                      className="text-[#6b7280] mt-0.5 hidden sm:block"
                      style={{ fontSize: '11px' }}
                    >
                      {cat.desc}
                    </p>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

export default CategoriesSection