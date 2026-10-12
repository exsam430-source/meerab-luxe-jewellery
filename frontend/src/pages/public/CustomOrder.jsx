import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSend, FiUpload, FiX, FiCheck, FiAlertCircle } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import SEO from '../../components/common/SEO.jsx'
import Breadcrumb from '../../components/common/Breadcrumb.jsx'
import { orderApi } from '../../api/orderApi.js'
import { WHATSAPP_NUMBER } from '../../utils/constants.js'
import toast from 'react-hot-toast'

const JEWELLERY_TYPES = [
  'Necklace Set', 'Bangles', 'Earrings', 'Ring', 'Bridal Set',
  'Kundan Set', 'Maang Tikka', 'Anklets', 'Bracelet',
  'Gold Necklace', 'Gold Bangles', 'Gold Ring', 'Gold Earrings',
  'Gold Bridal Set', 'Other',
]

const METALS = [
  'Gold Plated', 'Rose Gold Plated', 'Silver Plated',
  'Real Gold (24k)', 'Real Gold (22k)', 'Real Gold (21k)', 'Real Gold (18k)',
  'Real Silver', 'Kundan', 'Oxidised Silver',
]

const BUDGETS = [
  'Under Rs. 1,000', 'Rs. 1,000 – 3,000', 'Rs. 3,000 – 5,000',
  'Rs. 5,000 – 10,000', 'Rs. 10,000 – 25,000', 'Rs. 25,000 – 50,000',
  'Rs. 50,000+', 'Flexible / Discuss',
]

const KARAT_OPTIONS = ['24k', '23k', '22k', '21k', '20k', '19k', '18k', '17k', '16k']

const INITIAL_FORM = {
  name: '', phone: '', email: '', jewelleryType: '', metal: '',
  budget: '', quantity: '1', occasion: '', deadline: '', description: '', goldKarat: '',
}

const isGoldType = (type) => {
  if (!type) return false
  return type.toLowerCase().includes('gold')
}

