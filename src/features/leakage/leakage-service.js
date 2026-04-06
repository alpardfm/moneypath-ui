import { api } from '../../services/api.js'
import { createServiceError } from '../../utils/service-error.js'

export async function getLeakageReport(days = 30) {
  try {
    const payload = await api.get(`/leakage-detection?days=${days}`)
    return payload?.data || null
  } catch (error) {
    throw createServiceError(error, 'Gagal memuat insight kebocoran pengeluaran.')
  }
}
