import { useState, useEffect, useCallback } from 'react'
import { productApi } from '../api/productApi.js'

const useProducts = (initialFilters = {}) => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState(initialFilters)

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await productApi.getAll()
      if (res.data.success) {
        setProducts(res.data.products || [])
        setFilteredProducts(res.data.products || [])
      }
    } catch (err) {
      setError('Failed to load products')
      console.error('useProducts error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // ✅ Apply filters
  useEffect(() => {
    let result = [...products]

    if (filters.category) {
      result = result.filter(p => p.category === filters.category)
    }
    if (filters.subCategory) {
      result = result.filter(p => p.subCategory === filters.subCategory)
    }
    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      )
    }
    if (filters.minPrice) {
      result = result.filter(p => p.price >= Number(filters.minPrice))
    }
    if (filters.maxPrice) {
      result = result.filter(p => p.price <= Number(filters.maxPrice))
    }
    if (filters.sort === 'price-low') {
      result.sort((a, b) => a.price - b.price)
    } else if (filters.sort === 'price-high') {
      result.sort((a, b) => b.price - a.price)
    } else if (filters.sort === 'newest') {
      result.sort((a, b) => (b.date || 0) - (a.date || 0))
    } else if (filters.sort === 'featured') {
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    }

    setFilteredProducts(result)
  }, [products, filters])

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({})
  }, [])

  return {
    products,
    filteredProducts,
    loading,
    error,
    filters,
    updateFilters,
    clearFilters,
    refetch: fetchProducts,
  }
}

export default useProducts