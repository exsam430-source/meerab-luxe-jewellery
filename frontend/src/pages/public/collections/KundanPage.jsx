// KundanPage.jsx
import { useEffect, useState } from 'react'
import SEO from '../../../components/common/SEO.jsx'
import CollectionHero from '../../../components/public/collection/CollectionHero.jsx'
import CollectionGrid from '../../../components/public/collection/CollectionGrid.jsx'
import { productApi } from '../../../api/productApi.js'
import { seoData } from '../../../utils/seoData.js'
import { getBreadcrumbSchema } from '../../../utils/structuredData.js'
import { useCart } from '../../../context/CartContext.jsx'

const SUBCATEGORIES = [
  'Kundan', 'Kundan Set', 'Kundan Necklace',
  'Kundan Earrings', 'Bridal Kundan', 'Meena Work',
]

const KundanPage = () => {
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
          p.subCategory === 'Kundan' || p.material === 'Kundan' ||
          p.showInKundan === true || p.showInKundan === 1 ||
          p.name?.toLowerCase().includes('kundan') ||
          p.description?.toLowerCase().includes('kundan')
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
        title={seoData.kundan?.title || 'Kundan Jewellery | MeerabLuxe Jewellers'}
        description={seoData.kundan?.description}
        keywords={seoData.kundan?.keywords}
        canonical="/collections/kundan"
        structuredData={getBreadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Collections', url: '/shop' },
          { name: 'Kundan', url: '/collections/kundan' },
        ])}
      />
      <CollectionHero
        title="Kundan Jewellery"
        subtitle="Traditional Craftsmanship"
        badge="💎 Authentic Kundan Art"
        description="Centuries-old stone-setting artistry, alive in every piece. Our kundan collection honours Pakistan's rich jewellery heritage — ideal for brides, festivals, and cultural celebrations."
        productCount={products.length}
        loading={loading}
        accentColor="#fbbf24"
        emoji="💎"
        imageSet="kundan"
      />
      <CollectionGrid
        products={products}
        loading={loading}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Collections', url: '/shop' },
          { name: 'Kundan' },
        ]}
        seoDescription="Explore our authentic kundan jewellery collection at MeerabLuxe Jewellers in Sarafa Bazaar, Mingora Swat. Free delivery above Rs.3,000."
        emptyMessage="No kundan jewellery found"
        emptyDesc="New kundan pieces are being crafted — check back soon!"
        subcategories={SUBCATEGORIES}
      />
    </>
  )
}

export default KundanPage