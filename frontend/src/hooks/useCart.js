import { useCallback } from 'react'
import { useCart as useCartContext } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useSettings } from '../context/SettingsContext.jsx'
import { calculateDelivery, calculateGrandTotal } from '../utils/formatPrice.js'
import toast from 'react-hot-toast'

// ✅ Enhanced useCart hook with extra helpers
const useCart = () => {
  const cartContext = useCartContext()
  const { isAuthenticated } = useAuth()
  const { settings } = useSettings()

  const {
    cartItems,
    cartLoading,
    products,
    addToCart: addToCartBase,
    updateQuantity,
    removeFromCart,
    clearCart,
    fetchCart,
    getCartCount,
    getCartTotal,
    getCartItemsForOrder,
    isInCart,
  } = cartContext

  // ✅ Add to cart with auth check
  const addToCart = useCallback(async (itemId, size = 'defaultSize', color = 'defaultColor') => {
    await addToCartBase(itemId, size, color)
  }, [addToCartBase])

  // ✅ Increment quantity
  const incrementQuantity = useCallback(async (itemId, size, color) => {
    const currentQty = cartItems[itemId]?.[size]?.[color]?.quantity || 0
    await updateQuantity(itemId, size, color, currentQty + 1)
  }, [cartItems, updateQuantity])

  // ✅ Decrement quantity
  const decrementQuantity = useCallback(async (itemId, size, color) => {
    const currentQty = cartItems[itemId]?.[size]?.[color]?.quantity || 0
    if (currentQty <= 1) {
      await removeFromCart(itemId, size, color)
    } else {
      await updateQuantity(itemId, size, color, currentQty - 1)
    }
  }, [cartItems, updateQuantity, removeFromCart])

  // ✅ Get quantity of specific item
  const getItemQuantity = useCallback((itemId, size = 'defaultSize', color = 'defaultColor') => {
    return cartItems[itemId]?.[size]?.[color]?.quantity || 0
  }, [cartItems])

  // ✅ Get subtotal
  const getSubtotal = useCallback(() => {
    return getCartTotal(products)
  }, [getCartTotal, products])

  // ✅ Get delivery charges
  const getDeliveryCharges = useCallback(() => {
    const subtotal = getSubtotal()
    const freeAbove = Number(settings?.freeDeliveryAbove) || 3000
    const charges = Number(settings?.deliveryCharges) || 250
    return calculateDelivery(subtotal, freeAbove, charges)
  }, [getSubtotal, settings])

  // ✅ Get grand total
  const getTotal = useCallback(() => {
    const subtotal = getSubtotal()
    const freeAbove = Number(settings?.freeDeliveryAbove) || 3000
    const charges = Number(settings?.deliveryCharges) || 250
    return calculateGrandTotal(subtotal, freeAbove, charges)
  }, [getSubtotal, settings])

  // ✅ Check if delivery is free
  const isFreeDelivery = useCallback(() => {
    const subtotal = getSubtotal()
    const freeAbove = Number(settings?.freeDeliveryAbove) || 3000
    return subtotal >= freeAbove
  }, [getSubtotal, settings])

  // ✅ Get amount needed for free delivery
  const amountForFreeDelivery = useCallback(() => {
    const subtotal = getSubtotal()
    const freeAbove = Number(settings?.freeDeliveryAbove) || 3000
    const remaining = freeAbove - subtotal
    return remaining > 0 ? remaining : 0
  }, [getSubtotal, settings])

  // ✅ Get cart items as flat array (for display)
  const getCartItemsArray = useCallback(() => {
    const items = []
    for (const itemId in cartItems) {
      const product = products.find(
        p => String(p._id || p.id) === String(itemId)
      )
      for (const size in cartItems[itemId]) {
        for (const color in cartItems[itemId][size]) {
          const qty = cartItems[itemId][size][color]?.quantity || 0
          if (qty > 0) {
            items.push({
              productId: itemId,
              product,
              quantity: qty,
              size: size !== 'defaultSize' ? size : '',
              color: color !== 'defaultColor' ? color : '',
              price: product?.price || 0,
              total: (product?.price || 0) * qty,
            })
          }
        }
      }
    }
    return items
  }, [cartItems, products])

  // ✅ Total items count
  const totalItems = getCartCount()

  // ✅ Is cart empty
  const isEmpty = totalItems === 0

  return {
    // State
    cartItems,
    cartLoading,
    products,
    totalItems,
    isEmpty,
    isAuthenticated,

    // Actions
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    fetchCart,
    incrementQuantity,
    decrementQuantity,

    // Getters
    getItemQuantity,
    getCartCount,
    getSubtotal,
    getDeliveryCharges,
    getTotal,
    getCartItemsForOrder,
    getCartItemsArray,
    isInCart,
    isFreeDelivery,
    amountForFreeDelivery,
  }
}

export default useCart