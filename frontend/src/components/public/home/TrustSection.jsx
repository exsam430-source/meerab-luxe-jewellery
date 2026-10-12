import { motion } from 'framer-motion'
import {
  FiTruck, FiShield, FiRefreshCw, FiHeadphones,
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'

const TRUST_ITEMS = [
  {
    icon: FiTruck,
    title: 'Free Delivery',
    desc: 'On orders above Rs.3,000',
    color: '#d4af37',
    bg: 'rgba(212,175,55,0.08)',
  },
  {
    icon: FiShield,
    title: 'Secure Payments',
    desc: 'Easypaisa & Bank Transfer',
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.08)',
  },
  {
    icon: FiRefreshCw,
    title: 'Easy Returns',
    desc: '7-day return policy',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.08)',
  },
  {
    icon: FaWhatsapp,
    title: 'WhatsApp Support',
    desc: 'Order & track via WhatsApp',
    color: '#25d366',
    bg: 'rgba(37,211,102,0.08)',
  },
]

const TrustSection = () => {
  return (
    <section className="py-14 md:py-20">
      <div className="container-custom">

        {/* ✅ Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="section-heading">Why Choose Us?</h2>
          <div className="gold-divider" />
        </motion.div>

        {/* ✅ Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {TRUST_ITEMS.map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-dark p-5 md:p-6 rounded-2xl text-center group hover:scale-105 transition-transform duration-300"
              >
                {/* Icon */}
                <div
                  className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110"
                  style={{ background: item.bg, border: `1px solid ${item.color}20` }}
                >
                  <Icon size={22} style={{ color: item.color }} />
                </div>

                {/* Title */}
                <h3
                  className="font-semibold text-white mb-1.5 text-sm md:text-base"
                >
                  {item.title}
                </h3>

                {/* Desc */}
                <p className="text-[#6b7280] text-xs md:text-sm leading-relaxed">
                  {item.desc}
                </p>

                {/* Bottom accent */}
                <div
                  className="w-8 h-0.5 mx-auto mt-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: item.color }}
                />
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default TrustSection