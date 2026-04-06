import { api } from '../../services/api.js'
import { createServiceError } from '../../utils/service-error.js'

export async function getSettings() {
  try {
    const payload = await api.get('/settings')
    return payload?.data || null
  } catch (error) {
    throw createServiceError(error, 'Gagal memuat pengaturan.')
  }
}

export async function updateSettings(form) {
  try {
    const payload = await api.put('/settings', {
      preferred_currency: form.preferredCurrency,
      timezone: form.timezone,
      date_format: form.dateFormat,
      week_start_day: form.weekStartDay,
    })

    return payload?.data || null
  } catch (error) {
    throw createServiceError(error, 'Gagal memperbarui pengaturan.')
  }
}
