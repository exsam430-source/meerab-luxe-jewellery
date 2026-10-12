import { useEffect, useState } from 'react'
import SEO from '../../components/common/SEO.jsx'
import HeroBanner from '../../components/public/home/HeroBanner.jsx'
import MarqueeSection from '../../components/public/home/MarqueeSection.jsx'
import CategoriesSection from '../../components/public/home/CategoriesSection.jsx'
import FeaturedProducts from '../../components/public/home/FeaturedProducts.jsx'
import CollectionBanners from '../../components/public/home/CollectionBanners.jsx'
import UnderThousandSlider from '../../components/public/home/UnderThousandSlider.jsx'
import TrustSection from '../../components/public/home/TrustSection.jsx'
import ReviewsSection from '../../components/public/home/ReviewsSection.jsx'
import FAQSection from '../../components/public/home/FAQSection.jsx'
import { productApi } from '../../api/productApi.js'
import { seoData } from '../../utils/seoData.js'
import { getJewelryStoreSchema, getFAQSchema } from '../../utils/structuredData.js'
import { useCart } from '../../context/CartContext.jsx'

const Home = () => {
  const [products, setProducts] = useState([])
  const [bestsellers, setBestsellers] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [under1000, setUnder1000] = useState([])
  const [loading, setLoading] = useState(true)
  const { setProducts: setCartProducts } = useCart()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const res = await productApi.getAll()
      if (res.data.success) {
        const all = res.data.products || []
        setProducts(all)
        setCartProducts(all)

        // Filter products
        setBestsellers(all.filter(p => p.bestseller && p.inStock))
        setNewArrivals(all.filter(p => p.newArrival && p.inStock))
        setUnder1000(all.filter(p => p.price <= 1000 && p.inStock))
      }
    } catch (error) {
      console.error('Home data load error:', error)
    } finally {
      setLoading(false)
    }
  }

  // ✅ Use new arrivals if bestsellers are empty
  const featuredProducts = bestsellers.length > 0
    ? bestsellers
    : newArrivals.length > 0
      ? newArrivals
      : products.slice(0, 8)

  const seo = seoData.home
  const storeSchema = getJewelryStoreSchema()
  const faqSchema = getFAQSchema()

  return (
    <>
      {/* ✅ SEO */}
      <SEO
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
        ogImage={seo.ogImage}
        canonical="/"
        structuredData={storeSchema}
      />

      {/* ✅ Hero Banner */}
      <HeroBanner />

      {/* ✅ Marquee */}
      <MarqueeSection />

      {/* ✅ Categories */}
      <CategoriesSection products={products} />

      {/* ✅ Featured / Bestsellers */}
      <FeaturedProducts
        title={bestsellers.length > 0 ? 'Bestselling Pieces' : 'New Arrivals'}
        subtitle={bestsellers.length > 0 ? 'Most Loved' : 'Just Arrived'}
        products={featuredProducts}
        loading={loading}
        viewAllLink="/shop"
        viewAllLabel="View All Products"
      />

      {/* ✅ Collection Banners */}
      <CollectionBanners products={products} />

      {/* ✅ Under 1000 Slider */}
      <UnderThousandSlider
        products={under1000}
        loading={loading}
      />

      {/* ✅ Trust Section */}
      <TrustSection />

      {/* ✅ Reviews */}
      <ReviewsSection />

      {/* ✅ FAQ */}
      <FAQSection />
    </>
  )
}

export default Home