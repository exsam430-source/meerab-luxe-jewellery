import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'
import { FiX, FiMessageCircle } from 'react-icons/fi'
import { WHATSAPP_NUMBER, STORE_NAME } from '../../../utils/constants.js'

const WhatsAppFloat = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showBubble, setShowBubble] = useState(false)

  // ✅ Show attention bubble after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBubble(true)
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  // ✅ Hide bubble after 8 seconds
  useEffect(() => {
    if (showBubble) {
      const timer = setTimeout(() => {
        setShowBubble(false)
      }, 8000)
      return () => clearTimeout(timer)
    }
  }, [showBubble])

  const quickMessages = [
    {
      label: '💍 Product Inquiry',
      message: `Assalamu Alaikum! I'm interested in your jewellery. Please share details.`,
    },
    {
      label: '📦 Track My Order',
      message: `Assalamu Alaikum! I would like to track my order.`,
    },
    {
      label: '🔄 Return Request',
      message: `Assalamu Alaikum! I would like to request a return.`,
    },
    {
      label: '💬 General Inquiry',
      message: `Assalamu Alaikum! I have a general inquiry.`,
    },
  ]

  const handleMessageClick = (message) => {
    const phone = WHATSAPP_NUMBER.replace(/[^0-9]/g, '')
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank', 'noopener,noreferrer')
    setIsOpen(false)
  }

  return (
    <div
      className="fixed bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end gap-3"
    >
      {/* ✅ Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
            className="w-72 rounded-2xl overflow-hidden shadow-2xl"
            style={{ border: '1px solid #3d3d3d' }}
          >
            {/* Header */}
            <div
              className="px-4 py-3 flex items-center gap-3"
              style={{ background: '#25d366' }}
            >
              <div className="relative">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.2)' }}
                >
                  <FaWhatsapp size={22} color="white" />
                </div>
                <span
                  className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#25d366]"
                  style={{ background: '#4ade80' }}
                />
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">
                  {STORE_NAME}
                </p>
                <p className="text-green-100 text-xs">
                  Usually replies instantly
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Chat bubble */}
            <div
              className="p-4"
              style={{ background: '#1a1a1a' }}
            >
              <div
                className="rounded-xl p-3 mb-4 text-sm text-[#e5e5e5] leading-relaxed"
                style={{
                  background: '#2d2d2d',
                  border: '1px solid #3d3d3d',
                }}
              >
                👋 Assalamu Alaikum! How can we help you today?
                <br />
                <span className="text-[#a0a0a0] text-xs mt-1 block">
                  Select a quick option below or type your message.
                </span>
              </div>

              {/* Quick Messages */}
              <div className="space-y-2">
                {quickMessages.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => handleMessageClick(item.message)}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all"
                    style={{
                      background: '#2d2d2d',
                      color: '#e5e5e5',
                      border: '1px solid #3d3d3d',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(37,211,102,0.1)'
                      e.currentTarget.style.borderColor = 'rgba(37,211,102,0.3)'
                      e.currentTarget.style.color = '#25d366'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = '#2d2d2d'
                      e.currentTarget.style.borderColor = '#3d3d3d'
                      e.currentTarget.style.color = '#e5e5e5'
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Attention Bubble */}
      <AnimatePresence>
        {showBubble && !isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium shadow-lg cursor-pointer"
            style={{
              background: '#2d2d2d',
              border: '1px solid #3d3d3d',
              color: '#e5e5e5',
            }}
            onClick={() => {
              setIsOpen(true)
              setShowBubble(false)
            }}
          >
            <FiMessageCircle size={16} style={{ color: '#25d366' }} />
            Chat with us!
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowBubble(false)
              }}
              className="text-[#6b7280] hover:text-white transition-colors ml-1"
            >
              <FiX size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Main WhatsApp Button */}
      <motion.button
        onClick={() => {
          setIsOpen(prev => !prev)
          setShowBubble(false)
        }}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all relative"
        style={{
          background: '#25d366',
          boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="WhatsApp Chat"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <FiX size={24} color="white" />
            </motion.div>
          ) : (
            <motion.div
              key="whatsapp"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <FaWhatsapp size={28} color="white" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse ring */}
        {!isOpen && (
          <span
            className="absolute inset-0 rounded-full animate-ping"
            style={{
              background: 'rgba(37, 211, 102, 0.3)',
              animationDuration: '2s',
            }}
          />
        )}
      </motion.button>
    </div>
  )
}

export default WhatsAppFloat