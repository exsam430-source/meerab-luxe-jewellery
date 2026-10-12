// UnderThousandPage.jsx
import { useEffect, useState } from 'react'
import SEO from '../../../components/common/SEO.jsx'
import CollectionHero from '../../../components/public/collection/CollectionHero.jsx'
import CollectionGrid from '../../../components/public/collection/CollectionGrid.jsx'
import { productApi } from '../../../api/productApi.js'
import { seoData } from '../../../utils/seoData.js'
import { getBreadcrumbSchema } from '../../../utils/structuredData.js'
import { useCart } from '../../../context/CartContext.jsx'

const UnderThousandPage = () => {
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
        const filtered = all.filter(p =>
          (p.price <= 1000 && p.inStock) ||
          p.showInUnder1000 === true || p.showInUnder1000 === 1
        )
        filtered.sort((a, b) => a.price - b.price)
        setProducts(filtered)
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
        title={seoData.under1000?.title || 'Jewellery Under Rs.1,000 | MeerabLuxe Jewellers'}
        description={seoData.under1000?.description}
        keywords={seoData.under1000?.keywords}
        canonical="/collections/under-1000"
        structuredData={getBreadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Collections', url: '/shop' },
          { name: 'Under Rs.1000', url: '/collections/under-1000' },
        ])}
      />
      <CollectionHero
        title="Beautiful Jewellery"
        subtitle="Affordable Luxury"
        badge="🏷️ Under Rs.1,000"
        description="Premium gold jewellery pieces that look expensive but are light on your wallet. Perfect gifts for any occasion — crafted with love from Sarafa Bazaar, Mingora Swat."
        productCount={products.length}
        loading={loading}
        accentColor="#4ade80"
        emoji="🏷️"
        imageSet="budget"
      />
      <CollectionGrid
        products={products}
        loading={loading}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Collections', url: '/shop' },
          { name: 'Under Rs.1000' },
        ]}
        seoDescription="Discover beautiful jewellery under Rs.1,000 at MeerabLuxe Jewellers. Great for gifts, daily wear, and special occasions. Free delivery above Rs.3,000. Cash on Delivery all over Pakistan."
        emptyMessage="No products under Rs.1,000 found"
        emptyDesc="Check back soon for new budget-friendly arrivals!"
      />
    </>
  )
}

export default UnderThousandPage