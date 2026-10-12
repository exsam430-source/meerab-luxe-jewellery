import { motion } from 'framer-motion'
import ProductCard from './ProductCard.jsx'
import Loader from '../../common/Loader.jsx'
import { FiPackage } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

const ProductGrid = ({
  products = [],
  loading = false,
  emptyMessage = 'No products found',
  emptyDesc = 'Try adjusting your filters or search query.',
  showCount = false,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="card-dark rounded-xl overflow-hidden">
            <div className="skeleton" style={{ aspectRatio: '1' }} />
            <div className="p-3 space-y-2">
              <div className="skeleton h-3 w-3/4 rounded" />
              <div className="skeleton h-3 w-1/2 rounded" />
              <div className="skeleton h-4 w-1/3 rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5"
          style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.15)' }}
        >
          <FiPackage size={32} style={{ color: '#d4af37' }} />
        </div>
        <h3 className="font-playfair text-xl text-white mb-2">{emptyMessage}</h3>
        <p className="text-[#6b7280] text-sm mb-5 max-w-xs">{emptyDesc}</p>
        <Link to="/shop" className="btn-gold text-sm">
          Browse All Products
        </Link>
      </div>
    )
  }

  return (
    <>
      {showCount && (
        <p className="text-sm text-[#6b7280] mb-4">
          Showing <span className="text-white font-medium">{products.length}</span> products
        </p>
      )}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5"
      >
        {products.map((product) => (
          <ProductCard
            key={product._id || product.id}
            product={product}
          />
        ))}
      </motion.div>
    </>
  )
}

export default ProductGrid