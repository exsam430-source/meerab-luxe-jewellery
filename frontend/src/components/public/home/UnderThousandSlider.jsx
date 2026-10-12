import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, FreeMode } from 'swiper/modules'
import { motion } from 'framer-motion'
import { FiArrowRight, FiTag } from 'react-icons/fi'
import 'swiper/css'
import 'swiper/css/free-mode'
import ProductCard from '../product/ProductCard.jsx'
import Loader from '../../common/Loader.jsx'

const UnderThousandSlider = ({ products = [], loading = false }) => {
  if (loading) {
    return (
      <section className="py-14" style={{ background: '#111111' }}>
        <div className="container-custom">
          <Loader center />
        </div>
      </section>
    )
  }

  if (!loading && products.length === 0) return null

  return (
    <section className="py-14 md:py-20 overflow-hidden" style={{ background: '#111111' }}>
      <div className="container-custom">

        {/* ✅ Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(16,185,129,0.1)' }}
              >
                <FiTag size={14} style={{ color: '#10b981' }} />
              </div>
              <p className="font-cormorant text-[#10b981] text-lg">
                Budget Friendly
              </p>
            </div>
            <h2
              className="font-playfair font-bold text-white"
              style={{ fontSize: 'clamp(20px, 4vw, 30px)' }}
            >
              Affordable Elegance Under Rs.1000
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link
              to="/collections/under-1000"
              className="flex items-center gap-2 text-sm font-medium text-[#10b981] hover:text-[#34d399] transition-colors group"
            >
              View All
              <FiArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </div>

        {/* ✅ Slider */}
        <Swiper
          modules={[Autoplay, FreeMode]}
          freeMode={true}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          loop={products.length > 4}
          breakpoints={{
            320: { slidesPerView: 2, spaceBetween: 12 },
            640: { slidesPerView: 3, spaceBetween: 16 },
            1024: { slidesPerView: 4, spaceBetween: 20 },
            1280: { slidesPerView: 5, spaceBetween: 20 },
          }}
        >
          {products.map((product) => (
            <SwiperSlide key={product._id || product.id}>
              <ProductCard product={product} compact />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}

export default UnderThousandSlider