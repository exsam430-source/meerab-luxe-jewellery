import { useState } from 'react'
import { getOptimizedImageUrl } from '../../utils/helpers.js'

const LazyImage = ({
  src,
  alt,
  className = '',
  width = 400,
  quality = 80,
  placeholder = null,
  style = {},
}) => {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  const optimizedSrc = getOptimizedImageUrl(src, width, quality)

  const fallback = placeholder || (
    <div
      className={`skeleton ${className}`}
      style={{ aspectRatio: '1', ...style }}
    />
  )

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-[#2d2d2d] ${className}`}
        style={style}
      >
        <span className="text-[#6b7280] text-xs">No Image</span>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden">
      {!loaded && fallback}
      <img
        src={optimizedSrc || src}
        alt={alt}
        loading="lazy"
        className={`${className} ${!loaded ? 'opacity-0 absolute inset-0' : 'opacity-100'} transition-opacity duration-300`}
        style={style}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </div>
  )
}

export default LazyImage