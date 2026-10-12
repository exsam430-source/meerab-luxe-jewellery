import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiArrowLeft, FiPlus, FiX, FiSave } from 'react-icons/fi'
import ImageUpload from '../../../components/admin/ImageUpload.jsx'
import { productApi } from '../../../api/productApi.js'
import {
  CATEGORIES,
  LADIES_SUBCATEGORIES,
  GROOM_SUBCATEGORIES,
  MATERIALS,
} from '../../../utils/constants.js'
import toast from 'react-hot-toast'

const KARAT_OPTIONS = ['24k','23k','22k','21k','20k','19k','18k','17k','16k']

const BOOL_FIELDS = [
  'inStock', 'bestseller', 'newArrival', 'featured',
  'showInNecklaces', 'showInBangles', 'showInUnder1000',
  'showInKundan', 'showInBridalSet', 'showInPartyWear',
  'isGoldProduct', 'showInGold', 'sendNotification',
]

const TEXT_FIELDS = [
  'name', 'description', 'price', 'comparePrice',
  'category', 'subCategory', 'material',
  'weight', 'stoneType', 'stoneColor', 'sku', 'stockQuantity',
]

const INITIAL_FORM = {
  name: '', description: '', price: '', comparePrice: '',
  category: 'Ladies', subCategory: '',
  material: 'Artificial Gold Plated',
  weight: '', stoneType: '', stoneColor: '', sku: '', stockQuantity: '',
  inStock: false, bestseller: false, newArrival: false, featured: false,
  showInNecklaces: false, showInBangles: false, showInUnder1000: false,
  showInKundan: false, showInBridalSet: false, showInPartyWear: false,
  isGoldProduct: false, showInGold: false,
  sendNotification: false,
  sizes: [], colors: [],
  longDescription: { overview: '', careInstructions: '' },
  goldKarat: '',
  goldWeightGrams: '',
  makingCharges: '',
  stoneCost: '',
}

const Toggle = ({ field, label, value, onChange }) => {
  const on = value === true
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="text-sm text-[#a0a0a0]">{label}</span>
      <button
        type="button"
        onClick={() => onChange(field, !on)}
        className="relative w-11 h-6 rounded-full transition-all duration-200 flex-shrink-0"
        style={{ background: on ? '#d4af37' : '#3d3d3d' }}
      >
        <div
          className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200"
          style={{ left: on ? '24px' : '4px' }}
        />
      </button>
    </label>
  )
}

