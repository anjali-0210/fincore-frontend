import { useEffect, useState } from 'react'
import api from '../api/client'

// Simple in-memory cache so we don't refetch the same option list repeatedly.
const cache = {}

export function useOptions(endpoint, enabled = true) {
  const [options, setOptions] = useState(cache[endpoint] || [])

  useEffect(() => {
    if (!enabled || !endpoint) return
    if (cache[endpoint]) { setOptions(cache[endpoint]); return }
    api.get(endpoint, { params: { per_page: 200 } })
      .then(({ data }) => {
        const rows = data.data || []
        cache[endpoint] = rows
        setOptions(rows)
      })
      .catch(() => setOptions([]))
  }, [endpoint, enabled])

  return options
}
