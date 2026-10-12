// PartyJewelleryPage.jsx
import { useEffect, useState } from 'react'
import SEO from '../../../components/common/SEO.jsx'
import CollectionHero from '../../../components/public/collection/CollectionHero.jsx'
import CollectionGrid from '../../../components/public/collection/CollectionGrid.jsx'
import { productApi } from '../../../api/productApi.js'
import { useCart } from '../../../context/CartContext.jsx'

const SUBCATEGORIES = [
  'Earrings', 'Rings', 'Maang Tikka',
  'Bridal Sets', 'Necklaces', 'Bangles', 'Hair Accessories',
]

const PartyJewelleryPage = () => {
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
          p.showInPartyWear === true || p.showInPartyWear === 1
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
        title="Party Jewellery Collection | MeerabLuxe Jewellers"
        description="Explore our stunning party jewellery collection. Earrings, rings, maang tikka, bridal sets and more."
        keywords="party jewellery, gold earrings, rings, maang tikka, party wear jewellery Pakistan"
        canonical="/collections/party-jewellery"
      />
      <CollectionHero
        title="Party Jewellery Collection"
        subtitle="Shine at Every Occasion"
        badge="🎉 Statement Pieces"
        description="Dazzle at every event with our premium gold party jewellery. From statement earrings to elegant maang tikkas — crafted for every special occasion."
        productCount={products.length}
        loading={loading}
        accentColor="#fb923c"
        emoji="🎉"
        imageSet="party"
      />
      <CollectionGrid
        products={products}
        loading={loading}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Collections', url: '/shop' },
          { name: 'Party Jewellery' },
        ]}
        seoDescription="Shop our gorgeous party jewellery collection at MeerabLuxe Jewellers. Free delivery above Rs.3,000. Cash on Delivery all over Pakistan."
        emptyMessage="No party jewellery found"
        emptyDesc="Check back soon for new arrivals!"
        subcategories={SUBCATEGORIES}
      />
    </>
  )
}

export default PartyJewelleryPage