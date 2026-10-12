import { useState, useEffect, useCallback } from 'react'

const useFetch = (fetchFn, dependencies = []) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const execute = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await fetchFn()
      setData(result)
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, dependencies)

  useEffect(() => {
    execute()
  }, [execute])

  return { data, loading, error, refetch: execute }
}

export default useFetch