import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'

const BANNERS = [
  {
    title: 'Necklaces Collection',
    subtitle: 'Gold-Plated Elegance',
    desc: 'Explore stunning necklace sets for every occasion',
    link: '/collections/necklaces',
    cta: 'Shop Necklaces',
    gradient: 'linear-gradient(135deg, #1a1000 0%, #2d2000 100%)',
    accent: '#d4af37',
    emoji: '📿',
  },
  {
    title: 'Kundan Jewellery',
    subtitle: 'Traditional Craftsmanship',
    desc: 'Authentic kundan pieces for brides and festivals',
    link: '/collections/kundan',
    cta: 'Shop Kundan',
    gradient: 'linear-gradient(135deg, #0a0a1a 0%, #15152d 100%)',
    accent: '#f4e5c2',
    emoji: '💎',
  },
]

const CollectionBanners = ({ products = [] }) => {
  const getBannerImage = (title) => {
    const map = {
      'Necklaces Collection': 'Necklaces',
      'Kundan Jewellery': 'Kundan',
    }
    const subCat = map[title]
    if (!subCat) return null
    const match = products.find(p => p.subCategory === subCat && p.images?.[0])
    return match?.images?.[0] || null
  }

  return (
    <section className="py-14 md:py-20">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {BANNERS.map((banner, i) => {
            const img = getBannerImage(banner.title)
            return (
              <motion.div
                key={banner.title}
                initial={{ opacity: 0, x: i === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <Link
                  to={banner.link}
                  className="group relative flex items-end overflow-hidden rounded-2xl"
                  style={{ height: 'clamp(200px, 30vw, 320px)' }}
                >
                  {/* Background */}
                  {img ? (
                    <>
                      <img
                        src={img}
                        alt={banner.title}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          background: 'linear-gradient(to top, rgba(26,26,26,0.95) 0%, rgba(26,26,26,0.4) 60%, transparent 100%)',
                        }}
                      />
                    </>
                  ) : (
                    <div
                      className="absolute inset-0"
                      style={{ background: banner.gradient }}
                    >
                      {/* Pattern */}
                      <div
                        className="absolute inset-0 opacity-5"
                        style={{
                          backgroundImage: `radial-gradient(circle at 3px 3px, ${banner.accent} 1px, transparent 0)`,
                          backgroundSize: '30px 30px',
                        }}
                      />
                      {/* Emoji */}
                      <div className="absolute inset-0 flex items-center justify-end pr-10 opacity-10">
                        <span style={{ fontSize: '120px' }}>{banner.emoji}</span>
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="relative z-10 p-6 w-full">
                    <p
                      className="font-cormorant text-sm uppercase tracking-widest mb-1"
                      style={{ color: banner.accent }}
                    >
                      {banner.subtitle}
                    </p>
                    <h3
                      className="font-playfair font-bold text-white mb-1.5"
                      style={{ fontSize: 'clamp(18px, 3vw, 26px)' }}
                    >
                      {banner.title}
                    </h3>
                    <p className="text-[#a0a0a0] text-sm mb-4 hidden sm:block">
                      {banner.desc}
                    </p>
                    <span
                      className="inline-flex items-center gap-2 text-sm font-semibold transition-all duration-200 group-hover:gap-3"
                      style={{ color: banner.accent }}
                    >
                      {banner.cta}
                      <FiArrowRight size={15} />
                    </span>
                  </div>

                  {/* Border glow on hover */}
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ boxShadow: `inset 0 0 0 1px ${banner.accent}30` }}
                  />
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default CollectionBanners