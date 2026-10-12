// context/CartContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { cartApi } from '../api/cartApi.js'
import { useAuth } from './AuthContext.jsx'
import toast from 'react-hot-toast'

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth()
  const [cartItems, setCartItems] = useState({})
  const [cartLoading, setCartLoading] = useState(false)
  const [products, setProducts] = useState([])

  // ✅ Load cart on auth change
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart()
    } else {
      const saved = localStorage.getItem('guestCart')
      if (saved) {
        try {
          setCartItems(JSON.parse(saved))
        } catch {
          setCartItems({})
        }
      }
    }
  }, [isAuthenticated])

  // ✅ Persist guest cart
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('guestCart', JSON.stringify(cartItems))
    }
  }, [cartItems, isAuthenticated])

  // ✅ Fetch cart from server
  const fetchCart = async () => {
    try {
      setCartLoading(true)
      const res = await cartApi.get()
      if (res.data.success) {
        setCartItems(res.data.cartData || {})
      }
    } catch (error) {
      console.error('Fetch cart error:', error)
    } finally {
      setCartLoading(false)
    }
  }

  // ✅ Add to cart
  const addToCart = useCallback(async (itemId, size = 'defaultSize', color = 'defaultColor') => {
    const updatedCart = structuredClone(cartItems)

    if (!updatedCart[itemId]) updatedCart[itemId] = {}
    if (!updatedCart[itemId][size]) updatedCart[itemId][size] = {}
    if (!updatedCart[itemId][size][color]) {
      updatedCart[itemId][size][color] = { quantity: 0 }
    }

    updatedCart[itemId][size][color].quantity += 1
    setCartItems(updatedCart)

    if (isAuthenticated) {
      try {
        await cartApi.add({ itemId, size, color })
      } catch (error) {
        console.error('Add to cart API error:', error)
      }
    }

    toast.success('Added to cart!', { icon: '🛒', duration: 2000 })
  }, [cartItems, isAuthenticated])

  // ✅ Update cart quantity
  const updateQuantity = useCallback(async (itemId, size, color, quantity) => {
    const updatedCart = structuredClone(cartItems)

    if (quantity <= 0) {
      if (updatedCart[itemId]?.[size]?.[color]) {
        delete updatedCart[itemId][size][color]
        if (Object.keys(updatedCart[itemId][size]).length === 0) {
          delete updatedCart[itemId][size]
        }
        if (Object.keys(updatedCart[itemId]).length === 0) {
          delete updatedCart[itemId]
        }
      }
    } else {
      if (!updatedCart[itemId]) updatedCart[itemId] = {}
      if (!updatedCart[itemId][size]) updatedCart[itemId][size] = {}
      updatedCart[itemId][size][color] = { quantity }
    }

    setCartItems(updatedCart)

    if (isAuthenticated) {
      try {
        await cartApi.update({ itemId, size, color, quantity })
      } catch (error) {
        console.error('Update cart API error:', error)
      }
    }
  }, [cartItems, isAuthenticated])

  // ✅ Remove from cart
  const removeFromCart = useCallback(async (itemId, size, color) => {
    await updateQuantity(itemId, size, color, 0)
    toast.success('Removed from cart')
  }, [updateQuantity])

  // ✅ Clear cart - clears state + localStorage + server
  const clearCart = useCallback(async () => {
    // 1. Clear React state immediately
    setCartItems({})

    // 2. Clear localStorage for guest
    localStorage.removeItem('guestCart')

    // 3. Clear on server if authenticated
    if (isAuthenticated) {
      try {
        await cartApi.clear()
      } catch (error) {
        console.error('Clear cart API error:', error)
        // ✅ Don't re-throw - cart is already cleared in UI
      }
    }
  }, [isAuthenticated])

  // ✅ Get total cart count
  const getCartCount = useCallback(() => {
    let count = 0
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        for (const color in cartItems[itemId][size]) {
          count += cartItems[itemId][size][color]?.quantity || 0
        }
      }
    }
    return count
  }, [cartItems])

  // ✅ Get cart total amount
  const getCartTotal = useCallback((productList) => {
    let total = 0
    const prods = productList || products

    for (const itemId in cartItems) {
      const product = prods.find(
        p => String(p._id || p.id) === String(itemId)
      )
      if (!product) continue

      for (const size in cartItems[itemId]) {
        for (const color in cartItems[itemId][size]) {
          const qty = cartItems[itemId][size][color]?.quantity || 0
          total += product.price * qty
        }
      }
    }
    return total
  }, [cartItems, products])

  // ✅ Get formatted cart items for order
  const getCartItemsForOrder = useCallback((productList) => {
    const items = []
    const prods = productList || products

    for (const itemId in cartItems) {
      const product = prods.find(
        p => String(p._id || p.id) === String(itemId)
      )
      if (!product) continue

      for (const size in cartItems[itemId]) {
        for (const color in cartItems[itemId][size]) {
          const qty = cartItems[itemId][size][color]?.quantity || 0
          if (qty > 0) {
            items.push({
              productId: itemId,
              name: product.name,
              price: product.price,
              image: product.images?.[0] || '',
              quantity: qty,
              size: size !== 'defaultSize' ? size : '',
              color: color !== 'defaultColor' ? color : '',
            })
          }
        }
      }
    }
    return items
  }, [cartItems, products])

  // ✅ Check if item is in cart
  const isInCart = useCallback((itemId, size = 'defaultSize', color = 'defaultColor') => {
    return (cartItems[itemId]?.[size]?.[color]?.quantity || 0) > 0
  }, [cartItems])

  const value = {
    cartItems,
    cartLoading,
    products,
    setProducts,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    fetchCart,
    getCartCount,
    getCartTotal,
    getCartItemsForOrder,
    isInCart,
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}

export default CartContext