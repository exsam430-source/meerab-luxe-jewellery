import { motion } from 'framer-motion'
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi'

const StatsCard = ({
  title,
  value,
  icon: Icon,
  trend = null,
  trendLabel = '',
  color = '#d4af37',
  loading = false,
  prefix = '',
  suffix = '',
  onClick = null,
}) => {
  const isPositive = trend > 0
  const isNeutral = trend === null

  return (
    <motion.div
      whileHover={onClick ? { y: -2 } : {}}
      onClick={onClick}
      className="card-dark p-5 rounded-2xl"
      style={{
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      {loading ? (
        <div className="space-y-3">
          <div className="skeleton h-4 w-24 rounded" />
          <div className="skeleton h-8 w-32 rounded" />
          <div className="skeleton h-3 w-20 rounded" />
        </div>
      ) : (
        <>
          {/* ✅ Top Row */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs text-[#6b7280] uppercase tracking-widest font-medium">
                {title}
              </p>
            </div>
            {Icon && (
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${color}15` }}
              >
                <Icon size={20} style={{ color }} />
              </div>
            )}
          </div>

          {/* ✅ Value */}
          <p
            className="font-playfair font-bold mb-2"
            style={{
              fontSize: 'clamp(22px, 3vw, 30px)',
              color: '#ffffff',
              lineHeight: 1,
            }}
          >
            {prefix}
            {typeof value === 'number'
              ? value.toLocaleString('en-PK')
              : value || '0'}
            {suffix}
          </p>

          {/* ✅ Trend */}
          {!isNeutral && (
            <div className="flex items-center gap-1">
              {isPositive ? (
                <FiTrendingUp size={13} style={{ color: '#10b981' }} />
              ) : (
                <FiTrendingDown size={13} style={{ color: '#ef4444' }} />
              )}
              <span
                className="text-xs font-medium"
                style={{ color: isPositive ? '#10b981' : '#ef4444' }}
              >
                {isPositive ? '+' : ''}{trend}%
              </span>
              {trendLabel && (
                <span className="text-xs text-[#6b7280]">
                  {trendLabel}
                </span>
              )}
            </div>
          )}

          {/* Gold accent bar */}
          <div
            className="absolute bottom-0 left-0 h-0.5 rounded-b-2xl transition-all duration-300"
            style={{
              background: `linear-gradient(90deg, ${color}, transparent)`,
              width: '40%',
            }}
          />
        </>
      )}
    </motion.div>
  )
}

export default StatsCard