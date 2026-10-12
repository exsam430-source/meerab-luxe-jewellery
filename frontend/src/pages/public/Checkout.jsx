// Checkout.jsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiUser, FiPhone, FiMapPin, FiMail,
  FiChevronRight, FiCheck, FiAlertCircle,
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import SEO from '../../components/common/SEO.jsx'
import { orderApi } from '../../api/orderApi.js'
import { productApi } from '../../api/productApi.js'
import { useAuth } from '../../context/AuthContext.jsx'
import useCart from '../../hooks/useCart.js'
import useSettings from '../../hooks/useSettings.js'
import { useCart as useCartContext } from '../../context/CartContext.jsx'
import { formatPrice } from '../../utils/helpers.js'
import { createOrderWhatsAppLink } from '../../utils/whatsappLink.js'
import { getOptimizedImageUrl } from '../../utils/helpers.js'
import toast from 'react-hot-toast'

const PAYMENT_METHODS = [
  {
    id: 'COD',
    label: 'Cash on Delivery',
    icon: '💵',
    desc: 'Pay when you receive your order',
  },
  {
    id: 'Easypaisa',
    label: 'Easypaisa',
    icon: '📱',
    desc: 'Send payment to 03184887631 (MEERB TARIQ)',
  },
  {
    id: 'BankTransfer',
    label: 'Bank Transfer',
    icon: '🏦',
    desc: 'UBL Bank Limited — 08040107780713 (Meerab tariq)',
  },
  {
    id: 'WhatsApp',
    label: 'Order via WhatsApp',
    icon: '💬',
    desc: 'Confirm order & payment details on WhatsApp',
  },
]

