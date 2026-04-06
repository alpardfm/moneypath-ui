import { api } from '../../services/api.js'
import { createServiceError } from '../../utils/service-error.js'

export async function getDashboardOverview() {
  try {
    const payload = await api.get('/dashboard')

    if (!payload || typeof payload !== 'object') {
      throw new Error('Respons dashboard tidak valid.')
    }

    return payload.data || null
  } catch (error) {
    throw createServiceError(error, 'Gagal memuat dashboard.')
  }
}
