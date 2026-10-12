import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import SEO from '../../components/common/SEO.jsx'
import Breadcrumb from '../../components/common/Breadcrumb.jsx'
import ProductGrid from '../../components/public/product/ProductGrid.jsx'
import ProductFilters from '../../components/public/product/ProductFilters.jsx'
import { productApi } from '../../api/productApi.js'
import { useCart } from '../../context/CartContext.jsx'
import { STORE_NAME } from '../../utils/constants.js'

const CategoryProducts = () => {
  const { category } = useParams()
  const { setProducts } = useCart()
  const [products, setLocalProducts] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ subCategory: '', sort: '', minPrice: '', maxPrice: '' })

  useEffect(() => {
    if (category) loadProducts()
  }, [category])

  useEffect(() => {
    applyFilters()
  }, [products, filters])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const res = await productApi.getAll()
      if (res.data.success) {
        const all = res.data.products || []
        const catProds = all.filter(p =>
          p.category?.toLowerCase() === category?.toLowerCase()
        )
        setLocalProducts(catProds)
        setFiltered(catProds)
        setProducts(all)
      }
    } catch (err) {
      console.error('Category load error:', err)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let result = [...products]
    if (filters.subCategory) {
      result = result.filter(p => p.subCategory === filters.subCategory)
    }
    if (filters.minPrice) result = result.filter(p => p.price >= Number(filters.minPrice))
    if (filters.maxPrice) result = result.filter(p => p.price <= Number(filters.maxPrice))
    if (filters.sort === 'price-low') result.sort((a, b) => a.price - b.price)
    else if (filters.sort === 'price-high') result.sort((a, b) => b.price - a.price)
    else if (filters.sort === 'newest') result.sort((a, b) => (b.date || 0) - (a.date || 0))
    setFiltered(result)
  }

  const categoryTitle = category
    ? `${category} Jewellery`
    : 'Jewellery Collection'

  return (
    <>
      <SEO
        title={`${categoryTitle} | ${STORE_NAME}`}
        description={`Shop premium ${category} jewellery at ${STORE_NAME}. Free delivery above Rs.3000.`}
        canonical={`/category/${category}`}
      />

      {/* Hero */}
      <div
        className="py-12 md:py-16"
        style={{ background: 'linear-gradient(135deg, #1a1000, #2d2000)' }}
      >
        <div className="container-custom text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-playfair font-bold text-white"
            style={{ fontSize: 'clamp(26px, 5vw, 44px)' }}
          >
            {categoryTitle}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[#6b7280] text-sm mt-2"
          >
            {loading ? 'Loading...' : `${filtered.length} products`}
          </motion.p>
        </div>
      </div>

      <div className="container-custom py-8">
        <Breadcrumb items={[
          { name: 'Home', url: '/' },
          { name: 'Shop', url: '/shop' },
          { name: categoryTitle },
        ]} />

        <div className="flex gap-6 mt-4">
          <ProductFilters
            filters={filters}
            onFilterChange={f => setFilters(prev => ({ ...prev, ...f }))}
            onClearFilters={() => setFilters({ subCategory: '', sort: '', minPrice: '', maxPrice: '' })}
            totalProducts={products.length}
            filteredCount={filtered.length}
          />
          <div className="flex-1 min-w-0">
            <ProductGrid
              products={filtered}
              loading={loading}
              showCount
              emptyMessage={`No ${category} jewellery found`}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default CategoryProducts