import { Link } from 'react-router-dom'
import { FiChevronRight } from 'react-icons/fi'

const Breadcrumb = ({ items }) => {
  return (
    <nav className="flex items-center gap-1 text-sm py-3 flex-wrap">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1">
          {index > 0 && (
            <FiChevronRight
              className="text-[#6b7280]"
              size={14}
            />
          )}
          {item.url && index < items.length - 1 ? (
            <Link
              to={item.url}
              className="text-[#a0a0a0] hover:text-[#d4af37] transition-colors duration-200"
            >
              {item.name}
            </Link>
          ) : (
            <span className="text-[#d4af37] font-medium">
              {item.name}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}

export default Breadcrumb