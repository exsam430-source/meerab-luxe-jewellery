import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'
import ProductCard from '../product/ProductCard.jsx'
import Loader from '../../common/Loader.jsx'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const FeaturedProducts = ({
  title = 'Bestselling Pieces',
  subtitle = 'Most Loved',
  products = [],
  loading = false,
  viewAllLink = '/shop',
  viewAllLabel = 'View All Products',
}) => {
  return (
    <section className="py-14 md:py-20" style={{ background: '#111111' }}>
      <div className="container-custom">

        {/* ✅ Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="font-cormorant text-[#d4af37] text-lg mb-1">
              {subtitle}
            </p>
            <h2
              className="font-playfair font-bold text-white gold-underline"
              style={{ fontSize: 'clamp(22px, 4vw, 32px)' }}
            >
              {title}
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link
              to={viewAllLink}
              className="flex items-center gap-2 text-sm font-medium text-[#d4af37] hover:text-[#f4e5c2] transition-colors group"
            >
              {viewAllLabel}
              <FiArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </div>

        {/* ✅ Products Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader size="lg" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-[#6b7280]">
            <p>No products found</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5"
          >
            {products.slice(0, 8).map((product) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
              />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default FeaturedProducts