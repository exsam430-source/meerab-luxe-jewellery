// ProductDetail.jsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiShoppingCart, FiShare2, FiCheck, FiPackage, FiTruck, FiShield } from 'react-icons/fi'
import { FaWhatsapp, FaFacebook } from 'react-icons/fa'
import SEO from '../../components/common/SEO.jsx'
import Breadcrumb from '../../components/common/Breadcrumb.jsx'
import ImageGallery from '../../components/public/product/ImageGallery.jsx'
import WhatsAppOrderBtn from '../../components/public/product/WhatsAppOrderBtn.jsx'
import RelatedProducts from '../../components/public/product/RelatedProducts.jsx'
import ReviewSection from '../../components/public/product/ReviewSection.jsx'
import Loader from '../../components/common/Loader.jsx'
import { productApi } from '../../api/productApi.js'
import { getProductSEO } from '../../utils/seoData.js'
import { getProductSchema, getBreadcrumbSchema } from '../../utils/structuredData.js'
import { formatPrice, getDiscountPercent } from '../../utils/helpers.js'
import { createProductWhatsAppLink } from '../../utils/whatsappLink.js'
import useCart from '../../hooks/useCart.js'
import useSettings from '../../hooks/useSettings.js'
import { useCart as useCartContext } from '../../context/CartContext.jsx' // ✅ ADD THIS
import { SITE_URL } from '../../utils/constants.js'
import toast from 'react-hot-toast'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart, isInCart } = useCart() // ✅ REMOVE setProducts from here
  const { setProducts: setCartProducts } = useCartContext() // ✅ GET setProducts from context directly
  const { settings } = useSettings()

  const [product, setProduct] = useState(null)
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [activeTab, setActiveTab] = useState('description')

  useEffect(() => {
    if (id) loadProduct()
  }, [id])

  const loadProduct = async () => {
    try {
      setLoading(true)
      const [productRes, allRes] = await Promise.all([
        productApi.getById(id),
        productApi.getAll(),
      ])

      if (productRes.data.success) {
        const p = productRes.data.product
        setProduct(p)
        if (p.sizes?.length > 0) setSelectedSize(p.sizes[0])
        if (p.colors?.length > 0) setSelectedColor(p.colors[0])
      } else {
        navigate('/shop')
      }

      if (allRes.data.success) {
        setAllProducts(allRes.data.products || [])
        setCartProducts(allRes.data.products || []) // ✅ Now works correctly
      }
    } catch (error) {
      console.error('Product load error:', error)
      navigate('/shop')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!product.inStock) return
    if (product.sizes?.length > 0 && !selectedSize) {
      toast.error('Please select a size')
      return
    }
    setAdding(true)
    await addToCart(
      String(product._id || product.id),
      selectedSize || 'defaultSize',
      selectedColor || 'defaultColor'
    )
    setAdding(false)
  }

  const handleShare = async () => {
    const url = `${SITE_URL}/product/${id}`
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, url })
      } catch { /* cancelled */ }
    } else {
      navigator.clipboard.writeText(url)
      toast.success('Link copied to clipboard!')
    }
  }

  if (loading) return <PageLoadingState />
  if (!product) return null

  const productId = String(product._id || product.id)
  const discount = getDiscountPercent(product.price, product.comparePrice)
  const inCart = isInCart(productId, selectedSize || 'defaultSize', selectedColor || 'defaultColor')
  const seo = getProductSEO(product)
  const productSchema = getProductSchema(product)
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Shop', url: '/shop' },
    { name: product.category, url: `/category/${product.category}` },
    { name: product.name, url: `/product/${productId}` },
  ])

  const relatedProducts = allProducts.filter(
    p => p.category === product.category && String(p._id || p.id) !== productId
  )

  const whatsappLink = createProductWhatsAppLink(product, settings?.whatsappNumber)
  const shareUrl = `${SITE_URL}/product/${productId}`
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`

  return (
    <>
      <SEO
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
        ogImage={seo.ogImage}
        ogType="product"
        canonical={`/product/${productId}`}
        structuredData={productSchema}
      />

      <div className="container-custom py-6">

        <Breadcrumb items={[
          { name: 'Home', url: '/' },
          { name: 'Shop', url: '/shop' },
          { name: product.category, url: `/category/${product.category}` },
          { name: product.name },
        ]} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mt-4">

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ImageGallery
              images={product.images || []}
              productName={product.name}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-5"
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span className="badge-gold text-xs">{product.subCategory || product.category}</span>
              {product.bestseller && <span className="badge-gold">🔥 Bestseller</span>}
              {product.newArrival && <span className="badge-new">✨ New Arrival</span>}
              {!product.inStock && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}
                >
                  Out of Stock
                </span>
              )}
            </div>

            <h1
              className="font-playfair font-bold text-white"
              style={{ fontSize: 'clamp(22px, 4vw, 34px)', lineHeight: 1.2 }}
            >
              {product.name}
            </h1>

            <div className="flex items-center gap-3 flex-wrap">
              <span
                className="font-bold"
                style={{ fontSize: 'clamp(22px, 4vw, 30px)', color: '#d4af37' }}
              >
                {formatPrice(product.price)}
              </span>
              {discount > 0 && (
                <>
                  <span className="text-lg text-[#6b7280] line-through">
                    {formatPrice(product.comparePrice)}
                  </span>
                  <span className="badge-sale text-sm">
                    Save {discount}%
                  </span>
                </>
              )}
            </div>

            {product.description && (
              <p className="text-[#a0a0a0] text-sm leading-relaxed">
                {product.description}
              </p>
            )}

            {product.sizes?.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-[#a0a0a0] mb-2">
                  Size: <span className="text-white">{selectedSize}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                      style={{
                        background: selectedSize === size ? 'rgba(212,175,55,0.15)' : '#2d2d2d',
                        color: selectedSize === size ? '#d4af37' : '#a0a0a0',
                        border: `1px solid ${selectedSize === size ? 'rgba(212,175,55,0.4)' : '#3d3d3d'}`,
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.colors?.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-[#a0a0a0] mb-2">
                  Color: <span className="text-white">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                      style={{
                        background: selectedColor === color ? 'rgba(212,175,55,0.15)' : '#2d2d2d',
                        color: selectedColor === color ? '#d4af37' : '#a0a0a0',
                        border: `1px solid ${selectedColor === color ? 'rgba(212,175,55,0.4)' : '#3d3d3d'}`,
                      }}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock || adding}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-sm transition-all"
                style={{
                  background: inCart
                    ? 'rgba(16,185,129,0.15)'
                    : product.inStock
                      ? 'linear-gradient(135deg, #d4af37, #b8960c)'
                      : '#2d2d2d',
                  color: inCart ? '#10b981' : product.inStock ? '#1a1a1a' : '#6b7280',
                  cursor: product.inStock ? 'pointer' : 'not-allowed',
                  border: inCart ? '1px solid rgba(16,185,129,0.3)' : 'none',
                }}
              >
                {adding ? (
                  <div className="w-5 h-5 rounded-full border-2 animate-spin" style={{ borderColor: '#1a1a1a', borderTopColor: 'transparent' }} />
                ) : inCart ? (
                  <>
                    <FiCheck size={18} />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <FiShoppingCart size={18} />
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </>
                )}
              </button>

              <WhatsAppOrderBtn product={product} size="md" />
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-[#6b7280]">Share:</span>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                style={{ background: 'rgba(37,211,102,0.1)', color: '#25d366' }}
                aria-label="Share on WhatsApp"
              >
                <FaWhatsapp size={16} />
              </a>
              <a
                href={facebookShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}
                aria-label="Share on Facebook"
              >
                <FaFacebook size={16} />
              </a>
              <button
                onClick={handleShare}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                style={{ background: '#2d2d2d', color: '#a0a0a0' }}
                aria-label="Share link"
              >
                <FiShare2 size={16} />
              </button>
            </div>

            <div
              className="rounded-xl p-4 space-y-2"
              style={{ background: '#242424', border: '1px solid #3d3d3d' }}
            >
              {[
                { label: 'Category', value: product.category },
                { label: 'Type', value: product.subCategory },
                { label: 'Material', value: product.material },
                product.weight && { label: 'Weight', value: product.weight },
                product.sku && { label: 'SKU', value: product.sku },
              ].filter(Boolean).map(item => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <span className="text-[#6b7280]">{item.label}:</span>
                  <span className="text-[#e5e5e5] font-medium">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: FiTruck, text: 'Free delivery above Rs.3000', color: '#d4af37' },
                { icon: FiPackage, text: 'Ships in 1-2 days', color: '#3b82f6' },
                { icon: FiShield, text: '7-day return policy', color: '#10b981' },
              ].map((item, i) => {
                const Icon = item.icon
                return (
                  <div
                    key={i}
                    className="flex flex-col items-center text-center gap-1.5 p-3 rounded-xl"
                    style={{ background: '#242424', border: '1px solid #3d3d3d' }}
                  >
                    <Icon size={18} style={{ color: item.color }} />
                    <p className="text-[10px] text-[#6b7280] leading-tight">{item.text}</p>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </div>

        <div className="mt-12">
          <div
            className="flex gap-1 border-b mb-6"
            style={{ borderColor: '#3d3d3d' }}
          >
            {[
              { id: 'description', label: 'Description' },
              { id: 'details', label: 'Product Details' },
              { id: 'reviews', label: 'Reviews' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="px-5 py-3 text-sm font-medium transition-all relative"
                style={{ color: activeTab === tab.id ? '#d4af37' : '#a0a0a0' }}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ background: '#d4af37' }}
                  />
                )}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <div className="text-[#a0a0a0] text-sm leading-relaxed max-w-3xl">
              <p>{product.description}</p>
              {product.longDescription?.overview && (
                <p className="mt-4">{product.longDescription.overview}</p>
              )}
            </div>
          )}

          {activeTab === 'details' && (
            <div className="max-w-2xl">
              <div
                className="rounded-2xl overflow-hidden"
                style={{ border: '1px solid #3d3d3d' }}
              >
                {[
                  { label: 'Material', value: product.material },
                  { label: 'Category', value: product.category },
                  { label: 'Type', value: product.subCategory },
                  product.weight && { label: 'Weight', value: product.weight },
                  product.stoneType && { label: 'Stone Type', value: product.stoneType },
                  product.stoneColor && { label: 'Stone Color', value: product.stoneColor },
                  product.sku && { label: 'SKU', value: product.sku },
                ].filter(Boolean).map((item, i, arr) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between px-5 py-3 text-sm"
                    style={{
                      background: i % 2 === 0 ? '#242424' : '#2d2d2d',
                      borderBottom: i < arr.length - 1 ? '1px solid #3d3d3d' : 'none',
                    }}
                  >
                    <span className="text-[#6b7280]">{item.label}</span>
                    <span className="text-[#e5e5e5] font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <ReviewSection productId={productId} />
          )}
        </div>

        <RelatedProducts
          products={relatedProducts}
          currentId={productId}
        />
      </div>
    </>
  )
}

const PageLoadingState = () => (
  <div className="container-custom py-6">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
      <div className="skeleton rounded-2xl" style={{ aspectRatio: '1' }} />
      <div className="space-y-4">
        <div className="skeleton h-4 w-32 rounded" />
        <div className="skeleton h-8 w-3/4 rounded" />
        <div className="skeleton h-10 w-1/3 rounded" />
        <div className="skeleton h-20 w-full rounded" />
        <div className="skeleton h-12 w-full rounded" />
        <div className="skeleton h-12 w-full rounded" />
      </div>
    </div>
  </div>
)

export default ProductDetail