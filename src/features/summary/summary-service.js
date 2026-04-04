import { api } from '../../services/api.js'
import { extractApiMessage } from '../../utils/api-message.js'

function createSummaryError(error, fallbackMessage) {
  const summaryError = new Error(extractApiMessage(error?.payload, fallbackMessage))
  summaryError.status = error?.status
  summaryError.payload = error?.payload
  return summaryError
}

export async function getSummaryReport(filters = {}) {
  const query = new URLSearchParams()

  if (filters.from) {
    query.set('from', filters.from)
  }

  if (filters.to) {
    query.set('to', filters.to)
  }

  const suffix = query.toString() ? `?${query.toString()}` : ''

  try {
    const payload = await api.get(`/summary${suffix}`)
    return payload?.data || null
  } catch (error) {
    throw createSummaryError(error, 'Gagal memuat ringkasan.')
  }
}
