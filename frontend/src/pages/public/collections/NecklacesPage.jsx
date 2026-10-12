// NecklacesPage.jsx
import { useEffect, useState } from 'react'
import SEO from '../../../components/common/SEO.jsx'
import CollectionHero from '../../../components/public/collection/CollectionHero.jsx'
import CollectionGrid from '../../../components/public/collection/CollectionGrid.jsx'
import { productApi } from '../../../api/productApi.js'
import { seoData } from '../../../utils/seoData.js'
import { getBreadcrumbSchema } from '../../../utils/structuredData.js'
import { useCart } from '../../../context/CartContext.jsx'

const SUBCATEGORIES = [
  'Necklaces', 'Choker', 'Pendant',
  'Long Necklace', 'Necklace Set', 'Bridal Necklace',
]

const NecklacesPage = () => {
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
          p.subCategory === 'Necklaces' || p.subCategory === 'Necklace Set' ||
          p.subCategory === 'Choker' || p.subCategory === 'Pendant' ||
          p.subCategory === 'Bridal Necklace' ||
          p.showInNecklaces === true || p.showInNecklaces === 1
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
        title={seoData.necklaces?.title || 'Gold Necklaces | MeerabLuxe Jewellers'}
        description={seoData.necklaces?.description}
        keywords={seoData.necklaces?.keywords}
        canonical="/collections/necklaces"
        structuredData={getBreadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Collections', url: '/shop' },
          { name: 'Necklaces', url: '/collections/necklaces' },
        ])}
      />
      <CollectionHero
        title="Gold Necklaces Collection"
        subtitle="Timeless Elegance"
        badge="📿 Statement Neckwear"
        description="From a delicate everyday pendant to an elaborate bridal necklace set — each piece is designed to make you feel like royalty. Premium craftsmanship from Sarafa Bazaar, Mingora Swat."
        productCount={products.length}
        loading={loading}
        accentColor="#e8d48b"
        emoji="📿"
        imageSet="necklaces"
      />
      <CollectionGrid
        products={products}
        loading={loading}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Collections', url: '/shop' },
          { name: 'Necklaces' },
        ]}
        seoDescription="Explore our stunning collection of gold necklaces at MeerabLuxe Jewellers. Free delivery above Rs.3,000. Cash on Delivery all over Pakistan."
        emptyMessage="No necklaces found"
        emptyDesc="New necklaces arriving soon — check back!"
        subcategories={SUBCATEGORIES}
      />
    </>
  )
}

export default NecklacesPage