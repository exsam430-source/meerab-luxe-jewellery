import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus, FiMinus } from 'react-icons/fi'
import { getFAQSchema } from '../../../utils/structuredData.js'

const FAQS = [
  {
    q: 'Do you deliver all over Pakistan?',
    a: 'Yes! We deliver all over Pakistan. Free delivery on orders above Rs.3,000. Standard delivery charges are Rs.250. Delivery typically takes 2-4 business days.',
  },
  {
    q: 'Is Cash on Delivery (COD) available?',
    a: 'Yes, Cash on Delivery is available all over Pakistan. You can also pay via Easypaisa (03184887631) or Bank Transfer (UBL Bank Limited).',
  },
  {
    q: 'How to order on WhatsApp?',
    a: "Click the WhatsApp button on any product page, or contact us at +923184887631. Share the product name and your delivery address, and we'll process your order.",
  },
  {
    q: 'Are products gold-plated or real gold?',
    a: 'Our products are premium quality gold jewellery. We clearly mention all materials on product pages.',
  },
  {
    q: 'What is the return policy?',
    a: 'We accept returns within 7 days of delivery for defective or wrong items. Contact us via WhatsApp with photos of the issue and we\'ll process your return quickly.',
  },
  {
    q: 'How long does delivery take?',
    a: "Standard delivery takes 2-4 business days within Pakistan. We dispatch orders within 1-2 business days. You'll receive tracking information via WhatsApp.",
  },
  {
    q: 'Do you make custom jewellery?',
    a: 'Yes! We offer custom jewellery orders. Contact us via WhatsApp or use our Custom Order form on the Contact page. Share your design idea and we\'ll create it for you.',
  },
]

const FAQItem = ({ faq, isOpen, onToggle }) => (
  <div
    className="border rounded-xl overflow-hidden transition-all duration-200"
    style={{
      borderColor: isOpen ? 'rgba(212,175,55,0.3)' : '#3d3d3d',
      background: isOpen ? 'rgba(212,175,55,0.04)' : '#242424',
    }}
  >
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors"
    >
      <span
        className="font-medium pr-4 text-sm md:text-base"
        style={{ color: isOpen ? '#d4af37' : '#e5e5e5' }}
      >
        {faq.q}
      </span>
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200"
        style={{
          background: isOpen ? 'rgba(212,175,55,0.15)' : '#3d3d3d',
          color: isOpen ? '#d4af37' : '#a0a0a0',
        }}
      >
        {isOpen ? <FiMinus size={14} /> : <FiPlus size={14} />}
      </div>
    </button>

    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: 'auto' }}
          exit={{ height: 0 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden"
        >
          <div
            className="px-5 pb-4 border-t"
            style={{ borderColor: 'rgba(212,175,55,0.15)' }}
          >
            <p className="text-sm text-[#a0a0a0] leading-relaxed pt-3">
              {faq.a}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
)

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0)
  const faqSchema = getFAQSchema()

  return (
    <section className="py-14 md:py-20">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">

          {/* ✅ Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <p className="section-subheading">Got Questions?</p>
            <h2 className="section-heading">Frequently Asked Questions</h2>
            <div className="gold-divider" />
          </motion.div>

          {/* ✅ FAQ List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-3"
          >
            {FAQS.map((faq, i) => (
              <FAQItem
                key={i}
                faq={faq}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
              />
            ))}
          </motion.div>

          {/* ✅ CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-10 p-6 rounded-2xl"
            style={{
              background: 'rgba(212,175,55,0.05)',
              border: '1px solid rgba(212,175,55,0.15)',
            }}
          >
            <p className="text-[#a0a0a0] mb-3 text-sm">
              Still have questions? We're here to help!
            </p>
            <a
              href="https://wa.me/923184887631?text=Assalamu+Alaikum!+I+have+a+question+about+your+jewellery."
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-btn inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold"
            >
              💬 Chat on WhatsApp
            </a>
          </motion.div>
        </div>
      </div>

      {/* ✅ JSON-LD FAQ Schema */}
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>
    </section>
  )
}

export default FAQSection