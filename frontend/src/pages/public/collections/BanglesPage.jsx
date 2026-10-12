// BanglesPage.jsx
import { useEffect, useState } from 'react'
import SEO from '../../../components/common/SEO.jsx'
import CollectionHero from '../../../components/public/collection/CollectionHero.jsx'
import CollectionGrid from '../../../components/public/collection/CollectionGrid.jsx'
import { productApi } from '../../../api/productApi.js'
import { seoData } from '../../../utils/seoData.js'
import { getBreadcrumbSchema } from '../../../utils/structuredData.js'
import { useCart } from '../../../context/CartContext.jsx'

const SUBCATEGORIES = ['Bangles', 'Bracelets', 'Kangan', 'Bangle Set', 'Gold Bangles', 'Stone Bangles']

const BanglesPage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { setProducts: setCartProducts } = useCart()

  useEffect(() => { loadProducts() }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const res = await productApi.getAll()
      if (res.data.success) {
        const all = res.data.products || []
        setCartProducts(all)
        setProducts(all.filter(p =>
          p.subCategory === 'Bangles' || p.subCategory === 'Bracelets' ||
          p.subCategory === 'Bangle Set' || p.subCategory === 'Kangan' ||
          p.showInBangles === true || p.showInBangles === 1
        ))
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEO
        title={seoData.bangles?.title || 'Gold Bangles & Bracelets | MeerabLuxe Jewellers'}
        description={seoData.bangles?.description}
        keywords={seoData.bangles?.keywords}
        canonical="/collections/bangles"
        structuredData={getBreadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Collections', url: '/shop' },
          { name: 'Bangles', url: '/collections/bangles' },
        ])}
      />
      <CollectionHero
        title="Gold Bangles & Bracelets"
        subtitle="Wrist Wear Royalty"
        badge="⭕ Traditional & Modern"
        description="From timeless kangan sets to sleek gold-plated bracelets — each piece is crafted to grace your wrists with elegance. Perfect for weddings, mehndi, and everyday luxury."
        productCount={products.length}
        loading={loading}
        accentColor="#c084fc"
        emoji="⭕"
        imageSet="bangles"
      />
      <CollectionGrid
        products={products}
        loading={loading}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Collections', url: '/shop' },
          { name: 'Bangles & Bracelets' },
        ]}
        seoDescription="Browse our beautiful collection of gold bangles and bracelets at MeerabLuxe Jewellers, Sarafa Bazaar Mingora Swat. From traditional kangan sets to modern bracelets. Free delivery above Rs.3,000. Cash on Delivery all over Pakistan."
        emptyMessage="No bangles or bracelets found"
        emptyDesc="Our artisans are crafting new pieces — check back soon!"
        subcategories={SUBCATEGORIES}
      />
    </>
  )
}

export default BanglesPage