// src/components/public/home/HeroBanner.jsx
import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiShoppingBag, FiChevronLeft, FiChevronRight, FiArrowRight,
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { HiSparkles } from 'react-icons/hi'
import { productApi } from '../../../api/productApi.js'
import { useSettings } from '../../../hooks/useSettings.js'

const SLIDE_CONFIGS = [
  {
    id: 'bridal',
    title: 'Bridal Jewellery',
    titleHighlight: 'Collections 2026',
    subtitle: 'For Your Most Special Day',
    description: 'Complete bridal sets with kundan, meena work & stone-studded designs. Make every moment unforgettable.',
    cta: 'Explore Bridal',
    ctaLink: '/collections/bridal-set',
    accentColor: '#f9a8d4',
    accentRgb: '249,168,212',
    gradientFrom: '#0f0308',
    gradientTo: '#1e0512',
    filter: p =>
      p.showInBridalSet || p.subCategory?.includes('Bridal') ||
      p.subCategory?.includes('Wedding') || p.subCategory?.includes('Dulhan'),
  },
  {
    id: 'necklaces',
    title: 'Gold Necklaces',
    titleHighlight: '& Statement Pieces',
    subtitle: 'Timeless Elegance',
    description: 'From delicate pendants to elaborate bridal sets — premium gold-plated craftsmanship at its finest.',
    cta: 'Shop Necklaces',
    ctaLink: '/collections/necklaces',
    accentColor: '#d4af37',
    accentRgb: '212,175,55',
    gradientFrom: '#0c0900',
    gradientTo: '#1c1500',
    filter: p =>
      p.showInNecklaces || p.subCategory?.includes('Necklace') ||
      p.subCategory?.includes('Choker') || p.subCategory?.includes('Pendant'),
  },
  {
    id: 'bangles',
    title: 'Bangles &',
    titleHighlight: 'Bracelets',
    subtitle: 'Wrist Wear Royalty',
    description: 'Traditional kangan to modern gold-plated bracelets. Perfect for weddings, mehndi & everyday elegance.',
    cta: 'Shop Bangles',
    ctaLink: '/collections/bangles',
    accentColor: '#c084fc',
    accentRgb: '192,132,252',
    gradientFrom: '#080510',
    gradientTo: '#120a20',
    filter: p =>
      p.showInBangles || p.subCategory?.includes('Bangle') ||
      p.subCategory?.includes('Bracelet') || p.subCategory?.includes('Kangan'),
  },
  {
    id: 'under1000',
    title: 'Premium Jewellery',
    titleHighlight: 'Under Rs.2,000',
    subtitle: 'Affordable Luxury',
    description: "Beautiful gold-plated pieces that won't break your budget. Perfect gifts for any occasion.",
    cta: 'Shop Budget Picks',
    ctaLink: '/collections/under-1000',
    accentColor: '#4ade80',
    accentRgb: '74,222,128',
    gradientFrom: '#030a03',
    gradientTo: '#071207',
    filter: p => (p.price <= 2000 && p.inStock) || p.showInUnder1000,
  },
]

const SLIDE_DURATION = 6000

// ── Progress Bar ───────────────────────────────────────────────
const SlideProgress = ({ current, total, duration, accentColor }) => (
  <div className="flex items-center gap-1.5">
    {Array.from({ length: total }, (_, i) => (
      <div
        key={i}
        className="relative overflow-hidden rounded-full"
        style={{
          height: '3px',
          width: i === current ? '28px' : '10px',
          background: 'rgba(255,255,255,0.1)',
          transition: 'width 0.4s ease',
        }}
      >
        {i === current && (
          <motion.div
            key={`prog-${current}`}
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ background: accentColor }}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: duration / 1000, ease: 'linear' }}
          />
        )}
        {i < current && (
          <div className="absolute inset-0" style={{ background: `${accentColor}40` }} />
        )}
      </div>
    ))}
  </div>
)