const Checkout = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const { settings } = useSettings()

  const {
    getCartItemsArray,
    getSubtotal,
    getDeliveryCharges,
    getTotal,
    isFreeDelivery,
    isEmpty,
    getCartItemsForOrder,
    clearCart,
  } = useCart()

  const { products, setProducts } = useCartContext()

  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState('COD')
  const [paymentDetails, setPaymentDetails] = useState({
    transactionId: '',
    senderName: '',
    senderNumber: '',
  })

  const [address, setAddress] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    province: 'Punjab',
    notes: '',
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (products.length === 0) loadProducts()
  }, [])

  useEffect(() => {
    if (isEmpty && products.length > 0) {
      toast.error('Your cart is empty')
      navigate('/cart')
    }
  }, [isEmpty, products])

  const loadProducts = async () => {
    try {
      const res = await productApi.getAll()
      if (res.data.success) setProducts(res.data.products || [])
    } catch (err) {
      console.error('Checkout products load error:', err)
    }
  }

  const cartItemsArray = getCartItemsArray()
  const subtotal = getSubtotal()
  const delivery = getDeliveryCharges()
  const total = getTotal()
  const freeDelivery = isFreeDelivery()

  const validateAddress = () => {
    const errs = {}
    if (!address.firstName.trim()) errs.firstName = 'First name is required'
    if (!address.phone.trim()) errs.phone = 'Phone number is required'
    if (!address.street.trim()) errs.street = 'Street address is required'
    if (!address.city.trim()) errs.city = 'City is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleAddressChange = (field, value) => {
    setAddress(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handlePlaceOrder = async () => {
    if (!validateAddress()) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)

    try {
      const userId = user?.id || user?._id || 'guest'
      const orderAddress = {
        firstName: address.firstName,
        lastName: address.lastName,
        email: address.email,
        phone: address.phone,
        street: address.street,
        city: address.city,
        province: address.province,
        notes: address.notes,
      }

      const items = getCartItemsForOrder(products)

      if (items.length === 0) {
        toast.error('Your cart is empty')
        navigate('/cart')
        return
      }

      let res

      if (paymentMethod === 'WhatsApp') {
        const waLink = createOrderWhatsAppLink(
          items,
          total,
          orderAddress,
          settings?.whatsappNumber
        )
        window.open(waLink, '_blank', 'noopener,noreferrer')

        res = await orderApi.placeWhatsApp({
          userId,
          items,
          amount: total,
          address: orderAddress,
        })
      } else if (paymentMethod === 'COD') {
        res = await orderApi.placeCOD({
          userId,
          items,
          amount: total,
          address: orderAddress,
        })
      } else if (paymentMethod === 'Easypaisa') {
        res = await orderApi.placeEasypaisa({
          userId,
          items,
          amount: total,
          address: orderAddress,
          paymentDetails,
        })
      } else if (paymentMethod === 'BankTransfer') {
        res = await orderApi.placeBankTransfer({
          userId,
          items,
          amount: total,
          address: orderAddress,
          paymentDetails,
        })
      }

      if (res?.data?.success) {
        const orderId = res.data.orderId
        await clearCart()
        toast.success('Order placed successfully! 🎉')
        navigate(`/order-success/${orderId}`)
      } else {
        toast.error(res?.data?.message || 'Failed to place order')
      }
    } catch (error) {
      console.error('Place order error:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEO
        title="Checkout | MeerabLuxe Jewellers"
        description="Complete your jewellery order securely."
        noIndex
      />

      <div className="container-custom py-6 md:py-10">

        {/* Header */}
        <div className="mb-6">
          <h1
            className="font-playfair font-bold text-white"
            style={{ fontSize: 'clamp(22px, 4vw, 32px)' }}
          >
            Checkout
          </h1>

          {/* Steps indicator */}
          <div className="flex items-center gap-2 mt-3">
            {['Delivery Info', 'Payment', 'Confirm'].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 text-xs font-medium">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: step > i + 1
                        ? '#10b981'
                        : step === i + 1
                          ? '#d4af37'
                          : '#3d3d3d',
                      color: step >= i + 1 ? '#1a1a1a' : '#6b7280',
                    }}
                  >
                    {step > i + 1 ? <FiCheck size={12} /> : i + 1}
                  </div>
                  <span
                    className="hidden sm:block"
                    style={{
                      color: step === i + 1 ? '#d4af37' : step > i + 1 ? '#10b981' : '#6b7280',
                    }}
                  >
                    {s}
                  </span>
                </div>
                {i < 2 && (
                  <div
                    className="w-8 h-px"
                    style={{ background: step > i + 1 ? '#10b981' : '#3d3d3d' }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Form */}
          <div className="lg:col-span-2 space-y-5">

            {/* Step 1: Delivery Info */}
            {step >= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-dark rounded-2xl p-5 md:p-6"
              >
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-semibold text-white flex items-center gap-2">
                    <FiMapPin size={18} style={{ color: '#d4af37' }} />
                    Delivery Information
                  </h2>
                  {step > 1 && (
                    <button
                      onClick={() => setStep(1)}
                      className="text-xs text-[#d4af37] hover:text-[#f4e5c2]"
                    >
                      Edit
                    </button>
                  )}
                </div>

                {step === 1 ? (
                  <div className="space-y-4">
                    {/* Name Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-[#a0a0a0] mb-1">
                          First Name *
                        </label>
                        <input
                          type="text"
                          value={address.firstName}
                          onChange={e => handleAddressChange('firstName', e.target.value)}
                          className="input-dark"
                          placeholder="Muhammad"
                        />
                        {errors.firstName && (
                          <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                            <FiAlertCircle size={12} /> {errors.firstName}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm text-[#a0a0a0] mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={address.lastName}
                          onChange={e => handleAddressChange('lastName', e.target.value)}
                          className="input-dark"
                          placeholder="Ahmed"
                        />
                      </div>
                    </div>

                    {/* Phone & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-[#a0a0a0] mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={address.phone}
                          onChange={e => handleAddressChange('phone', e.target.value)}
                          className="input-dark"
                          placeholder="03XX-XXXXXXX"
                        />
                        {errors.phone && (
                          <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                            <FiAlertCircle size={12} /> {errors.phone}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm text-[#a0a0a0] mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={address.email}
                          onChange={e => handleAddressChange('email', e.target.value)}
                          className="input-dark"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    {/* Street */}
                    <div>
                      <label className="block text-sm text-[#a0a0a0] mb-1">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        value={address.street}
                        onChange={e => handleAddressChange('street', e.target.value)}
                        className="input-dark"
                        placeholder="House #, Street, Area"
                      />
                      {errors.street && (
                        <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                          <FiAlertCircle size={12} /> {errors.street}
                        </p>
                      )}
                    </div>

                    {/* City & Province */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-[#a0a0a0] mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          value={address.city}
                          onChange={e => handleAddressChange('city', e.target.value)}
                          className="input-dark"
                          placeholder="Enter your city"
                        />
                        {errors.city && (
                          <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                            <FiAlertCircle size={12} /> {errors.city}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm text-[#a0a0a0] mb-1">
                          Province
                        </label>
                        <select
                          value={address.province}
                          onChange={e => handleAddressChange('province', e.target.value)}
                          className="input-dark"
                        >
                          {[
                            'Punjab',
                            'Sindh',
                            'KPK',
                            'Balochistan',
                            'AJK',
                            'Gilgit-Baltistan',
                            'Islamabad Capital Territory',
                          ].map(p => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-sm text-[#a0a0a0] mb-1">
                        Order Notes (optional)
                      </label>
                      <textarea
                        value={address.notes}
                        onChange={e => handleAddressChange('notes', e.target.value)}
                        className="input-dark resize-none"
                        rows={3}
                        placeholder="Any special instructions for delivery..."
                      />
                    </div>

                    <button
                      onClick={() => {
                        if (validateAddress()) setStep(2)
                      }}
                      className="btn-gold w-full flex items-center justify-center gap-2 py-3"
                    >
                      Continue to Payment
                      <FiChevronRight size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="text-sm text-[#a0a0a0] space-y-1">
                    <p className="text-white font-medium">
                      {address.firstName} {address.lastName}
                    </p>
                    <p>{address.phone}</p>
                    <p>{address.street}, {address.city}</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 2: Payment */}
            {step >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-dark rounded-2xl p-5 md:p-6"
              >
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-semibold text-white flex items-center gap-2">
                    💳 Payment Method
                  </h2>
                  {step > 2 && (
                    <button
                      onClick={() => setStep(2)}
                      className="text-xs text-[#d4af37] hover:text-[#f4e5c2]"
                    >
                      Edit
                    </button>
                  )}
                </div>

                {step === 2 ? (
                  <div className="space-y-3">
                    {PAYMENT_METHODS.map(method => (
                      <label
                        key={method.id}
                        className="flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all"
                        style={{
                          background: paymentMethod === method.id
                            ? 'rgba(212,175,55,0.08)'
                            : '#2d2d2d',
                          border: `1px solid ${paymentMethod === method.id
                            ? 'rgba(212,175,55,0.3)'
                            : '#3d3d3d'}`,
                        }}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={() => setPaymentMethod(method.id)}
                          className="mt-0.5 accent-[#d4af37]"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span>{method.icon}</span>
                            <span className="font-medium text-white text-sm">
                              {method.label}
                            </span>
                          </div>
                          <p className="text-xs text-[#6b7280] mt-1">
                            {method.desc}
                          </p>
                        </div>
                      </label>
                    ))}

                    {/* Payment Details for Easypaisa/Bank */}
                    {(paymentMethod === 'Easypaisa' || paymentMethod === 'BankTransfer') && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-3 pt-2"
                      >
                        <div
                          className="rounded-xl p-4 text-sm"
                          style={{
                            background: 'rgba(212,175,55,0.06)',
                            border: '1px solid rgba(212,175,55,0.2)',
                          }}
                        >
                          {paymentMethod === 'Easypaisa' ? (
                            <>
                              <p className="text-[#d4af37] font-semibold mb-1">
                                📱 Easypaisa Details:
                              </p>
                              <p className="text-[#e5e5e5]">
                                Number: <strong>03184887631</strong>
                              </p>
                              <p className="text-[#e5e5e5]">
                                Name: <strong>MEERB TARIQ</strong>
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="text-[#d4af37] font-semibold mb-1">
                                🏦 Bank Transfer Details:
                              </p>
                              <p className="text-[#e5e5e5]">
                                Bank: <strong>UBL Bank Limited</strong>
                              </p>
                              <p className="text-[#e5e5e5]">
                                Account: <strong>no account number use Iban instead</strong>
                              </p>
                              <p className="text-[#e5e5e5]">
                                Title: <strong>Meerab tariq</strong>
                              </p>
                              <p className="text-[#e5e5e5]">
                                IBAN: <strong>PK61UNIL0109000336862358</strong>
                              </p>
                            </>
                          )}
                          <p className="text-[#6b7280] text-xs mt-2">
                            Amount to send:{' '}
                            <strong className="text-[#d4af37]">
                              {formatPrice(total)}
                            </strong>
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-[#a0a0a0] mb-1">
                              Transaction ID
                            </label>
                            <input
                              type="text"
                              value={paymentDetails.transactionId}
                              onChange={e =>
                                setPaymentDetails(prev => ({
                                  ...prev,
                                  transactionId: e.target.value,
                                }))
                              }
                              className="input-dark text-sm"
                              placeholder="TXN ID (optional)"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-[#a0a0a0] mb-1">
                              Sender Name
                            </label>
                            <input
                              type="text"
                              value={paymentDetails.senderName}
                              onChange={e =>
                                setPaymentDetails(prev => ({
                                  ...prev,
                                  senderName: e.target.value,
                                }))
                              }
                              className="input-dark text-sm"
                              placeholder="Your name"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-[#a0a0a0] mb-1">
                              Sender Number
                            </label>
                            <input
                              type="text"
                              value={paymentDetails.senderNumber}
                              onChange={e =>
                                setPaymentDetails(prev => ({
                                  ...prev,
                                  senderNumber: e.target.value,
                                }))
                              }
                              className="input-dark text-sm"
                              placeholder="03XX-XXXXXXX"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <button
                      onClick={() => setStep(3)}
                      className="btn-gold w-full flex items-center justify-center gap-2 py-3 mt-2"
                    >
                      Review Order
                      <FiChevronRight size={18} />
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-[#a0a0a0]">
                    {PAYMENT_METHODS.find(m => m.id === paymentMethod)?.label}
                  </p>
                )}
              </motion.div>
            )}

            {/* Step 3: Confirm */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-dark rounded-2xl p-5 md:p-6"
              >
                <h2 className="font-semibold text-white mb-4">
                  ✅ Review & Confirm
                </h2>

                <div className="space-y-2 mb-5">
                  {cartItemsArray.map(item => {
                    if (!item.product) return null
                    return (
                      <div
                        key={`${item.productId}-${item.size}-${item.color}`}
                        className="flex items-center gap-3"
                      >
                        <div
                          className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0"
                          style={{ background: '#2d2d2d' }}
                        >
                          {item.product.images?.[0] ? (
                            <img
                              src={getOptimizedImageUrl(item.product.images[0], 100, 70)}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span>💍</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-[#6b7280]">
                            Qty: {item.quantity}
                            {item.size ? ` | Size: ${item.size}` : ''}
                            {item.color ? ` | Color: ${item.color}` : ''}
                          </p>
                        </div>
                        <span className="text-sm font-medium text-[#d4af37] flex-shrink-0">
                          {formatPrice(item.total)}
                        </span>
                      </div>
                    )
                  })}
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-base transition-all"
                  style={{
                    background: loading
                      ? '#3d3d3d'
                      : paymentMethod === 'WhatsApp'
                        ? '#25d366'
                        : 'linear-gradient(135deg, #d4af37, #b8960c)',
                    color: '#1a1a1a',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: loading ? 'none' : '0 4px 20px rgba(212,175,55,0.4)',
                  }}
                >
                  {loading ? (
                    <>
                      <div
                        className="w-5 h-5 rounded-full border-2 animate-spin"
                        style={{
                          borderColor: '#1a1a1a',
                          borderTopColor: 'transparent',
                        }}
                      />
                      Placing Order...
                    </>
                  ) : paymentMethod === 'WhatsApp' ? (
                    <>
                      <FaWhatsapp size={20} />
                      Place Order via WhatsApp
                    </>
                  ) : (
                    <>
                      <FiCheck size={20} />
                      Place Order — {formatPrice(total)}
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="card-dark rounded-2xl p-5 sticky top-24">
              <h2 className="font-playfair font-bold text-white text-lg mb-4">
                Order Summary
              </h2>

              {/* Items */}
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {cartItemsArray.map(item => {
                  if (!item.product) return null
                  return (
                    <div
                      key={`${item.productId}-${item.size}-${item.color}`}
                      className="flex items-center gap-2"
                    >
                      <div
                        className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0"
                        style={{ background: '#2d2d2d' }}
                      >
                        {item.product.images?.[0] ? (
                          <img
                            src={getOptimizedImageUrl(item.product.images[0], 80, 70)}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-sm">
                            💍
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white truncate">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-[#6b7280]">
                          x{item.quantity}
                        </p>
                      </div>
                      <span className="text-xs font-medium text-[#d4af37] flex-shrink-0">
                        {formatPrice(item.total)}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Totals */}
              <div
                className="border-t pt-4 space-y-2"
                style={{ borderColor: '#3d3d3d' }}
              >
                <div className="flex justify-between text-sm">
                  <span className="text-[#a0a0a0]">Subtotal</span>
                  <span className="text-white">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#a0a0a0]">Delivery</span>
                  <span style={{ color: freeDelivery ? '#10b981' : '#e5e5e5' }}>
                    {freeDelivery ? 'FREE' : formatPrice(delivery)}
                  </span>
                </div>
                <div
                  className="flex justify-between font-bold pt-2 border-t"
                  style={{ borderColor: '#3d3d3d' }}
                >
                  <span className="text-white">Total</span>
                  <span style={{ color: '#d4af37', fontSize: '18px' }}>
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Checkout