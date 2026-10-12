// BridalSetPage.jsx
import { useEffect, useState } from 'react'
import SEO from '../../../components/common/SEO.jsx'
import CollectionHero from '../../../components/public/collection/CollectionHero.jsx'
import CollectionGrid from '../../../components/public/collection/CollectionGrid.jsx'
import { productApi } from '../../../api/productApi.js'
import { getBreadcrumbSchema } from '../../../utils/structuredData.js'
import { useCart } from '../../../context/CartContext.jsx'

const SUBCATEGORIES = [
  'Bridal Set', 'Necklace Set', 'Jewellery Set',
  'Wedding Set', 'Kundan Set', 'Dulhan Set',
  'Bridal Necklace', 'Bridal Jewellery Set',
]

const BridalSetPage = () => {
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
          p.showInBridalSet === true || p.showInBridalSet === 1 ||
          p.subCategory === 'Bridal Set' || p.subCategory === 'Bridal Jewellery Set' ||
          p.subCategory === 'Bridal Necklace' || p.subCategory === 'Wedding Set' ||
          p.subCategory === 'Dulhan Set' || p.subCategory === 'Kundan Set'
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
        title="Bridal Jewellery Sets | MeerabLuxe Jewellers Pakistan"
        description="Stunning complete bridal jewellery sets for your special day. MeerabLuxe Jewellers, Sarafa Bazaar Mingora Swat."
        keywords="bridal jewellery set, dulhan set, wedding jewellery pakistan, bridal necklace set"
        canonical="/collections/bridal-set"
        structuredData={getBreadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Collections', url: '/shop' },
          { name: 'Bridal Sets', url: '/collections/bridal-set' },
        ])}
      />
      <CollectionHero
        title="Bridal Jewellery Sets"
        subtitle="For Your Most Special Day"
        badge="👰 Complete Dulhan Collections"
        description="Your wedding day deserves perfection. Our complete bridal sets make every bride radiant — from traditional dulhan sets to regal kundan masterpieces crafted with love."
        productCount={products.length}
        loading={loading}
        accentColor="#f9a8d4"
        emoji="👰"
        imageSet="bridal"
      />
      <CollectionGrid
        products={products}
        loading={loading}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Collections', url: '/shop' },
          { name: 'Bridal Sets' },
        ]}
        seoDescription="Discover our exquisite bridal jewellery sets at MeerabLuxe Jewellers. Complete bridal sets including necklace, earrings, maang tikka, bangles and more. Free delivery above Rs.3,000."
        emptyMessage="No bridal sets found"
        emptyDesc="New bridal collections arriving — WhatsApp us for custom orders!"
        subcategories={SUBCATEGORIES}
      />
    </>
  )
}

export default BridalSetPage