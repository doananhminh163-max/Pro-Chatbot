import { useCallback, useEffect, useState } from 'react'
import { fetchAppData } from '../services/appDataService'
import type { AppState } from '../types/appData'

export function useAppData() {
  const [data, setData] = useState<AppState | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)
    try {
      const nextData = await fetchAppData(controller.signal)
      setData(nextData)
    } catch (caughtError) {
      if (controller.signal.aborted) {
        return
      }
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to load live workspace data')
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    let active = true
    fetchAppData(controller.signal)
      .then((nextData) => {
        if (active) {
          setData(nextData)
        }
      })
      .catch((caughtError: unknown) => {
        if (active && !controller.signal.aborted) {
          setError(caughtError instanceof Error ? caughtError.message : 'Unable to load live workspace data')
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })
    return () => {
      active = false
      controller.abort()
    }
  }, [])

  return { data, loading, error, refresh: load }
}
