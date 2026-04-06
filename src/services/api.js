import { clearAuthToken, getAuthToken } from '../utils/auth.js'
import { extractApiMessage } from '../utils/api-message.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

async function parseResponseBody(response) {
  if (response.status === 204) {
    return null
  }

  const contentLength = response.headers.get('content-length')

  if (contentLength === '0') {
    return null
  }

  const contentType = response.headers.get('content-type') || ''
  const responseText = await response.text()

  if (!responseText) {
    return null
  }

  if (contentType.includes('application/json')) {
    try {
      return JSON.parse(responseText)
    } catch {
      return responseText
    }
  }

  return responseText
}

async function request(path, options = {}) {
  const token = getAuthToken()
  const headers = new Headers(options.headers || {})

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json')
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (response.status === 401) {
    clearAuthToken()
  }

  const payload = await parseResponseBody(response)

  if (!response.ok) {
    const fallbackMessage = response.statusText
      ? `Permintaan gagal (${response.status} ${response.statusText}).`
      : `Permintaan gagal (${response.status}).`
    const error = new Error(extractApiMessage(payload, fallbackMessage))
    error.status = response.status
    error.payload = payload
    throw error
  }

  return payload
}

export const api = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) =>
    request(path, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: (path, body, options) =>
    request(path, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  patch: (path, body, options) =>
    request(path, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
}

export { API_BASE_URL }