const AddProduct = () => {
  const navigate = useNavigate()
  const [form,        setForm]        = useState(INITIAL_FORM)
  const [images,      setImages]      = useState([null, null, null, null])
  const [loading,     setLoading]     = useState(false)
  const [sizeInput,   setSizeInput]   = useState('')
  const [colorInput,  setColorInput]  = useState('')

  const subcategories = form.category === 'Gents'
    ? GROOM_SUBCATEGORIES
    : LADIES_SUBCATEGORIES

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleLongDescChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      longDescription: { ...prev.longDescription, [field]: value },
    }))
  }

  const handleImageChange = (file, index) => {
    setImages(prev => { const u = [...prev]; u[index] = file; return u })
  }

  const handleImageRemove = (index) => {
    setImages(prev => { const u = [...prev]; u[index] = null; return u })
  }

  const addSize = () => {
    const v = sizeInput.trim()
    if (v && !form.sizes.includes(v)) {
      setForm(prev => ({ ...prev, sizes: [...prev.sizes, v] }))
      setSizeInput('')
    }
  }

  const removeSize = (s) => {
    setForm(prev => ({ ...prev, sizes: prev.sizes.filter(x => x !== s) }))
  }

  const addColor = () => {
    const v = colorInput.trim()
    if (v && !form.colors.includes(v)) {
      setForm(prev => ({ ...prev, colors: [...prev.colors, v] }))
      setColorInput('')
    }
  }

  const removeColor = (c) => {
    setForm(prev => ({ ...prev, colors: prev.colors.filter(x => x !== c) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim())                      { toast.error('Product name is required'); return }
    if (!form.price || Number(form.price) <= 0) { toast.error('Valid price is required'); return }
    if (!form.category)                          { toast.error('Category is required'); return }
    if (!form.subCategory)                       { toast.error('Sub-category is required'); return }
    if (!images.some(img => img !== null))       { toast.error('At least one image is required'); return }
    if (loading) return

    setLoading(true)
    try {
      const fd = new FormData()

      // Text fields
      TEXT_FIELDS.forEach(f => {
        if (form[f] !== '' && form[f] !== undefined) fd.append(f, form[f])
      })

      // Bool fields
      BOOL_FIELDS.forEach(f => {
        fd.append(f, form[f] === true ? 'true' : 'false')
      })

      // JSON fields
      fd.append('sizes',           JSON.stringify(form.sizes))
      fd.append('colors',          JSON.stringify(form.colors))
      fd.append('longDescription', JSON.stringify(form.longDescription))

      // Gold fields
      if (form.goldKarat)       fd.append('goldKarat',       form.goldKarat)
      if (form.goldWeightGrams) fd.append('goldWeightGrams', form.goldWeightGrams)
      if (form.makingCharges)   fd.append('makingCharges',   form.makingCharges)
      if (form.stoneCost)       fd.append('stoneCost',       form.stoneCost)

      // Images
      images.forEach((img, i) => {
        if (img) fd.append(`image${i + 1}`, img)
      })

      const res = await productApi.add(fd)
      if (res.data.success) {
        toast.success('Product added successfully!')
        navigate('/admin/products')
      } else {
        toast.error(res.data.message || 'Failed to add product')
      }
    } catch (err) {
      console.error('addProduct error:', err)
      toast.error('Failed to add product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5">

      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/admin/products"
          className="p-2 rounded-lg text-[#a0a0a0] hover:text-white hover:bg-[#2d2d2d] transition-colors"
        >
          <FiArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-playfair font-bold text-white text-xl">Add New Product</h1>
          <p className="text-[#6b7280] text-sm">Fill in the details to add a new jewellery product</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ── MAIN FORM ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Basic Info */}
            <div className="card-dark rounded-2xl p-5">
              <h2 className="font-semibold text-white mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[#a0a0a0] mb-1">Product Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => handleChange('name', e.target.value)}
                    className="input-dark"
                    placeholder="e.g. 22k Gold Bridal Necklace Set"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#a0a0a0] mb-1">Short Description</label>
                  <textarea
                    value={form.description}
                    onChange={e => handleChange('description', e.target.value)}
                    className="input-dark resize-none"
                    rows={3}
                    placeholder="Brief description..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[#a0a0a0] mb-1">Price (Rs.) *</label>
                    <input
                      type="number"
                      value={form.price}
                      onChange={e => handleChange('price', e.target.value)}
                      className="input-dark"
                      placeholder="2500"
                      min="0"
                      required
                    />
                    {form.isGoldProduct && (
                      <p className="text-xs text-[#6b7280] mt-1">
                        Auto-recalculated when gold price updates
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-[#a0a0a0] mb-1">Compare Price (Rs.)</label>
                    <input
                      type="number"
                      value={form.comparePrice}
                      onChange={e => handleChange('comparePrice', e.target.value)}
                      className="input-dark"
                      placeholder="3500"
                      min="0"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[#a0a0a0] mb-1">Category *</label>
                    <select
                      value={form.category}
                      onChange={e => {
                        handleChange('category', e.target.value)
                        handleChange('subCategory', '')
                      }}
                      className="input-dark"
                      required
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-[#a0a0a0] mb-1">Sub-Category *</label>
                    <select
                      value={form.subCategory}
                      onChange={e => handleChange('subCategory', e.target.value)}
                      className="input-dark"
                      required
                    >
                      <option value="">Select type</option>
                      {subcategories.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[#a0a0a0] mb-1">Material</label>
                    <select
                      value={form.material}
                      onChange={e => handleChange('material', e.target.value)}
                      className="input-dark"
                    >
                      {MATERIALS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-[#a0a0a0] mb-1">Weight</label>
                    <input
                      type="text"
                      value={form.weight}
                      onChange={e => handleChange('weight', e.target.value)}
                      className="input-dark"
                      placeholder="e.g. 25g"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-[#a0a0a0] mb-1">Stone Type</label>
                    <input
                      type="text"
                      value={form.stoneType}
                      onChange={e => handleChange('stoneType', e.target.value)}
                      className="input-dark"
                      placeholder="Cubic Zirconia"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#a0a0a0] mb-1">Stone Color</label>
                    <input
                      type="text"
                      value={form.stoneColor}
                      onChange={e => handleChange('stoneColor', e.target.value)}
                      className="input-dark"
                      placeholder="White"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#a0a0a0] mb-1">SKU</label>
                    <input
                      type="text"
                      value={form.sku}
                      onChange={e => handleChange('sku', e.target.value)}
                      className="input-dark"
                      placeholder="RBJ-001"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sizes & Colors */}
            <div className="card-dark rounded-2xl p-5">
              <h2 className="font-semibold text-white mb-4">Sizes & Colors</h2>
              <div className="mb-4">
                <label className="block text-sm text-[#a0a0a0] mb-2">Sizes</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={sizeInput}
                    onChange={e => setSizeInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSize())}
                    className="input-dark flex-1 text-sm"
                    placeholder="e.g. Small, Medium"
                  />
                  <button
                    type="button"
                    onClick={addSize}
                    className="px-3 py-2 rounded-lg text-sm"
                    style={{ background: 'rgba(212,175,55,0.15)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.3)' }}
                  >
                    <FiPlus size={16} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.sizes.map(s => (
                    <span
                      key={s}
                      className="flex items-center gap-1 px-3 py-1 rounded-lg text-sm"
                      style={{ background: 'rgba(212,175,55,0.1)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.2)' }}
                    >
                      {s}
                      <button type="button" onClick={() => removeSize(s)}>
                        <FiX size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#a0a0a0] mb-2">Colors</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={colorInput}
                    onChange={e => setColorInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addColor())}
                    className="input-dark flex-1 text-sm"
                    placeholder="e.g. Gold, Rose Gold"
                  />
                  <button
                    type="button"
                    onClick={addColor}
                    className="px-3 py-2 rounded-lg text-sm"
                    style={{ background: 'rgba(212,175,55,0.15)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.3)' }}
                  >
                    <FiPlus size={16} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.colors.map(c => (
                    <span
                      key={c}
                      className="flex items-center gap-1 px-3 py-1 rounded-lg text-sm"
                      style={{ background: 'rgba(212,175,55,0.1)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.2)' }}
                    >
                      {c}
                      <button type="button" onClick={() => removeColor(c)}>
                        <FiX size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Long Description */}
            <div className="card-dark rounded-2xl p-5">
              <h2 className="font-semibold text-white mb-4">Additional Description</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-[#a0a0a0] mb-1">Product Overview</label>
                  <textarea
                    value={form.longDescription.overview}
                    onChange={e => handleLongDescChange('overview', e.target.value)}
                    className="input-dark resize-none"
                    rows={3}
                    placeholder="Detailed overview..."
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#a0a0a0] mb-1">Care Instructions</label>
                  <textarea
                    value={form.longDescription.careInstructions}
                    onChange={e => handleLongDescChange('careInstructions', e.target.value)}
                    className="input-dark resize-none"
                    rows={2}
                    placeholder="Care instructions..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── SIDEBAR ── */}
          <div className="space-y-5">

            {/* Images */}
            <div className="card-dark rounded-2xl p-5">
              <h2 className="font-semibold text-white mb-4">Product Images *</h2>
              <div className="grid grid-cols-2 gap-3">
                {images.map((img, i) => (
                  <ImageUpload
                    key={i}
                    label={i === 0 ? 'Main Image *' : `Image ${i + 1}`}
                    value={img}
                    onChange={handleImageChange}
                    onRemove={handleImageRemove}
                    index={i}
                    required={i === 0}
                  />
                ))}
              </div>
            </div>

            {/* Stock & Status */}
            <div className="card-dark rounded-2xl p-5">
              <h2 className="font-semibold text-white mb-4">Stock & Status</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-[#a0a0a0] mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={form.stockQuantity}
                    onChange={e => handleChange('stockQuantity', e.target.value)}
                    className="input-dark"
                    placeholder="0"
                    min="0"
                  />
                </div>
                <Toggle field="inStock"    label="In Stock"      value={form.inStock}    onChange={handleChange} />
                <Toggle field="bestseller" label="🔥 Bestseller" value={form.bestseller} onChange={handleChange} />
                <Toggle field="newArrival" label="✨ New Arrival" value={form.newArrival} onChange={handleChange} />
                <Toggle field="featured"   label="⭐ Featured"   value={form.featured}   onChange={handleChange} />
              </div>
            </div>

            {/* Gold Product */}
            <div className="card-dark rounded-2xl p-5">
              <h2 className="font-semibold text-white mb-4">🥇 Gold Product</h2>
              <div className="space-y-3">
                <Toggle
                  field="isGoldProduct"
                  label="This is a Real Gold Product"
                  value={form.isGoldProduct}
                  onChange={handleChange}
                />

                <AnimatePresence>
                  {form.isGoldProduct && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-3 pt-2">
                        <div>
                          <label className="block text-xs text-[#a0a0a0] mb-1.5">
                            Gold Karat
                          </label>
                          <select
                            value={form.goldKarat}
                            onChange={e => handleChange('goldKarat', e.target.value)}
                            className="input-dark text-sm"
                          >
                            <option value="">Select karat</option>
                            {KARAT_OPTIONS.map(k => (
                              <option key={k} value={k}>{k} Gold</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-[#a0a0a0] mb-1.5">
                            Gold Weight (grams)
                          </label>
                          <input
                            type="number"
                            value={form.goldWeightGrams}
                            onChange={e => handleChange('goldWeightGrams', e.target.value)}
                            className="input-dark text-sm"
                            placeholder="e.g. 12.500"
                            min="0"
                            step="0.001"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-[#a0a0a0] mb-1.5">
                            Making Charges (Rs.)
                          </label>
                          <input
                            type="number"
                            value={form.makingCharges}
                            onChange={e => handleChange('makingCharges', e.target.value)}
                            className="input-dark text-sm"
                            placeholder="e.g. 2000"
                            min="0"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-[#a0a0a0] mb-1.5">
                            Stone / Extra Cost (Rs.)
                          </label>
                          <input
                            type="number"
                            value={form.stoneCost}
                            onChange={e => handleChange('stoneCost', e.target.value)}
                            className="input-dark text-sm"
                            placeholder="e.g. 500"
                            min="0"
                          />
                        </div>
                        <div
                          className="rounded-lg p-3 text-xs"
                          style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)' }}
                        >
                          <p className="text-[#d4af37] mb-1 font-medium">💡 Auto-Price Formula</p>
                          <p className="text-[#6b7280] leading-relaxed">
                            Price = (Gold Rate/gram × Purity × Weight)
                            + Making Charges + Stone Cost
                          </p>
                          <p className="text-[#6b7280] mt-1">
                            Price updates automatically when admin updates gold rate.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Page Visibility */}
            <div className="card-dark rounded-2xl p-5">
              <h2 className="font-semibold text-white mb-4">Page Visibility</h2>
              <p className="text-xs text-[#6b7280] mb-3">
                Enable to show on specific collection pages
              </p>
              <div className="space-y-3">
                <Toggle field="showInGold"      label="🥇 Show in Gold Jewellery" value={form.showInGold}      onChange={handleChange} />
                <Toggle field="showInNecklaces" label="📿 Show in Necklaces"      value={form.showInNecklaces} onChange={handleChange} />
                <Toggle field="showInBangles"   label="⭕ Show in Bangles"        value={form.showInBangles}   onChange={handleChange} />
                <Toggle field="showInBridalSet" label="👰 Show in Bridal Sets"    value={form.showInBridalSet} onChange={handleChange} />
                <Toggle field="showInKundan"    label="✨ Show in Kundan"         value={form.showInKundan}    onChange={handleChange} />
                <Toggle field="showInUnder1000" label="💎 Show in Under 1000"     value={form.showInUnder1000} onChange={handleChange} />
                <Toggle field="showInPartyWear" label="🎉 Show in Party Wear"     value={form.showInPartyWear} onChange={handleChange} />
                <Toggle field="sendNotification" label="📧 Email Subscribers"    value={form.sendNotification} onChange={handleChange} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-3.5 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div
                    className="w-5 h-5 rounded-full border-2 animate-spin"
                    style={{ borderColor: '#1a1a1a', borderTopColor: 'transparent' }}
                  />
                  Adding Product...
                </>
              ) : (
                <>
                  <FiSave size={18} />
                  Add Product
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AddProduct