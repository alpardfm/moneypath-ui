import { api } from '../../services/api.js'
import { createServiceError } from '../../utils/service-error.js'

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
    throw createServiceError(error, 'Gagal memuat ringkasan.')
  }
}
