import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiShoppingCart } from 'react-icons/fi'
import useCart from '../../../hooks/useCart.js'

const CartIcon = ({ color = '#e5e5e5' }) => {
  const { getCartCount } = useCart()
  const count = getCartCount()

  return (
    <Link
      to="/cart"
      className="relative p-2 rounded-lg transition-colors"
      style={{ color }}
      aria-label={`Cart (${count} items)`}
    >
      <FiShoppingCart size={22} />
      {count > 0 && (
        <motion.span
          key={count}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
          style={{
            background: '#d4af37',
            color: '#1a1a1a',
            fontSize: '10px',
          }}
        >
          {count > 9 ? '9+' : count}
        </motion.span>
      )}
    </Link>
  )
}

export default CartIcon