const CustomOrder = () => {
  const [form, setForm] = useState(INITIAL_FORM)
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [orderRef, setOrderRef] = useState('')
  const [errors, setErrors] = useState({})

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Custom Order' },
  ]

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
    if (field === 'jewelleryType' && !isGoldType(value)) {
      setForm(prev => ({ ...prev, jewelleryType: value, goldKarat: '' }))
    }
  }

  const handleImageAdd = (e) => {
    const files = Array.from(e.target.files)
    if (images.length + files.length > 3) {
      toast.error('Maximum 3 reference images allowed')
      return
    }
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }))
    setImages(prev => [...prev, ...newImages])
    e.target.value = ''
  }

  const handleImageRemove = (index) => {
    setImages(prev => {
      const updated = [...prev]
      URL.revokeObjectURL(updated[index].preview)
      updated.splice(index, 1)
      return updated
    })
  }

  const validate = () => {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = 'Name is required'
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!form.jewelleryType) newErrors.jewelleryType = 'Please select jewellery type'
    if (!form.description.trim()) newErrors.description = 'Please describe what you want'
    if (form.phone.trim() && !/^[0-9+-\s()]{7,15}$/.test(form.phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) {
      toast.error('Please fill in all required fields')
      return
    }
    if (loading) return

    setLoading(true)
    try {
      const fd = new FormData()
      Object.keys(form).forEach(key => {
        if (form[key]) fd.append(key, form[key])
      })
      images.forEach((img, i) => {
        fd.append(`referenceImage${i + 1}`, img.file)
      })

      const res = await orderApi.createCustomOrder(fd)

      if (res.data.success) {
        setSubmitted(true)
        setOrderRef(res.data.orderRef || res.data.orderId || 'CO-' + Date.now())
        toast.success('Custom order submitted successfully!')
      } else {
        toast.error(res.data.message || 'Failed to submit order')
      }
    } catch (err) {
      console.error('Custom order error:', err)
      toast.error('Submission failed. Please use WhatsApp to place your order.')
    } finally {
      setLoading(false)
    }
  }

  const buildWhatsAppMessage = () => {
    let msg = `*Custom Jewellery Order Request*\n\n`
    msg += `*Name:* ${form.name}\n`
    msg += `*Phone:* ${form.phone}\n`
    if (form.email) msg += `*Email:* ${form.email}\n`
    msg += `*Jewellery Type:* ${form.jewelleryType}\n`
    if (form.goldKarat) msg += `*Gold Karat:* ${form.goldKarat}\n`
    if (form.metal) msg += `*Metal:* ${form.metal}\n`
    if (form.budget) msg += `*Budget:* ${form.budget}\n`
    if (form.quantity) msg += `*Quantity:* ${form.quantity}\n`
    if (form.occasion) msg += `*Occasion:* ${form.occasion}\n`
    if (form.deadline) msg += `*Deadline:* ${form.deadline}\n`
    msg += `\n*Description:*\n${form.description}`
    return encodeURIComponent(msg)
  }

  // ── Success Screen ──
  if (submitted) {
    return (
      <>
        <SEO
          title="Order Submitted | MeerabLuxe Jewellers"
          description="Your custom jewellery order has been submitted."
        />
        <div className="min-h-screen flex items-center justify-center px-4 py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md w-full text-center"
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: 'rgba(16,185,129,0.15)', border: '2px solid #10b981' }}
            >
              <FiCheck size={36} style={{ color: '#10b981' }} />
            </div>

            <h1 className="font-playfair font-bold text-white text-2xl mb-3">
              Order Submitted!
            </h1>
            <p className="text-[#a0a0a0] text-sm mb-2">
              Thank you <span className="text-white font-medium">{form.name}</span>!
              Your custom order request has been received.
            </p>
            {orderRef && (
              <div
                className="inline-block px-4 py-2 rounded-xl mb-6 mt-2"
                style={{
                  background: 'rgba(212,175,55,0.1)',
                  border: '1px solid rgba(212,175,55,0.2)',
                }}
              >
                <p className="text-xs text-[#6b7280]">Order Reference</p>
                <p className="font-bold text-[#d4af37] text-lg">{orderRef}</p>
              </div>
            )}
            <p className="text-[#6b7280] text-sm mb-8">
              We will review your request and contact you within 24 hours on
              your provided phone number.
            </p>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                `Assalamu Alaikum! I just submitted a custom order (Ref: ${orderRef}). Please confirm receipt.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-sm mb-4 whatsapp-btn"
            >
              <FaWhatsapp size={20} />
              Follow Up on WhatsApp
            </a>

            <button
              onClick={() => {
                setSubmitted(false)
                setForm(INITIAL_FORM)
                setImages([])
                setOrderRef('')
              }}
              className="w-full py-3 rounded-xl text-sm font-medium transition-colors text-[#a0a0a0] hover:text-white"
              style={{ background: '#2d2d2d' }}
            >
              Submit Another Order
            </button>
          </motion.div>
        </div>
      </>
    )
  }

  // ── Main Form ──
  return (
    <>
      <SEO
        title="Custom Order | MeerabLuxe Jewellers"
        description="Order custom handcrafted jewellery tailored to your specifications. Gold, silver, bridal sets and more."
        keywords="custom jewellery order Pakistan, handmade jewellery, bespoke jewellery, gold custom order"
        canonical="/custom-order"
      />

      {/* Hero */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1a1200 0%, #2d2000 50%, #1a1200 100%)',
          padding: '40px 0',
        }}
      >
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-[#d4af37] text-xs font-semibold tracking-widest uppercase mb-2">
              Handcrafted Just for You
            </p>
            <h1
              className="font-playfair font-bold text-white"
              style={{ fontSize: 'clamp(26px, 5vw, 40px)' }}
            >
              Custom Jewellery Order
            </h1>
            <p className="text-[#a0a0a0] mt-3 text-sm max-w-md mx-auto leading-relaxed">
              Describe your dream jewellery and we will craft it for you.
              Every piece is handmade with love and precision.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container-custom py-10 max-w-3xl">
        <Breadcrumb items={breadcrumbs} />

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Form ── */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Personal Info */}
              <div
                className="rounded-2xl p-5"
                style={{ background: '#1e1e1e', border: '1px solid #3d3d3d' }}
              >
                <h2 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
                  Your Details
                </h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-[#a0a0a0] mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => handleChange('name', e.target.value)}
                      className="input-dark"
                      placeholder="Your full name"
                    />
                    {errors.name && (
                      <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                        <FiAlertCircle size={11} /> {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-[#a0a0a0] mb-1.5">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={e => handleChange('phone', e.target.value)}
                        className="input-dark"
                        placeholder="+92 310 2442743"
                      />
                      {errors.phone && (
                        <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                          <FiAlertCircle size={11} /> {errors.phone}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs text-[#a0a0a0] mb-1.5">
                        Email (optional)
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={e => handleChange('email', e.target.value)}
                        className="input-dark"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div
                className="rounded-2xl p-5"
                style={{ background: '#1e1e1e', border: '1px solid #3d3d3d' }}
              >
                <h2 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
                  Order Details
                </h2>
                <div className="space-y-3">

                  {/* Jewellery Type */}
                  <div>
                    <label className="block text-xs text-[#a0a0a0] mb-1.5">
                      Jewellery Type *
                    </label>
                    <select
                      value={form.jewelleryType}
                      onChange={e => handleChange('jewelleryType', e.target.value)}
                      className="input-dark"
                    >
                      <option value="">Select type...</option>
                      <optgroup label="General Jewellery">
                        {JEWELLERY_TYPES.filter(t => !t.toLowerCase().includes('gold') && t !== 'Other').map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </optgroup>
                      <optgroup label="🥇 Real Gold">
                        {JEWELLERY_TYPES.filter(t => t.toLowerCase().includes('gold')).map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </optgroup>
                      <option value="Other">Other</option>
                    </select>
                    {errors.jewelleryType && (
                      <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                        <FiAlertCircle size={11} /> {errors.jewelleryType}
                      </p>
                    )}
                  </div>

                  {/* Gold Karat */}
                  <AnimatePresence>
                    {isGoldType(form.jewelleryType) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div
                          className="rounded-xl p-3"
                          style={{
                            background: 'rgba(212,175,55,0.05)',
                            border: '1px solid rgba(212,175,55,0.2)',
                          }}
                        >
                          <label className="block text-xs text-[#d4af37] mb-1.5 font-medium">
                            🥇 Gold Karat Preference
                          </label>
                          <select
                            value={form.goldKarat}
                            onChange={e => handleChange('goldKarat', e.target.value)}
                            className="input-dark text-sm"
                          >
                            <option value="">Select karat...</option>
                            {KARAT_OPTIONS.map(k => (
                              <option key={k} value={k}>{k} Gold</option>
                            ))}
                          </select>
                          <p className="text-xs text-[#6b7280] mt-1.5">
                            24k is purest gold. 22k is most common for jewellery.
                            Higher karat = more pure = higher price.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Metal */}
                  <div>
                    <label className="block text-xs text-[#a0a0a0] mb-1.5">
                      Preferred Metal / Finish
                    </label>
                    <select
                      value={form.metal}
                      onChange={e => handleChange('metal', e.target.value)}
                      className="input-dark"
                    >
                      <option value="">Select metal...</option>
                      {METALS.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-[#a0a0a0] mb-1.5">
                        Budget Range
                      </label>
                      <select
                        value={form.budget}
                        onChange={e => handleChange('budget', e.target.value)}
                        className="input-dark"
                      >
                        <option value="">Select budget...</option>
                        {BUDGETS.map(b => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-[#a0a0a0] mb-1.5">
                        Quantity
                      </label>
                      <input
                        type="number"
                        value={form.quantity}
                        onChange={e => handleChange('quantity', e.target.value)}
                        className="input-dark"
                        min="1"
                        max="100"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-[#a0a0a0] mb-1.5">
                        Occasion (optional)
                      </label>
                      <input
                        type="text"
                        value={form.occasion}
                        onChange={e => handleChange('occasion', e.target.value)}
                        className="input-dark"
                        placeholder="e.g. Wedding, Eid"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#a0a0a0] mb-1.5">
                        Needed By (optional)
                      </label>
                      <input
                        type="date"
                        value={form.deadline}
                        onChange={e => handleChange('deadline', e.target.value)}
                        className="input-dark"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div
                className="rounded-2xl p-5"
                style={{ background: '#1e1e1e', border: '1px solid #3d3d3d' }}
              >
                <h2 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
                  Describe Your Order *
                </h2>
                <textarea
                  value={form.description}
                  onChange={e => handleChange('description', e.target.value)}
                  className="input-dark resize-none"
                  rows={5}
                  placeholder="Please describe in detail what you want. Include:&#10;• Design style (traditional, modern, etc.)&#10;• Stone preferences (colour, type)&#10;• Size requirements&#10;• Any specific design features&#10;• Reference to similar pieces you like"
                />
                {errors.description && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <FiAlertCircle size={11} /> {errors.description}
                  </p>
                )}
                <p className="text-xs text-[#6b7280] mt-1.5">
                  The more detail you provide, the better we can craft your dream piece.
                </p>
              </div>

              {/* Reference Images */}
              <div
                className="rounded-2xl p-5"
                style={{ background: '#1e1e1e', border: '1px solid #3d3d3d' }}
              >
                <h2 className="font-semibold text-white mb-1 text-sm uppercase tracking-wider">
                  Reference Images (optional)
                </h2>
                <p className="text-xs text-[#6b7280] mb-4">
                  Upload up to 3 images showing your desired design style
                </p>

                {images.length > 0 && (
                  <div className="flex flex-wrap gap-3 mb-4">
                    {images.map((img, i) => (
                      <div
                        key={i}
                        className="relative rounded-xl overflow-hidden"
                        style={{ width: '80px', height: '80px' }}
                      >
                        <img
                          src={img.preview}
                          alt={img.name}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleImageRemove(i)}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ background: 'rgba(0,0,0,0.7)' }}
                        >
                          <FiX size={10} color="white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {images.length < 3 && (
                  <label
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl cursor-pointer transition-all text-sm font-medium"
                    style={{
                      border: '1px dashed #3d3d3d',
                      color: '#a0a0a0',
                      background: 'transparent',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#d4af37'
                      e.currentTarget.style.color = '#d4af37'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#3d3d3d'
                      e.currentTarget.style.color = '#a0a0a0'
                    }}
                  >
                    <FiUpload size={16} />
                    {images.length === 0
                      ? 'Upload Reference Images'
                      : `Add More (${images.length}/3)`}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageAdd}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-gold w-full py-4 flex items-center justify-center gap-2 font-semibold text-sm"
              >
                {loading ? (
                  <>
                    <div
                      className="w-5 h-5 rounded-full border-2 animate-spin"
                      style={{ borderColor: '#1a1a1a', borderTopColor: 'transparent' }}
                    />
                    Submitting Order...
                  </>
                ) : (
                  <>
                    <FiSend size={18} />
                    Submit Custom Order
                  </>
                )}
              </button>
            </form>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-4">

            {/* WhatsApp Quick Order */}
            <div
              className="rounded-2xl p-5"
              style={{ background: '#1e1e1e', border: '1px solid #3d3d3d' }}
            >
              <h3 className="font-semibold text-white text-sm mb-2">
                Prefer WhatsApp?
              </h3>
              <p className="text-xs text-[#6b7280] mb-4 leading-relaxed">
                Fill the form and click below to send your order details directly
                via WhatsApp for faster response.
              </p>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${buildWhatsAppMessage()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm whatsapp-btn transition-all"
              >
                <FaWhatsapp size={18} />
                Send via WhatsApp
              </a>
            </div>

            {/* How It Works */}
            <div
              className="rounded-2xl p-5"
              style={{ background: '#1e1e1e', border: '1px solid #3d3d3d' }}
            >
              <h3 className="font-semibold text-white text-sm mb-4">
                How It Works
              </h3>
              <div className="space-y-4">
                {[
                  {
                    step: '01',
                    title: 'Submit Your Order',
                    desc: 'Fill in the form with your requirements and design preferences.',
                  },
                  {
                    step: '02',
                    title: 'We Review & Quote',
                    desc: 'Our team reviews your order within 24 hours and provides a price quote.',
                  },
                  {
                    step: '03',
                    title: 'Crafting Begins',
                    desc: 'After your approval, our skilled artisans begin crafting your piece.',
                  },
                  {
                    step: '04',
                    title: 'Delivered to You',
                    desc: 'Your custom jewellery is carefully packaged and delivered.',
                  },
                ].map((item) => (
                  <div key={item.step} className="flex gap-3">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                      style={{
                        background: 'rgba(212,175,55,0.12)',
                        color: '#d4af37',
                        border: '1px solid rgba(212,175,55,0.2)',
                      }}
                    >
                      {item.step}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{item.title}</p>
                      <p className="text-xs text-[#6b7280] mt-0.5 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div
              className="rounded-2xl p-5 text-center"
              style={{ background: '#1e1e1e', border: '1px solid #3d3d3d' }}
            >
              <p className="text-xs text-[#6b7280] mb-1">Questions? Contact us</p>
              <a
                href="tel:+923454777588"
                className="text-[#d4af37] font-semibold text-sm"
              >
                +923454777588
              </a>
              <p className="text-xs text-[#6b7280] mt-2 leading-relaxed">
                Sarafa Bazaar, Haji Baba Chowk<br />
                Mingora, Swat, Pakistan
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default CustomOrder