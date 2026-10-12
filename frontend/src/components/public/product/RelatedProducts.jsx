import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import { motion } from 'framer-motion'
import 'swiper/css'
import ProductCard from './ProductCard.jsx'

const RelatedProducts = ({ products = [], currentId }) => {
  const related = products
    .filter(p => String(p._id || p.id) !== String(currentId))
    .slice(0, 10)

  if (related.length === 0) return null

  return (
    <section className="py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-6"
      >
        <h2
          className="font-playfair font-bold text-white gold-underline"
          style={{ fontSize: 'clamp(20px, 3vw, 28px)' }}
        >
          You May Also Like
        </h2>
      </motion.div>

      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={related.length > 4}
        breakpoints={{
          320: { slidesPerView: 2, spaceBetween: 12 },
          640: { slidesPerView: 3, spaceBetween: 16 },
          1024: { slidesPerView: 4, spaceBetween: 20 },
        }}
      >
        {related.map(product => (
          <SwiperSlide key={product._id || product.id}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}

export default RelatedProducts