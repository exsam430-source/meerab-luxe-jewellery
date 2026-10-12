// src/components/public/collection/CollectionHero.jsx
import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FiChevronDown } from 'react-icons/fi'
import { HiSparkles } from 'react-icons/hi'

const HERO_IMAGES = {
  bangles: [
    'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1573408301185-9519f94f4fd8?w=1600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=1600&q=80&fit=crop',
  ],
  bridal: [
    'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=1600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=1600&q=80&fit=crop',
  ],
  kundan: [
    'https://images.unsplash.com/photo-1629224316810-9d8805b95e76?w=1600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=1600&q=80&fit=crop',
  ],
  necklaces: [
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1600&q=80&fit=crop',
  ],
  party: [
    'https://images.unsplash.com/photo-1601821765780-754fa98637c1?w=1600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=1600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=1600&q=80&fit=crop',
  ],
  gold: [
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1573408301185-9519f94f4fd8?w=1600&q=80&fit=crop',
  ],
  budget: [
    'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=1600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=1600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1573408301185-9519f94f4fd8?w=1600&q=80&fit=crop',
  ],
  default: [
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1600&q=80&fit=crop',
  ],
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return '212,175,55'
  return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`
}

// ── Image Slideshow ───────────────────────────────────────────
const HeroImageSlider = ({ images, accentColor }) => {
  const [current, setCurrent] = useState(0)
  const [loaded, setLoaded] = useState({})

  useEffect(() => {
    if (images.length <= 1) return
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [images.length])

  return (
    <div className="absolute inset-0">
      {images.map((src, i) => (
        <div key={src} className="absolute inset-0">
          <motion.img
            src={src}
            alt=""
            onLoad={() => setLoaded(prev => ({ ...prev, [i]: true }))}
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{
              opacity: i === current && loaded[i] ? 1 : 0,
              scale: i === current ? 1.05 : 1,
            }}
            transition={{
              opacity: { duration: 1.2, ease: 'easeInOut' },
              scale: { duration: 8, ease: 'linear' },
            }}
          />
        </div>
      ))}

      {/* Overlays */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            to right,
            rgba(0,0,0,0.93) 0%,
            rgba(0,0,0,0.78) 40%,
            rgba(0,0,0,0.58) 70%,
            rgba(0,0,0,0.45) 100%
          )`,
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-36"
        style={{ background: 'linear-gradient(to top, #0d0d0d, transparent)' }}
      />
      <div
        className="absolute top-0 left-0 right-0 h-24"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)' }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 70% 50%, ${accentColor}15 0%, transparent 60%)`,
          mixBlendMode: 'screen',
        }}
      />

      {/* Dot indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-8 right-8 flex items-center gap-2 z-10">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="transition-all duration-300 rounded-full"
              style={{
                width: i === current ? 22 : 6,
                height: 6,
                background: i === current ? accentColor : 'rgba(255,255,255,0.25)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Floating Gems ─────────────────────────────────────────────
const FloatingGems = ({ accentColor }) => {
  const gems = [
    { size: 6, top: '15%', left: '5%',  delay: 0,   duration: 3.5 },
    { size: 4, top: '70%', left: '8%',  delay: 0.8, duration: 4.2 },
    { size: 5, top: '35%', left: '92%', delay: 1.2, duration: 3.8 },
    { size: 3, top: '80%', left: '88%', delay: 0.4, duration: 5   },
    { size: 7, top: '10%', left: '85%', delay: 2,   duration: 4   },
  ]
  return (
    <>
      {gems.map((gem, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{ top: gem.top, left: gem.left }}
          animate={{ y: [-8, 8, -8], opacity: [0.3, 0.8, 0.3], rotate: [0, 180, 360] }}
          transition={{ duration: gem.duration, repeat: Infinity, delay: gem.delay, ease: 'easeInOut' }}
        >
          <div
            className="rotate-45"
            style={{
              width: gem.size * 4,
              height: gem.size * 4,
              background: `linear-gradient(135deg, ${accentColor}70, ${accentColor}15)`,
              border: `1px solid ${accentColor}50`,
              boxShadow: `0 0 ${gem.size * 3}px ${accentColor}35`,
            }}
          />
        </motion.div>
      ))}
    </>
  )
}

// ── Particles ─────────────────────────────────────────────────
const Particles = ({ accentColor }) => {
  const dots = useRef(
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
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

// ── Main CollectionHero ───────────────────────────────────────
const CollectionHero = ({
  title = '',
  subtitle = '',
  description = '',
  productCount = 0,
  loading = false,
  accentColor = '#d4af37',
  emoji = '💍',
  badge = '',
  imageSet = 'default',
  customImages,
}) => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const contentY       = useTransform(scrollYProgress, [0, 1], ['0%', '28%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])

  const images   = customImages || HERO_IMAGES[imageSet] || HERO_IMAGES.default
  const rgbValue = hexToRgb(accentColor)

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{ minHeight: 'clamp(400px, 58vh, 620px)' }}
    >
      {/* BG */}
      <div
        className="absolute inset-0"
        style={{ background: '#080808' }}
      />

      <HeroImageSlider images={images} accentColor={accentColor} />
      <FloatingGems accentColor={accentColor} />
      <Particles accentColor={accentColor} />

      {/* Diamond SVG Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="collHeroDiamonds" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M30 4 L56 30 L30 56 L4 30 Z" fill="none" stroke="white" strokeWidth="0.6" />
              <circle cx="30" cy="30" r="1.2" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#collHeroDiamonds)" />
        </svg>
      </div>

      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 z-20"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${accentColor} 30%, ${accentColor} 70%, transparent 100%)`,
          boxShadow: `0 0 22px ${accentColor}80`,
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col justify-center"
        style={{
          y: contentY,
          opacity: contentOpacity,
          minHeight: 'clamp(400px, 58vh, 620px)',
          padding: 'clamp(64px, 10vw, 130px) clamp(20px, 6vw, 80px)',
          maxWidth: '700px',
        }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-5"
        >
          <span
            className="inline-flex items-center gap-2.5 text-xs font-bold tracking-[0.22em] uppercase px-4 py-2 rounded-full"
            style={{
              background: 'rgba(0,0,0,0.55)',
              border: `1px solid ${accentColor}45`,
              color: accentColor,
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
            }}
          >
            <motion.span
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: accentColor, boxShadow: `0 0 6px ${accentColor}` }}
            />
            {badge || subtitle}
          </span>
        </motion.div>

        {/* Emoji */}
        {emoji && (
          <motion.div
            initial={{ opacity: 0, scale: 0.3, rotate: -20 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 150, delay: 0.2 }}
            className="mb-3 text-4xl md:text-5xl select-none leading-none"
            style={{ filter: `drop-shadow(0 0 26px ${accentColor}80)` }}
          >
            {emoji}
          </motion.div>
        )}

        {/* Title — word by word */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-playfair font-bold text-white leading-[1.08] mb-4"
          style={{
            fontSize: 'clamp(30px, 5.5vw, 64px)',
            textShadow: '0 2px 40px rgba(0,0,0,0.8)',
            letterSpacing: '-0.01em',
          }}
        >
          {title.split(' ').map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
              className="inline-block mr-3"
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {/* Gold divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex items-center gap-3 mb-5"
          style={{ transformOrigin: 'left' }}
        >
          <div style={{ height: '1px', width: '52px', background: `linear-gradient(90deg, ${accentColor}, transparent)` }} />
          <div
            className="rotate-45 flex-shrink-0"
            style={{ width: '6px', height: '6px', background: accentColor, boxShadow: `0 0 10px ${accentColor}` }}
          />
          <div style={{ height: '1px', width: '32px', background: `linear-gradient(90deg, ${accentColor}55, transparent)` }} />
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="leading-relaxed mb-7 max-w-lg"
          style={{
            fontSize: 'clamp(13px, 1.6vw, 15px)',
            color: 'rgba(210,210,210,0.85)',
            textShadow: '0 1px 10px rgba(0,0,0,0.6)',
          }}
        >
          {description}
        </motion.p>

        {/* Count pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          {loading ? (
            <div
              className="h-9 w-40 rounded-full animate-pulse"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            />
          ) : (
            <div
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium"
              style={{
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#b0b0b0',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
              }}
            >
              <HiSparkles size={14} style={{ color: accentColor }} />
              <span>
                <strong style={{ color: accentColor }}>{productCount}</strong>
                {' '}piece{productCount !== 1 ? 's' : ''} available
              </span>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1"
      >
        <span className="text-[9px] tracking-[0.3em] uppercase text-white/20 font-medium">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <FiChevronDown size={18} className="text-white/20" />
        </motion.div>
      </motion.div>
    </section>
  )
}

export default CollectionHero