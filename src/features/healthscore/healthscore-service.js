import { api } from '../../services/api.js'
import { createServiceError } from '../../utils/service-error.js'

export async function getFinancialHealthReport() {
  try {
    const payload = await api.get('/financial-health')
    return payload?.data || null
  } catch (error) {
    throw createServiceError(error, 'Gagal memuat skor kesehatan keuangan.')
  }
}
