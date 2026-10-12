import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiMapPin, FiPhone, FiMail, FiClock } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import SEO from '../../components/common/SEO.jsx'
import { seoData } from '../../utils/seoData.js'
import { getJewelryStoreSchema } from '../../utils/structuredData.js'

const About = () => {
  const seo = seoData.about
  const storeSchema = getJewelryStoreSchema()

  return (
    <>
      <SEO
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
        canonical="/about"
        structuredData={storeSchema}
      />

      {/* ✅ Hero */}
      <div
        className="relative py-16 md:py-24 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1a1000 0%, #2d2000 50%, #1a1000 100%)',
        }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #d4af37 1px, transparent 0)`,
            backgroundSize: '30px 30px',
          }}
        />
        <div className="container-custom relative z-10 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-cormorant text-[#d4af37] text-lg tracking-widest uppercase mb-2"
          >
            Our Story
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-playfair font-bold text-white"
            style={{ fontSize: 'clamp(28px, 5vw, 48px)' }}
          >
            About MeerabLuxe Jewellers
          </motion.h1>
        </div>
      </div>

      <div className="container-custom py-12 md:py-16">

        {/* ✅ Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="font-cormorant text-[#d4af37] text-lg mb-2">
              Who We Are
            </p>
            <h2
              className="font-playfair font-bold text-white mb-4"
              style={{ fontSize: 'clamp(22px, 4vw, 32px)' }}
            >
              Crafting Elegance Since Years
            </h2>
            <div className="space-y-4 text-[#a0a0a0] text-sm leading-relaxed">
              <p>
                MeerabLuxe Jewellers is a premium jewellery store based
                in Sarafa Bazaar, Mingora Swat, Pakistan. We specialize in
                high-quality gold jewellery that combines traditional
                craftsmanship with modern designs.
              </p>
              <p>
                Located in the heart of Sarafa Bazaar, Haji Baba Chowk,
                Mingora Swat, we serve customers across Pakistan with our
                online store, offering fast delivery and exceptional customer
                service.
              </p>
              <p>
                Our collection includes necklaces, bangles, earrings, rings,
                kundan jewellery, bridal sets, and more — all crafted with
                premium materials.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { number: '500+',  label: 'Products Available' },
              { number: '1000+', label: 'Happy Customers' },
              { number: '100%',  label: 'Authentic Quality' },
              { number: '7',     label: 'Day Return Policy' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="card-dark rounded-2xl p-5 text-center"
              >
                <p
                  className="font-playfair font-bold gold-gradient-text"
                  style={{ fontSize: '28px' }}
                >
                  {stat.number}
                </p>
                <p className="text-[#6b7280] text-xs mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ✅ Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="section-heading">Our Values</h2>
            <div className="gold-divider" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                icon: '💎',
                title: 'Premium Quality',
                desc: 'Every piece is crafted with the highest quality materials and gold that lasts.',
              },
              {
                icon: '🤝',
                title: 'Customer First',
                desc: 'Your satisfaction is our priority. We offer easy returns and 24/7 WhatsApp support.',
              },
              {
                icon: '💰',
                title: 'Affordable Prices',
                desc: "Luxury jewellery at prices that don't break your budget. Free delivery above Rs.3,000.",
              },
            ].map((val) => (
              <div
                key={val.title}
                className="card-dark rounded-2xl p-6 text-center"
              >
                <div className="text-4xl mb-4">{val.icon}</div>
                <h3 className="font-semibold text-white mb-2">{val.title}</h3>
                <p className="text-[#6b7280] text-sm leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ✅ Store Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card-dark rounded-2xl p-6 md:p-8 mb-8"
        >
          <h2 className="font-playfair font-bold text-white text-2xl mb-6">
            Visit Our Store
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              {
                icon: FiMapPin,
                label: 'Address',
                value: 'Sarafa Bazaar, Haji Baba Chowk, Mingora, Swat, Pakistan',
                color: '#d4af37',
              },
              {
                icon: FiPhone,
                label: 'Phone',
                value: '+92 345 4777588',
                href: 'tel:+923454777588',
                color: '#3b82f6',
              },
              {
                icon: FiMail,
                label: 'Email',
                value: 'meerabluxejewellers@gmail.com',
                href: 'mailto:meerabluxejewellers@gmail.com',
                color: '#10b981',
              },
              {
                icon: FiClock,
                label: 'Hours',
                value: 'Monday - Saturday: 9AM - 9PM',
                color: '#f59e0b',
              },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label} className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${item.color}15` }}
                  >
                    <Icon size={18} style={{ color: item.color }} />
                  </div>
                  <div>
                    <p className="text-xs text-[#6b7280] mb-0.5">{item.label}</p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-sm text-[#e5e5e5] hover:text-[#d4af37] transition-colors"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-sm text-[#e5e5e5]">{item.value}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* ✅ CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="font-playfair font-bold text-white text-2xl mb-3">
            Ready to Shop?
          </h2>
          <p className="text-[#a0a0a0] text-sm mb-6">
            Explore our collection and find the perfect piece for any occasion.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/shop" className="btn-gold px-8">
              Shop Now
            </Link>
            <a
              href="https://wa.me/923184887631"
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-btn flex items-center justify-center gap-2 px-8 py-3 rounded font-semibold text-sm"
            >
              <FaWhatsapp size={18} />
              WhatsApp Us
            </a>
          </div>
        </motion.div>
      </div>
    </>
  )
}

export default About