import { useState, useRef } from 'react'
import { FiUpload, FiX, FiImage } from 'react-icons/fi'
import { getOptimizedImageUrl } from '../../utils/helpers.js'

const ImageUpload = ({
  label = 'Upload Image',
  value = null,
  onChange,
  onRemove,
  accept = 'image/jpeg,image/jpg,image/png,image/webp',
  maxSize = 10,
  index = null,
  required = false,
}) => {
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState('')

  const validateFile = (file) => {
    setError('')
    if (!file) return false

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      setError('Only JPG, PNG, WebP images allowed')
      return false
    }

    if (file.size > maxSize * 1024 * 1024) {
      setError(`File must be under ${maxSize}MB`)
      return false
    }

    return true
  }

  const handleFile = (file) => {
    if (validateFile(file)) {
      onChange(file, index)
    }
  }

  const handleChange = (e) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const displaySrc = value instanceof File
    ? URL.createObjectURL(value)
    : value
      ? getOptimizedImageUrl(value, 300, 80)
      : null

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-[#a0a0a0] mb-2">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      <div
        className="relative rounded-xl overflow-hidden transition-all duration-200"
        style={{
          border: dragOver
            ? '2px dashed #d4af37'
            : value
              ? '1px solid #3d3d3d'
              : '2px dashed #3d3d3d',
          background: dragOver ? 'rgba(212,175,55,0.05)' : '#2d2d2d',
          aspectRatio: '1',
        }}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !value && inputRef.current?.click()}
      >
        {displaySrc ? (
          <>
            <img
              src={displaySrc}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            {/* Overlay actions */}
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  inputRef.current?.click()
                }}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
                title="Change image"
              >
                <FiUpload size={16} />
              </button>
              {onRemove && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemove(index)
                  }}
                  className="p-2 rounded-lg bg-red-500/70 hover:bg-red-500 text-white transition-colors"
                  title="Remove image"
                >
                  <FiX size={16} />
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-2 p-4 cursor-pointer">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(212,175,55,0.1)' }}
            >
              <FiImage size={20} style={{ color: '#d4af37' }} />
            </div>
            <div className="text-center">
              <p className="text-xs font-medium text-[#a0a0a0]">
                Click or drag
              </p>
              <p className="text-[10px] text-[#6b7280] mt-0.5">
                JPG, PNG, WebP
              </p>
            </div>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />
      </div>

      {error && (
        <p className="text-xs text-red-400 mt-1">{error}</p>
      )}
    </div>
  )
}

export default ImageUpload