// ── Image Mosaic ──────────────────────────────────────────────
const ImageMosaic = ({ images, accentColor, accentRgb }) => {
  const [errors, setErrors] = useState({})
  const valid = images.filter((_, i) => !errors[i]).slice(0, 3)

  if (!valid.length) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="w-28 h-28 rounded-full border-2 opacity-10"
          style={{ borderColor: accentColor, borderStyle: 'dashed' }}
        />
      </div>
    )
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, rgba(${accentRgb},0.1) 0%, transparent 65%)`,
        }}
      />
      <div className="relative flex gap-3 items-center justify-center px-4">
        {/* Main image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          style={{ width: 'clamp(160px, 18vw, 225px)', height: 'clamp(210px, 26vw, 295px)' }}
        >
          <div
            className="w-full h-full rounded-2xl overflow-hidden"
            style={{
              border: `2px solid rgba(${accentRgb},0.28)`,
              boxShadow: `0 0 45px rgba(${accentRgb},0.18), 0 22px 65px rgba(0,0,0,0.6)`,
            }}
          >
            <img
              src={valid[0]}
              alt="Featured"
              className="w-full h-full object-cover"
              loading="eager"
              onError={() => setErrors(p => ({ ...p, 0: true }))}
            />
          </div>
          {/* New badge */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="absolute -left-2 top-5 px-3 py-1 rounded-full text-xs font-bold"
            style={{
              background: accentColor,
              color: '#0a0a0a',
              boxShadow: `0 4px 18px rgba(${accentRgb},0.4)`,
            }}
          >
            ✦ New
          </motion.div>
        </motion.div>

        {/* Side images */}
        {valid.length > 1 && (
          <div className="flex flex-col gap-3">
            {valid.slice(1, 3).map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.85, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.12 }}
                style={{ width: 'clamp(100px, 12vw, 148px)', height: 'clamp(115px, 14vw, 168px)' }}
              >
                <div
                  className="w-full h-full rounded-xl overflow-hidden"
                  style={{
                    border: `1.5px solid rgba(${accentRgb},0.18)`,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
                  }}
                >
                  <img
                    src={src}
                    alt="Jewellery"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={() => setErrors(p => ({ ...p, [i + 1]: true }))}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Decorative ring */}
      <motion.div
        className="absolute bottom-6 left-6 pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
      >
        <div
          className="rounded-full opacity-[0.08]"
          style={{ width: 72, height: 72, border: `2px dashed ${accentColor}` }}
        />
      </motion.div>
    </div>
  )
}

// ── Mobile BG Image ───────────────────────────────────────────
const MobileBgImage = ({ src, accentRgb }) => {
  const [loaded, setLoaded] = useState(false)
  if (!src) return null
  return (
    <>
      <img
        src={src}
        alt=""
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
        style={{ opacity: loaded ? 1 : 0 }}
        onLoad={() => setLoaded(true)}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            180deg,
            rgba(0,0,0,0.9) 0%,
            rgba(0,0,0,0.72) 40%,
            rgba(0,0,0,0.82) 70%,
            rgba(0,0,0,0.96) 100%
          )`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 30%, rgba(${accentRgb},0.08) 0%, transparent 70%)`,
        }}
      />
    </>
  )
}

// ── Particles ─────────────────────────────────────────────────
const Particles = ({ accentColor }) => {
  const dots = useRef(
    Array.from({ length: 14 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 1,
      dur: Math.random() * 4 + 3,
      delay: Math.random() * 2,
    }))
  ).current

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {dots.map(d => (
        <motion.div
          key={d.id}
          className="absolute rounded-full"
          style={{
            left: `${d.x}%`, top: `${d.y}%`,
            width: d.size, height: d.size,
            background: accentColor,
            boxShadow: `0 0 ${d.size * 3}px ${accentColor}`,
          }}
          animate={{ y: [-10, 10, -10], opacity: [0.1, 0.5, 0.1] }}
          transition={{ duration: d.dur, repeat: Infinity, delay: d.delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

// ── Main HeroBanner ────────────────────────────────────────────
const HeroBanner = () => {
  const { getWhatsAppLink } = useSettings()
  const [current, setCurrent] = useState(0)
  const [slideImages, setSlideImages] = useState({})
  const [imgLoading, setImgLoading] = useState(true)
  const [hovered, setHovered] = useState(false)
  const timerRef = useRef(null)

  const whatsappLink = getWhatsAppLink(
    "Assalamu Alaikum! I'm interested in your jewellery collection. Please share details."
  )

  useEffect(() => {
    const load = async () => {
      try {
        setImgLoading(true)
        const res = await productApi.getAll()
        if (!res.data.success) return
        const all = res.data.products || []
        const map = {}
        SLIDE_CONFIGS.forEach(slide => {
          let matched = all.filter(slide.filter)
          if (matched.length < 3) {
            const extra = all.filter(p => !matched.includes(p))
            matched = [...matched, ...extra].slice(0, 6)
          }
          map[slide.id] = matched
            .filter(p => p.image || p.images?.[0])
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(p => p.image || p.images?.[0])
            .filter(Boolean)
        })
        setSlideImages(map)
      } catch (err) {
        console.error('HeroBanner image load error:', err)
      } finally {
        setImgLoading(false)
      }
    }
    load()
  }, [])

  const startTimer = useCallback(() => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCurrent(p => (p + 1) % SLIDE_CONFIGS.length)
    }, SLIDE_DURATION)
  }, [])

  useEffect(() => {
    if (!hovered) startTimer()
    else clearInterval(timerRef.current)
    return () => clearInterval(timerRef.current)
  }, [hovered, startTimer])

  const goTo = i => { setCurrent(i); startTimer() }
  const goPrev = () => goTo((current - 1 + SLIDE_CONFIGS.length) % SLIDE_CONFIGS.length)
  const goNext = () => goTo((current + 1) % SLIDE_CONFIGS.length)

  const touchStart = useRef(0)
  const handleTouchStart = e => { touchStart.current = e.touches[0].clientX }
  const handleTouchEnd = e => {
    const diff = touchStart.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) diff > 0 ? goNext() : goPrev()
  }

  const slide = SLIDE_CONFIGS[current]
  const images = slideImages[slide.id] || []

  const fadeUp = delay => ({
    initial: { opacity: 0, y: 25 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
  })

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: 'clamp(540px, 94vh, 760px)' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id + '-bg'}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${slide.gradientFrom} 0%, ${slide.gradientTo} 50%, ${slide.gradientFrom} 100%)`,
            }}
          />
          {/* Mobile bg image */}
          <div className="lg:hidden absolute inset-0">
            <MobileBgImage src={images[0]} accentRgb={slide.accentRgb} />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Diamond pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="heroDiamonds" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M30 4 L56 30 L30 56 L4 30 Z" fill="none" stroke="white" strokeWidth="0.5" />
              <circle cx="30" cy="30" r="1.2" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#heroDiamonds)" />
        </svg>
      </div>

      <Particles accentColor={slide.accentColor} />

      {/* Top accent line */}
      <motion.div
        key={slide.id + '-line'}
        className="absolute top-0 left-0 right-0 h-0.5 z-20"
        style={{
          background: `linear-gradient(90deg, transparent, ${slide.accentColor}, transparent)`,
          boxShadow: `0 0 18px ${slide.accentColor}60`,
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5 }}
      />

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to top, #0d0d0d, transparent)' }}
      />

      {/* Content */}
      <div
        className="relative z-10 container-custom flex items-center"
        style={{ minHeight: 'clamp(540px, 94vh, 760px)' }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 w-full items-center">

          {/* LEFT — Text */}
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id + '-text'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="py-16 md:py-20 lg:py-24"
            >
              {/* Badge */}
              <motion.div {...fadeUp(0.05)} className="mb-5">
                <span
                  className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase px-4 py-2 rounded-full"
                  style={{
                    background: 'rgba(0,0,0,0.5)',
                    border: `1px solid rgba(${slide.accentRgb},0.3)`,
                    color: slide.accentColor,
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                  }}
                >
                  <motion.span
                    animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: slide.accentColor, boxShadow: `0 0 6px ${slide.accentColor}` }}
                  />
                  {slide.subtitle}
                </span>
              </motion.div>

              {/* Title */}
              <motion.h1
                {...fadeUp(0.15)}
                className="font-playfair font-bold text-white leading-[1.08] mb-3"
                style={{
                  fontSize: 'clamp(30px, 5vw, 62px)',
                  textShadow: '0 2px 32px rgba(0,0,0,0.6)',
                  letterSpacing: '-0.01em',
                }}
              >
                {slide.title}{' '}
                <span style={{ color: slide.accentColor }}>{slide.titleHighlight}</span>
              </motion.h1>

              {/* Divider */}
              <motion.div {...fadeUp(0.25)} className="flex items-center gap-3 mb-5">
                <div style={{ height: '1px', width: '45px', background: `linear-gradient(90deg, ${slide.accentColor}, transparent)` }} />
                <div
                  className="rotate-45"
                  style={{ width: 5, height: 5, background: slide.accentColor, boxShadow: `0 0 8px ${slide.accentColor}` }}
                />
              </motion.div>

              {/* Description */}
              <motion.p
                {...fadeUp(0.3)}
                className="mb-7 leading-relaxed max-w-md"
                style={{
                  fontSize: 'clamp(13px, 1.5vw, 15px)',
                  color: 'rgba(195,195,195,0.85)',
                  textShadow: '0 1px 6px rgba(0,0,0,0.4)',
                }}
              >
                {slide.description}
              </motion.p>

              {/* CTAs */}
              <motion.div {...fadeUp(0.4)} className="flex flex-wrap items-center gap-3 mb-7">
                <Link
                  to={slide.ctaLink}
                  className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    background: `linear-gradient(135deg, ${slide.accentColor}, ${slide.accentColor}cc)`,
                    color: '#0a0a0a',
                    boxShadow: `0 4px 26px rgba(${slide.accentRgb},0.28)`,
                  }}
                >
                  <FiShoppingBag size={15} />
                  {slide.cta}
                  <FiArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    background: 'rgba(37,211,102,0.08)',
                    border: '1px solid rgba(37,211,102,0.25)',
                    color: '#25d366',
                  }}
                >
                  <FaWhatsapp size={16} />
                  <span className="hidden sm:inline">Order on</span> WhatsApp
                </a>
              </motion.div>

              {/* Trust badges */}
              <motion.div {...fadeUp(0.5)} className="flex flex-wrap gap-4 sm:gap-6">
                {[
                  { icon: '🚚', text: 'Free Delivery above Rs.3,000' },
                  { icon: '💵', text: 'Cash on Delivery' },
                  { icon: '💬', text: 'WhatsApp Support' },
                ].map(b => (
                  <div key={b.text} className="flex items-center gap-1.5">
                    <span className="text-sm">{b.icon}</span>
                    <span className="text-xs font-medium text-white/35">{b.text}</span>
                  </div>
                ))}
              </motion.div>

              {/* Mobile thumbnails */}
              {!imgLoading && images.length > 1 && (
                <motion.div {...fadeUp(0.6)} className="flex lg:hidden gap-2.5 mt-8">
                  {images.slice(0, 3).map((src, i) => (
                    <div
                      key={i}
                      className="rounded-xl overflow-hidden flex-shrink-0"
                      style={{
                        width: 'clamp(70px, 20vw, 95px)',
                        height: 'clamp(80px, 22vw, 108px)',
                        border: `1.5px solid rgba(${slide.accentRgb},0.22)`,
                        boxShadow: '0 4px 22px rgba(0,0,0,0.5)',
                      }}
                    >
                      <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  ))}
                  <Link
                    to={slide.ctaLink}
                    className="flex items-center justify-center rounded-xl flex-shrink-0"
                    style={{
                      width: 'clamp(70px, 20vw, 95px)',
                      height: 'clamp(80px, 22vw, 108px)',
                      background: `rgba(${slide.accentRgb},0.07)`,
                      border: `1.5px dashed rgba(${slide.accentRgb},0.28)`,
                    }}
                  >
                    <div className="text-center">
                      <FiArrowRight size={18} style={{ color: slide.accentColor, margin: '0 auto' }} />
                      <span className="text-[10px] font-medium mt-1 block" style={{ color: slide.accentColor }}>
                        View All
                      </span>
                    </div>
                  </Link>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* RIGHT — Desktop Mosaic */}
          <div className="hidden lg:flex items-center justify-center h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id + '-mosaic'}
                className="w-full h-full"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
              >
                {imgLoading ? (
                  <div className="flex items-center justify-center h-full gap-3">
                    {[210, 145, 145].map((w, i) => (
                      <div
                        key={i}
                        className="rounded-2xl animate-pulse"
                        style={{
                          width: w,
                          height: i === 0 ? 270 : 155,
                          background: `rgba(${slide.accentRgb},0.05)`,
                          border: `1px solid rgba(${slide.accentRgb},0.07)`,
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <ImageMosaic images={images} accentColor={slide.accentColor} accentRgb={slide.accentRgb} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-5 left-0 right-0 z-20">
        <div className="container-custom flex items-center justify-between">
          <SlideProgress
            current={current}
            total={SLIDE_CONFIGS.length}
            duration={SLIDE_DURATION}
            accentColor={slide.accentColor}
          />
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-white/15 hidden sm:inline">
              {String(current + 1).padStart(2, '0')} / {String(SLIDE_CONFIGS.length).padStart(2, '0')}
            </span>
            {[{ icon: FiChevronLeft, fn: goPrev }, { icon: FiChevronRight, fn: goNext }].map(({ icon: Icon, fn }, i) => (
              <button
                key={i}
                onClick={fn}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.35)',
                }}
              >
                <Icon size={14} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-14 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div
            className="w-px h-8 rounded-full"
            style={{ background: `linear-gradient(to bottom, ${slide.accentColor}45, transparent)` }}
          />
        </motion.div>
        <span className="text-[8px] tracking-[0.3em] uppercase text-white/12 mt-1">Scroll</span>
      </motion.div>
    </section>
  )
}

export default HeroBanner