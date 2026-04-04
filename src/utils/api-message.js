export function extractApiMessage(payload, fallbackMessage) {
  if (!payload) {
    return fallbackMessage
  }

  if (typeof payload === 'string') {
    return payload
  }

  if (typeof payload.message === 'string') {
    return payload.message
  }

  if (payload.error && typeof payload.error === 'object' && typeof payload.error.message === 'string') {
    return payload.error.message
  }

  if (typeof payload.error === 'string') {
    return payload.error
  }

  if (payload.errors && typeof payload.errors === 'object') {
    const firstError = Object.values(payload.errors).flat().find(Boolean)

    if (typeof firstError === 'string') {
      return firstError
    }
  }

  const nestedData = payload.data && typeof payload.data === 'object' ? payload.data : null

  if (nestedData?.message && typeof nestedData.message === 'string') {
    return nestedData.message
  }

  return fallbackMessage
}
