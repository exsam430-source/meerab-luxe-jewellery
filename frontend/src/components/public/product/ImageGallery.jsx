import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Thumbs, Navigation, Zoom } from 'swiper/modules'
import { motion, AnimatePresence } from 'framer-motion'
import { FiZoomIn, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import 'swiper/css'
import 'swiper/css/thumbs'
import 'swiper/css/navigation'
import 'swiper/css/zoom'
import { getOptimizedImageUrl } from '../../../utils/helpers.js'

const ImageGallery = ({ images = [], productName = '' }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const validImages = images.filter(Boolean)

  if (validImages.length === 0) {
    return (
      <div
        className="w-full rounded-2xl flex items-center justify-center"
        style={{ aspectRatio: '1', background: '#2d2d2d' }}
      >
        <span className="text-6xl">💍</span>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* ✅ Main Image Swiper */}
        <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: '1' }}>
          <Swiper
            modules={[Thumbs, Navigation, Zoom]}
            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
            navigation={{
              prevEl: '.gallery-prev',
              nextEl: '.gallery-next',
            }}
            zoom={{ maxRatio: 3 }}
            onSlideChange={s => setActiveIndex(s.activeIndex)}
            className="w-full h-full"
          >
            {validImages.map((img, i) => (
              <SwiperSlide key={i} className="swiper-zoom-container">
                <img
                  src={getOptimizedImageUrl(img, 800, 90)}
                  alt={`${productName} - Image ${i + 1}`}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  className="w-full h-full object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation buttons */}
          {validImages.length > 1 && (
            <>
              <button
                className="gallery-prev absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all"
                style={{ background: 'rgba(26,26,26,0.7)', color: 'white', backdropFilter: 'blur(4px)' }}
              >
                <FiChevronLeft size={18} />
              </button>
              <button
                className="gallery-next absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all"
                style={{ background: 'rgba(26,26,26,0.7)', color: 'white', backdropFilter: 'blur(4px)' }}
              >
                <FiChevronRight size={18} />
              </button>
            </>
          )}

          {/* Zoom Button */}
          <button
            onClick={() => { setLightboxIndex(activeIndex); setLightboxOpen(true) }}
            className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all"
            style={{ background: 'rgba(26,26,26,0.7)', color: 'white', backdropFilter: 'blur(4px)' }}
            aria-label="Zoom image"
          >
            <FiZoomIn size={16} />
          </button>

          {/* Image Counter */}
          {validImages.length > 1 && (
            <div
              className="absolute bottom-3 left-3 z-10 px-2.5 py-1 rounded-full text-xs font-medium"
              style={{ background: 'rgba(26,26,26,0.7)', color: 'white', backdropFilter: 'blur(4px)' }}
            >
              {activeIndex + 1} / {validImages.length}
            </div>
          )}
        </div>

        {/* ✅ Thumbnails */}
        {validImages.length > 1 && (
          <Swiper
            modules={[Thumbs]}
            onSwiper={setThumbsSwiper}
            spaceBetween={8}
            slidesPerView={4}
            watchSlidesProgress
            className="w-full"
          >
            {validImages.map((img, i) => (
              <SwiperSlide key={i}>
                <div
                  className="rounded-xl overflow-hidden cursor-pointer transition-all duration-200"
                  style={{
                    aspectRatio: '1',
                    border: `2px solid ${activeIndex === i ? '#d4af37' : 'transparent'}`,
                    opacity: activeIndex === i ? 1 : 0.6,
                  }}
                >
                  <img
                    src={getOptimizedImageUrl(img, 150, 70)}
                    alt={`${productName} thumbnail ${i + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      {/* ✅ Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.95)' }}
            onClick={() => setLightboxOpen(false)}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors hover:bg-white/10"
            >
              <FiX size={22} />
            </button>

            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              src={getOptimizedImageUrl(validImages[lightboxIndex], 1200, 95)}
              alt={productName}
              className="max-w-full max-h-full object-contain rounded-xl"
              onClick={e => e.stopPropagation()}
            />

            {/* Navigation in lightbox */}
            {validImages.length > 1 && (
              <>
                <button
                  onClick={e => { e.stopPropagation(); setLightboxIndex(prev => (prev - 1 + validImages.length) % validImages.length) }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                >
                  <FiChevronLeft size={22} />
                </button>
                <button
                  onClick={e => { e.stopPropagation(); setLightboxIndex(prev => (prev + 1) % validImages.length) }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                >
                  <FiChevronRight size={22} />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ImageGallery