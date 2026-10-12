import { getStatusColor } from '../../utils/helpers.js'

const OrderStatusBadge = ({ status, size = 'sm' }) => {
  const colorClass = getStatusColor(status)

  const sizes = {
    xs: 'text-[10px] px-1.5 py-0.5',
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
  }

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${colorClass} ${sizes[size]}`}
    >
      <span
        className="w-1.5 h-1.5 rounded-full mr-1.5 flex-shrink-0"
        style={{ background: 'currentColor' }}
      />
      {status}
    </span>
  )
}

export default OrderStatusBadge