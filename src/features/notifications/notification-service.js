import { api } from '../../services/api.js'
import { createServiceError } from '../../utils/service-error.js'

export async function getNotifications() {
  try {
    const payload = await api.get('/notifications')
    return payload?.data?.items || payload?.items || []
  } catch (error) {
    throw createServiceError(error, 'Gagal memuat notifikasi.')
  }
}
