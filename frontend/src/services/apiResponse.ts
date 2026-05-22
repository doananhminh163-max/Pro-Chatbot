export type ApiResponse<T> = {
  success: boolean
  data?: T
  message?: string
  error?: {
    code: string
    message: string
    details?: unknown
  }
}

export async function readApiResponse<T>(response: Response): Promise<T> {
  const body = await response.text()
  const payload = body.trim() ? parseApiResponseBody<T>(body, response) : null

  if (!response.ok || !payload?.success || payload.data === undefined) {
    throw new Error(payload?.error?.message ?? payload?.message ?? `API request failed: ${response.status}`)
  }

  return payload.data
}

function parseApiResponseBody<T>(body: string, response: Response): ApiResponse<T> | null {
  try {
    return JSON.parse(body) as ApiResponse<T>
  } catch {
    if (!response.ok) return null
    throw new Error('API returned invalid JSON.')
  }
}
