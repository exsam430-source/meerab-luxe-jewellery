import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiMail, FiSend, FiCheck } from 'react-icons/fi'
import { newsletterApi } from '../../../api/newsletterApi.js'
import toast from 'react-hot-toast'

const NewsletterSection = () => {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    try {
      setLoading(true)
      const res = await newsletterApi.subscribe({ email: email.trim(), name: name.trim() })
      if (res.data.success) {
        setSubscribed(true)
        toast.success('Successfully subscribed! 🎉')
      } else {
        toast.error(res.data.message || 'Subscription failed')
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      className="py-14"
      style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #242424 50%, #1a1a1a 100%)',
        borderTop: '1px solid #2d2d2d',
      }}
    >
      <div className="container-custom">
        <div className="max-w-2xl mx-auto text-center">

          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}
          >
            <FiMail size={24} style={{ color: '#d4af37' }} />
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-heading mb-2"
          >
            Stay Updated
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[#a0a0a0] mb-6 text-sm md:text-base"
          >
            Subscribe to get notified about new arrivals, exclusive offers,
            and jewellery tips.
          </motion.p>

          {/* Form */}
          {subscribed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}
              >
                <FiCheck size={28} style={{ color: '#10b981' }} />
              </div>
              <p className="text-[#10b981] font-medium">
                Thank you for subscribing!
              </p>
              <p className="text-[#a0a0a0] text-sm">
                You'll receive our latest updates and offers.
              </p>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
            >
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name (optional)"
                className="input-dark flex-1"
                style={{ minWidth: 0 }}
              />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email address *"
                required
                className="input-dark flex-1"
                style={{ minWidth: 0 }}
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-gold flex items-center justify-center gap-2 whitespace-nowrap flex-shrink-0"
                style={{ padding: '10px 20px' }}
              >
                {loading ? (
                  <div
                    className="w-4 h-4 rounded-full border-2 animate-spin"
                    style={{ borderColor: '#1a1a1a', borderTopColor: 'transparent' }}
                  />
                ) : (
                  <>
                    <FiSend size={15} />
                    Subscribe
                  </>
                )}
              </button>
            </motion.form>
          )}

          {/* Note */}
          <p className="text-xs text-[#6b7280] mt-4">
            No spam, ever. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  )
}

export default NewsletterSection